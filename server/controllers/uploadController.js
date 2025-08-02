const { bucket } = require('../firebase');
const { v4: uuidv4 } = require('uuid');

exports.handleUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filename = Date.now() + '-' + req.file.originalname;
    const file = bucket.file(filename);

    const stream = file.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
        metadata: {
          firebaseStorageDownloadTokens: uuidv4(),
        },
      },
    });

    stream.end(req.file.buffer);

    stream.on('error', (err) => {
      console.error('Firebase Upload Error:', err);
      res.status(500).json({ error: 'Upload failed' });
    });

    stream.on('finish', () => {
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${
        bucket.name
      }/o/${encodeURIComponent(filename)}?alt=media`;
      res.status(200).json({
        filename,
        url: publicUrl,
        uploadedAt: new Date().toISOString(),
      });
    });
  } catch (err) {
    console.error('Upload Controller Error:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};
