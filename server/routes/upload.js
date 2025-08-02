// routes/upload.js
const express = require("express");
const router = express.Router();
const { upload, uploadToGridFS } = require("../controller/uploadController");
const mongoose = require("mongoose");

// Upload PDF endpoint
router.post("/pdf", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // Upload to GridFS
    const uploadedFile = await uploadToGridFS(req.file);

    res.status(200).json({
      success: true,
      message: "PDF uploaded successfully",
      file: uploadedFile,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      message: "Error uploading file",
      error: error.message,
    });
  }
});

// Get all uploaded PDFs
router.get("/pdfs", async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const collection = db.collection("pdfs.files");

    const files = await collection.find({}).toArray();

    if (!files || files.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No files found",
      });
    }

    res.status(200).json({
      success: true,
      files: files.map((file) => ({
        id: file._id,
        filename: file.filename,
        originalName: file.metadata?.originalName || file.filename,
        size: file.length,
        uploadDate: file.uploadDate,
        contentType: file.contentType || "application/pdf",
      })),
    });
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching files",
      error: error.message,
    });
  }
});

// Download PDF by ID
router.get("/pdf/:id", async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: "pdfs" });

    const fileId = new mongoose.Types.ObjectId(req.params.id);

    // Check if file exists
    const file = await db.collection("pdfs.files").findOne({ _id: fileId });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    // Set proper headers for PDF
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${file.filename}"`,
    });

    // Stream the file
    const downloadStream = bucket.openDownloadStream(fileId);
    downloadStream.pipe(res);

    downloadStream.on("error", (error) => {
      console.error("Download error:", error);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: "Error downloading file",
        });
      }
    });
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({
      success: false,
      message: "Error downloading file",
      error: error.message,
    });
  }
});

// Delete PDF by ID
router.delete("/pdf/:id", async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: "pdfs" });

    const fileId = new mongoose.Types.ObjectId(req.params.id);

    // Check if file exists
    const file = await db.collection("pdfs.files").findOne({ _id: fileId });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    await bucket.delete(fileId);

    res.status(200).json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting file",
      error: error.message,
    });
  }
});

module.exports = router;
