const admin = require('firebase-admin');
const serviceAccount = require('../skillora-adminsdk.json');  // Make sure this file is in place

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

async function verifyFirebaseToken(idToken) {
    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        return decodedToken;
    } catch (error) {
        console.error('Error verifying Firebase token:', error);
        throw new Error('Invalid Firebase token');
    }
}

module.exports = { verifyFirebaseToken };
