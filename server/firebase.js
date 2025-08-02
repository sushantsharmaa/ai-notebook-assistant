// server/firebase.js
const admin = require('firebase-admin');

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS_JSON);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'your-project-id.appspot.com', // replace with your actual bucket
  });
}

const bucket = admin.storage().bucket();
const firestore = admin.firestore();

module.exports = { admin, bucket, firestore };
