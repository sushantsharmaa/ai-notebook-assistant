const admin = require('firebase-admin');

const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS_JSON);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'your-project-id.appspot.com', // 🔁 Replace with your real bucket
});

const bucket = admin.storage().bucket();
const firestore = admin.firestore();

module.exports = { admin, bucket, firestore };
