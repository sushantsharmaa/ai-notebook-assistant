// require("dotenv").config();
// const { Configuration, OpenAIApi } = require("openai");

// const openai = new OpenAIApi(
//   new Configuration({ apiKey: process.env.OPENAI_API_KEY })
// );

// exports.chatWithPDF = async (question, pdfPath) => {
//   const response = await openai.createChatCompletion({
//     model: "gpt-4",
//     messages: [
//       { role: "system", content: `You are analyzing a PDF at ${pdfPath}` },
//       { role: "user", content: question },
//     ],
//   });

//   return {
//     answer: response.data.choices[0].message?.content || "No answer",
//     citations: [2, 5], // mock page citations
//   };
// };
