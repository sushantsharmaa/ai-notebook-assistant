const express = require('express');
const router = express.Router();
const multer = require('multer');
const { handleUpload } = require('../controllers/uploadController');

// Use memory storage to avoid saving locally
const upload = multer({ storage: multer.memoryStorage() });

// Important: change "pdf" to match your frontend's `formData.append("file", ...)`
router.post('/', upload.single('file'), handleUpload);

module.exports = router;
