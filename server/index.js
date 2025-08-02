require('dotenv').config();
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const path = require('path');

const uploadRoutes = require('./routes/upload');
const chatRoutes = require('./routes/chat');

const app = express();
const PORT = process.env.PORT || 5000;

// ===== FIREBASE SETUP =====
const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS_JSON);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'your-project-id.appspot.com', // ✅ replace with your actual project ID
});

// Attach bucket and Firestore to app locals so routes can access them
app.locals.bucket = admin.storage().bucket();
app.locals.firestore = admin.firestore();

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());

// 🔁 No need to serve local /uploads anymore
// app.use("/pdfs", express.static(path.join(__dirname, "uploads"))); ❌

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
