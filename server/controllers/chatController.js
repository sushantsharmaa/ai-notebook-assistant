const fs = require("fs");
const path = require("path");
const pdf = require("pdf-parse");

const pdfStore = new Map();
async function getAIResponse(question, pdfContent, filename, pdfPages) {
  try {
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

    if (!OPENROUTER_API_KEY) {
      throw new Error("OpenRouter API key not found in environment variables");
    }

    const maxContentLength = 8000;
    const truncatedContent =
      pdfContent.length > maxContentLength
        ? pdfContent.substring(0, maxContentLength) +
          "...\n\n[Note: Content truncated due to length]"
        : pdfContent;

    const prompt = `You are an AI assistant helping users understand a PDF document. Based on the document content provided, answer the user's question accurately and concisely.

Document: "${filename}"
Total Pages: ${pdfPages}
Content: ${truncatedContent}

User Question: ${question}

Instructions:
1. Answer the question based solely on the document content provided
2. Be concise, accurate, and helpful
3. If the information exists in the document, provide a clear answer
4. If the answer isn't clearly available in the provided content, state this clearly
5. When referencing specific information, try to indicate which part of the content it comes from
6. IMPORTANT: At the end of your response, if you found relevant information, add citations in this exact format:
   CITATIONS: [Page X, Page Y] (where X, Y are your best estimates of which pages contain the relevant information)
   
   Guidelines for page estimation:
   - For documents with ${pdfPages} total pages
   - If referencing content from the beginning: use pages 1-2
   - If referencing content from the middle: use middle page numbers
   - If referencing content from throughout: use multiple page numbers
   - If you cannot determine specific pages, use: CITATIONS: [Pages 1-${pdfPages}]

Answer:`;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "X-Title": "PDF Chat Application",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          max_tokens: 1000,
          temperature: 0.3,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse =
      data.choices[0]?.message?.content ||
      "Sorry, I could not generate a response.";

    const { cleanResponse, citations } = extractCitationsFromResponse(
      aiResponse,
      pdfPages
    );

    return { response: cleanResponse, citations };
  } catch (error) {
    console.error("OpenRouter API error:", error);
    return {
      response:
        "Sorry, I encountered an error while processing your question. Please try again.",
      citations: [],
    };
  }
}

function extractCitationsFromResponse(response, totalPages) {
  const citations = [];
  let cleanResponse = response;

  const citationRegex = /CITATIONS:\s*\[(.*?)\]/i;
  const citationMatch = response.match(citationRegex);

  if (citationMatch) {
    cleanResponse = response.replace(citationRegex, "").trim();

    const citationText = citationMatch[1];

    if (citationText.includes("-")) {
      const rangeMatch = citationText.match(/Pages?\s*(\d+)-(\d+)/i);
      if (rangeMatch) {
        const start = parseInt(rangeMatch[1]);
        const end = parseInt(rangeMatch[2]);
        for (let i = start; i <= Math.min(end, totalPages); i++) {
          citations.push({
            page: i,
            text: `Referenced content from page ${i}`,
          });
        }
      }
    } else {
      const pageMatches = citationText.match(/Page\s*(\d+)/gi);
      if (pageMatches) {
        pageMatches.forEach((match) => {
          const pageNum = parseInt(match.match(/\d+/)[0]);
          if (pageNum <= totalPages) {
            citations.push({
              page: pageNum,
              text: `Referenced content from page ${pageNum}`,
            });
          }
        });
      }
    }
  }

  if (citations.length === 0) {
    citations.push({
      page: 1,
      text: "Content referenced from document",
    });
  }

  return { cleanResponse, citations };
}

async function extractPdfWithPages(dataBuffer) {
  try {
    const pdfData = await pdf(dataBuffer);

    const avgCharsPerPage = Math.ceil(pdfData.text.length / pdfData.numpages);
    const pages = [];

    for (let i = 0; i < pdfData.numpages; i++) {
      const start = i * avgCharsPerPage;
      const end = Math.min((i + 1) * avgCharsPerPage, pdfData.text.length);
      pages.push({
        page: i + 1,
        content: pdfData.text.substring(start, end),
      });
    }

    return {
      text: pdfData.text,
      numpages: pdfData.numpages,
      info: pdfData.info,
      pages: pages,
    };
  } catch (error) {
    throw error;
  }
}

exports.handleChat = async (req, res) => {
  try {
    const { question, filename } = req.body;

    if (!question || !filename) {
      return res.status(400).json({
        error: "Question and filename are required",
      });
    }

    if (!pdfStore.has(filename)) {
      const filePath = path.join(__dirname, "../uploads", filename);

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({
          error: "PDF file not found",
        });
      }

      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await extractPdfWithPages(dataBuffer);

      pdfStore.set(filename, pdfData);
    }

    const pdfContent = pdfStore.get(filename);

    const aiResult = await getAIResponse(
      question,
      pdfContent.text,
      filename,
      pdfContent.numpages
    );

    res.json({
      question,
      response: aiResult.response,
      citations: aiResult.citations,
      pdfInfo: {
        numPages: pdfContent.numpages,
        filename,
      },
    });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({
      error: "Failed to process chat request",
    });
  }
};

exports.extractPdfContent = async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, "../uploads", filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        error: "PDF file not found",
      });
    }

    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await extractPdfWithPages(dataBuffer);

    pdfStore.set(filename, pdfData);

    res.json({
      filename,
      numPages: pdfData.numpages,
      extractedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("PDF extraction error:", error);
    res.status(500).json({
      error: "Failed to extract PDF content",
    });
  }
};
