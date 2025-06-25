// routes/certificate.js
const express = require('express');
const { issueCertificate } = require('../controllers/certificateController');
const { getUserCertificates } = require('../controllers/certificateController');

const { auth } = require('../middleware/auth');
const router = express.Router();

router.post('/issue', auth, issueCertificate);
router.get('/issue', auth,getUserCertificates);

module.exports = router;
