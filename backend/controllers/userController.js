const db = require('../config/database');

// Get user profile with account info
const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    const [users] = await db.promise().query(
      `SELECT 
        u.id,
        u.username,
        u.email,
        u.account_number,
        a.current_balance,
        a.currency,
        a.transaction_limit,
        s.ai_fraud_detection,
        s.photo_verification,
        s.location_tracking
       FROM users u
       LEFT JOIN accounts a ON u.id = a.user_id
       LEFT JOIN security_settings s ON u.id = s.user_id
       WHERE u.id = ?`,
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      user: users[0]
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
};

module.exports = {
  getUserProfile
};