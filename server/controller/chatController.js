const mongoose = require("mongoose");
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
3. If the information exists in the document, provide a clear answer.

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
          model: "mistralai/mistral-7b-instruct",
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

// Function to get PDF from GridFS by ID
async function getPdfFromGridFS(fileId) {
  return new Promise((resolve, reject) => {
    try {
      const db = mongoose.connection.db;
      const bucket = new mongoose.mongo.GridFSBucket(db, {
        bucketName: "pdfs",
      });

      const downloadStream = bucket.openDownloadStream(
        new mongoose.Types.ObjectId(fileId)
      );
      const chunks = [];

      downloadStream.on("data", (chunk) => {
        chunks.push(chunk);
      });

      downloadStream.on("end", () => {
        const buffer = Buffer.concat(chunks);
        resolve(buffer);
      });

      downloadStream.on("error", (error) => {
        reject(error);
      });
    } catch (error) {
      reject(error);
    }
  });
}

// Function to get PDF from GridFS by filename
async function getPdfFromGridFSByFilename(filename) {
  try {
    const db = mongoose.connection.db;
    const collection = db.collection("pdfs.files");

    // Find file by filename
    const file = await collection.findOne({ filename: filename });

    if (!file) {
      throw new Error("File not found");
    }

    // Get the file content
    const buffer = await getPdfFromGridFS(file._id);
    return buffer;
  } catch (error) {
    throw error;
  }
}

exports.handleChat = async (req, res) => {
  try {
    const { question, fileId, filename } = req.body;

    if (!question) {
      return res.status(400).json({
        error: "Question is required",
      });
    }

    if (!fileId && !filename) {
      return res.status(400).json({
        error: "Either fileId or filename is required",
      });
    }

    // Use fileId or filename as cache key
    const cacheKey = fileId || filename;

    if (!pdfStore.has(cacheKey)) {
      let dataBuffer;

      if (fileId) {
        // Get PDF by ID
        dataBuffer = await getPdfFromGridFS(fileId);
      } else {
        // Get PDF by filename
        dataBuffer = await getPdfFromGridFSByFilename(filename);
      }

      const pdfData = await extractPdfWithPages(dataBuffer);
      pdfStore.set(cacheKey, pdfData);
    }

    const pdfContent = pdfStore.get(cacheKey);

    const aiResult = await getAIResponse(
      question,
      pdfContent.text,
      filename || `file-${fileId}`,
      pdfContent.numpages
    );

    res.json({
      question,
      response: aiResult.response,
      citations: aiResult.citations,
      pdfInfo: {
        numPages: pdfContent.numpages,
        filename: filename || `file-${fileId}`,
      },
    });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({
      error: "Failed to process chat request",
      details: error.message,
    });
  }
};

exports.extractPdfContent = async (req, res) => {
  try {
    const { fileId } = req.params;

    if (!fileId) {
      return res.status(400).json({
        error: "File ID is required",
      });
    }

    // Check if file exists in GridFS
    const db = mongoose.connection.db;
    const collection = db.collection("pdfs.files");
    const file = await collection.findOne({
      _id: new mongoose.Types.ObjectId(fileId),
    });

    if (!file) {
      return res.status(404).json({
        error: "PDF file not found",
      });
    }

    const dataBuffer = await getPdfFromGridFS(fileId);
    const pdfData = await extractPdfWithPages(dataBuffer);

    pdfStore.set(fileId, pdfData);

    res.json({
      fileId,
      filename: file.filename,
      numPages: pdfData.numpages,
      extractedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("PDF extraction error:", error);
    res.status(500).json({
      error: "Failed to extract PDF content",
      details: error.message,
    });
  }
};

// New endpoint to extract PDF content by filename
exports.extractPdfContentByFilename = async (req, res) => {
  try {
    const { filename } = req.params;

    if (!filename) {
      return res.status(400).json({
        error: "Filename is required",
      });
    }

    const dataBuffer = await getPdfFromGridFSByFilename(filename);
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
      details: error.message,
    });
  }
};
