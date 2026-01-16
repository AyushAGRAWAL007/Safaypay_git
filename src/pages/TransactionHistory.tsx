import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Transaction {
  id: number;
  type: 'sent' | 'received';
  amount: number;
  recipient_sender: string;
  category: string;
  status: string;
  requires_verification: boolean;
  verified: boolean;
  transaction_time: string;
  current_balance: number;
}

const TransactionHistory: React.FC<{ userId: string }> = ({ userId }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    fetchTransactionHistory();
  }, [userId]);

  const fetchTransactionHistory = async () => {
    try {
      const response = await axios.get(`/api/transactions/history/${userId}`);
      setTransactions(response.data.transactions);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    }
  };

  const verifyTransaction = async (transactionId: number) => {
    try {
      await axios.post('/api/transactions/verify', { transaction_id: transactionId });
      fetchTransactionHistory(); // Refresh list
    } catch (error) {
      console.error('Failed to verify transaction:', error);
    }
  };

  return (
    <div className="transaction-history">
      <h3>Transaction History</h3>
      {transactions.map(transaction => (
        <div key={transaction.id} className={`transaction-item ${transaction.type}`}>
          <div className="transaction-header">
            <span className={`type-badge ${transaction.type}`}>
              {transaction.type.toUpperCase()}
            </span>
            <span className="amount">₹{transaction.amount}</span>
            <span className={`status ${transaction.status}`}>
              {transaction.status}
            </span>
          </div>
          
          <div className="transaction-details">
            <p><strong>{transaction.type === 'sent' ? 'To:' : 'From:'}</strong> {transaction.recipient_sender}</p>
            <p><strong>Category:</strong> {transaction.category}</p>
            <p><strong>Date:</strong> {new Date(transaction.transaction_time).toLocaleString()}</p>
            <p><strong>Balance:</strong> ₹{transaction.current_balance}</p>
          </div>

          {transaction.requires_verification && !transaction.verified && (
            <div className="verification-alert">
              <span>⚠️ Requires Verification</span>
              <button 
                onClick={() => verifyTransaction(transaction.id)}
                className="verify-btn"
              >
                Verify Now
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};