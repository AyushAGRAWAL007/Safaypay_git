const db = require('../config/database');

// Get transaction history for a user
const getTransactionHistory = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    const [transactions] = await db.promise().query(
      `SELECT 
        t.id,
        t.type,
        t.amount,
        t.recipient_sender,
        t.category,
        t.status,
        t.requires_verification,
        t.verified,
        t.transaction_time,
        t.created_at,
        a.current_balance
       FROM transactions t
       JOIN accounts a ON t.account_id = a.id
       WHERE a.user_id = ?
       ORDER BY t.transaction_time DESC`,
      [userId]
    );

    res.json({
      success: true,
      transactions: transactions
    });
  } catch (error) {
    console.error('Transaction history error:', error);
    res.status(500).json({ error: 'Failed to fetch transaction history' });
  }
};

// Create new transaction
const createTransaction = async (req, res) => {
  try {
    const { user_id, type, amount, recipient_sender, category, account_id } = req.body;
    
    const connection = await db.promise().getConnection();
    await connection.beginTransaction();

    try {
      // Insert transaction
      const [result] = await connection.query(
        `INSERT INTO transactions 
         (account_id, type, amount, recipient_sender, category, status, requires_verification) 
         VALUES (?, ?, ?, ?, ?, 'pending', ?)`,
        [account_id, type, amount, recipient_sender, category, amount > 5000] // Require verification for large amounts
      );

      // Update account balance based on transaction type
      if (type === 'sent') {
        await connection.query(
          'UPDATE accounts SET current_balance = current_balance - ? WHERE id = ?',
          [amount, account_id]
        );
      } else if (type === 'received') {
        await connection.query(
          'UPDATE accounts SET current_balance = current_balance + ? WHERE id = ?',
          [amount, account_id]
        );
      }

      await connection.commit();

      res.json({
        success: true,
        transactionId: result.insertId,
        requiresVerification: amount > 5000,
        message: 'Transaction created successfully'
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({ error: 'Transaction failed' });
  }
};

// Verify transaction (for large amounts)
const verifyTransaction = async (req, res) => {
  try {
    const { transaction_id } = req.body;
    
    await db.promise().query(
      `UPDATE transactions 
       SET status = 'verified', verified = TRUE 
       WHERE id = ?`,
      [transaction_id]
    );

    res.json({
      success: true,
      message: 'Transaction verified successfully'
    });
  } catch (error) {
    console.error('Verify transaction error:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
};

module.exports = {
  getTransactionHistory,
  createTransaction,
  verifyTransaction
};