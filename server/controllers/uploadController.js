const fs = require("fs");
const path = require("path");
const pdf = require("pdf-parse");

exports.handleUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filename = req.file.filename;
    const filePath = `/pdfs/${filename}`;

    const fullPath = path.join(__dirname, "../uploads", filename);
    const dataBuffer = fs.readFileSync(fullPath);
    const pdfData = await pdf(dataBuffer);

    res.json({
      filePath,
      filename,
      numPages: pdfData.numpages,
      uploadedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      error: "Failed to process uploaded file",
    });
  }
};
