require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const uploadRoutes = require('./routes/upload');
const chatRoutes = require('./routes/chat');
const { bucket, firestore } = require('./firebase'); // ✅ Import shared instance

const app = express();
const PORT = process.env.PORT || 5000;

// Set to app locals
app.locals.bucket = bucket;
app.locals.firestore = firestore;

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());

app.use('/upload', uploadRoutes);
app.use('/chat', chatRoutes);

// ===== HEALTH CHECK =====
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
