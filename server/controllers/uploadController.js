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
          firebaseStorageDownloadTokens: uuidv4(), // Needed for direct file access
        },
      },
    });

    // 🛑 Setup event listeners BEFORE ending the stream
    stream.on('error', (err) => {
      console.error('🔥 Firebase Upload Error:', err);
      return res.status(500).json({ error: err.message || 'Upload failed' });
    });

    stream.on('finish', () => {
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${
        bucket.name
      }/o/${encodeURIComponent(filename)}?alt=media&token=${
        file.metadata?.metadata?.firebaseStorageDownloadTokens
      }`;

      console.log('✅ File uploaded:', publicUrl);

      return res.status(200).json({
        filename,
        url: publicUrl,
        uploadedAt: new Date().toISOString(),
      });
    });

    // ✅ Only call .end() AFTER setting up event listeners
    stream.end(req.file.buffer);
  } catch (err) {
    console.error('🔥 Upload Controller Error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};
