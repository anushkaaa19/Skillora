// firebaseAdmin.js
const admin = require("firebase-admin");
const serviceAccount = require("./skillora-adminsdk.json"); // correct path

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
