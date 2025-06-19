const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json"); // or wherever your JSON key is

// Initialize only if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

module.exports = admin; // ✅ Do NOT do admin.auth() here
