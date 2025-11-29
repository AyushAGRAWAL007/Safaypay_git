// routes/verification.js
const express = require('express');
const { authenticate } = require('../middleware/auth');
const { getVerificationStatus, submitVerification } = require('../controllers/verificationController');

const router = express.Router();

router.use(authenticate);

router.get('/status', getVerificationStatus);
router.post('/submit', submitVerification);

module.exports = router;