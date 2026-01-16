const db = require('../config/database');

// Report scammer with photo and location data
const reportScammer = async (req, res) => {
  try {
    const {
      reporter_user_id,
      scammer_photo_data,
      scammer_location,
      scammer_coordinates,
      scammer_upi_id,
      scammer_phone,
      transaction_amount,
      report_description,
      report_category,
      device_info
    } = req.body;

    // Check if this scammer already exists
    const [existingScammer] = await db.promise().query(
      `SELECT id, verified_reports FROM scammer_reports 
       WHERE (scammer_upi_id = ? OR scammer_phone = ?) AND status = 'confirmed'`,
      [scammer_upi_id, scammer_phone]
    );

    if (existingScammer.length > 0) {
      // Update existing scammer report count
      await db.promise().query(
        `UPDATE scammer_reports 
         SET verified_reports = verified_reports + 1,
             confidence_score = LEAST(1.0, confidence_score + 0.1)
         WHERE id = ?`,
        [existingScammer[0].id]
      );

      res.json({
        success: true,
        reportId: existingScammer[0].id,
        existingReport: true,
        message: 'Scammer report updated (existing scammer)'
      });
    } else {
      // Calculate initial confidence score based on evidence
      let confidence_score = 0.3; // Base score
      if (scammer_photo_data) confidence_score += 0.2;
      if (scammer_upi_id) confidence_score += 0.2;
      if (scammer_phone) confidence_score += 0.1;
      if (transaction_amount) confidence_score += 0.1;
      if (scammer_coordinates) confidence_score += 0.1;

      // Insert new scammer report
      const [result] = await db.promise().query(
        `INSERT INTO scammer_reports 
         (reporter_user_id, scammer_photo_data, scammer_location, scammer_coordinates, 
          scammer_upi_id, scammer_phone, transaction_amount, report_description, 
          report_category, confidence_score, device_info) 
         VALUES (?, ?, ?, POINT(?, ?), ?, ?, ?, ?, ?, ?, ?)`,
        [
          reporter_user_id,
          scammer_photo_data,
          scammer_location,
          scammer_coordinates?.lat || null,
          scammer_coordinates?.lng || null,
          scammer_upi_id,
          scammer_phone,
          transaction_amount,
          report_description,
          report_category,
          confidence_score,
          device_info
        ]
      );

      res.json({
        success: true,
        reportId: result.insertId,
        existingReport: false,
        confidenceScore: confidence_score,
        message: 'Scam report submitted successfully'
      });
    }
  } catch (error) {
    console.error('Scam report error:', error);
    res.status(500).json({ error: 'Failed to submit scam report' });
  }
};

// Get scam reports for a user
const getUserScamReports = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    const [reports] = await db.promise().query(
      `SELECT 
        id,
        scammer_upi_id,
        scammer_phone,
        scammer_location,
        transaction_amount,
        report_category,
        confidence_score,
        verified_reports,
        status,
        created_at
       FROM scammer_reports 
       WHERE reporter_user_id = ? 
       ORDER BY created_at DESC`,
      [userId]
    );

    res.json({
      success: true,
      reports: reports
    });
  } catch (error) {
    console.error('Get scam reports error:', error);
    res.status(500).json({ error: 'Failed to fetch scam reports' });
  }
};

// Check if a UPI ID or phone is reported as scammer
const checkScammer = async (req, res) => {
  try {
    const { upi_id, phone } = req.query;
    
    const [scammers] = await db.promise().query(
      `SELECT 
        scammer_upi_id,
        scammer_phone,
        scammer_location,
        confidence_score,
        verified_reports,
        report_category
       FROM scammer_reports 
       WHERE status = 'confirmed' 
         AND (scammer_upi_id = ? OR scammer_phone = ?)
       ORDER BY confidence_score DESC 
       LIMIT 1`,
      [upi_id, phone]
    );

    res.json({
      success: true,
      isScammer: scammers.length > 0,
      scammerData: scammers[0] || null
    });
  } catch (error) {
    console.error('Check scammer error:', error);
    res.status(500).json({ error: 'Failed to check scammer database' });
  }
};

module.exports = {
  reportScammer,
  getUserScamReports,
  checkScammer
};