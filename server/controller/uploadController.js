// controllers/uploadController.js
const multer = require("multer");
const mongoose = require("mongoose");
const { Readable } = require("stream");

// Memory storage for multer
const storage = multer.memoryStorage();

// File filter to only accept PDFs
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed!"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Function to upload file to GridFS
const uploadToGridFS = async (file) => {
  return new Promise((resolve, reject) => {
    const db = mongoose.connection.db;
    const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: "pdfs" });

    const filename = `${Date.now()}-${file.originalname}`;
    const uploadStream = bucket.openUploadStream(filename, {
      metadata: {
        originalName: file.originalname,
        uploadDate: new Date(),
      },
    });

    // Convert buffer to readable stream
    const readableStream = new Readable({
      read() {},
    });
    readableStream.push(file.buffer);
    readableStream.push(null);

    uploadStream.on("error", (error) => {
      reject(error);
    });

    uploadStream.on("finish", () => {
      resolve({
        id: uploadStream.id,
        filename: filename,
        originalname: file.originalname,
        size: file.size,
        uploadDate: new Date(),
      });
    });

    readableStream.pipe(uploadStream);
  });
};

module.exports = { upload, uploadToGridFS };
