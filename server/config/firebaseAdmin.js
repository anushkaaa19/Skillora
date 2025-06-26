const admin = require("firebase-admin");

// Step 1: Parse JSON from env
const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_JSON);

// Step 2: Fix private_key formatting
serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

// Step 3: Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

module.exports = admin;
