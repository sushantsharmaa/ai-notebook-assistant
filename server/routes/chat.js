const express = require("express");
const router = express.Router();
const {
  handleChat,
  extractPdfContent,
} = require("../controllers/chatController");

router.post("/", handleChat);

router.get("/extract/:filename", extractPdfContent);

module.exports = router;
