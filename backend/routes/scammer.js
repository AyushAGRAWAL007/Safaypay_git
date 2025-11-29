// routes/scammer.js
const express = require('express');
const { authenticate } = require('../middleware/auth');
const { 
    reportScammer, 
    checkScammer, 
    getScammerReports, 
    updateReportStatus 
} = require('../controllers/scammerController');

const router = express.Router();

router.use(authenticate);

router.post('/report', reportScammer);
router.post('/check', checkScammer);
router.get('/reports', getScammerReports);
router.put('/reports/:id/status', updateReportStatus);

module.exports = router;