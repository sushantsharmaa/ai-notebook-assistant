const express = require("express");
const router = express.Router();
const {
  handleChat,
  extractPdfContent,
  extractPdfContentByFilename,
} = require("../controller/chatController");

router.post("/", handleChat);

router.get("/extract/:fileId", extractPdfContent);

router.get("/extract/filename/:filename", extractPdfContentByFilename);

module.exports = router;
