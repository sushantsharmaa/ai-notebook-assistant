// routes/chat.js
const express = require("express");
const router = express.Router();
const {
  handleChat,
  extractPdfContent,
  extractPdfContentByFilename,
} = require("../controller/chatController"); // Fixed: controllers (plural)

// Chat with PDF using fileId or filename
router.post("/", handleChat);

// Extract PDF content by fileId
router.get("/extract/:fileId", extractPdfContent);

// Extract PDF content by filename
router.get("/extract/filename/:filename", extractPdfContentByFilename);

module.exports = router;
