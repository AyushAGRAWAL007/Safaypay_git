USE safapay;

-- Insert sample users
INSERT INTO users (username, email, account_number) VALUES
('Rahul Sharma', 'rahul@example.com', 'ACC001'),
('Priya Patel', 'priya@example.com', 'ACC002'),
('Amit Kumar', 'amit@example.com', 'ACC003');

-- Insert accounts
INSERT INTO accounts (user_id, current_balance, transaction_limit) VALUES
(1, 15000.00, 65000.00),
(2, 25000.00, 65000.00),
(3, 35000.00, 65000.00);

-- Insert security settings
INSERT INTO security_settings (user_id) VALUES (1), (2), (3);

-- Insert sample transactions
INSERT INTO transactions (account_id, type, amount, recipient_sender, category, status) VALUES
(1, 'sent', 1000.00, 'Priya Patel', 'Shopping', 'completed'),
(2, 'received', 1000.00, 'Rahul Sharma', 'Shopping', 'completed'),
(1, 'sent', 500.00, 'Amit Kumar', 'Food', 'completed'),
(3, 'received', 500.00, 'Rahul Sharma', 'Food', 'completed'),
(2, 'sent', 2000.00, 'Rahul Sharma', 'Utilities', 'pending');

-- Insert sample scammer reports
INSERT INTO scammer_reports (reporter_user_id, scammer_upi_id, scammer_phone, report_category, confidence_score, status) VALUES
(1, 'scammer@paytm', '+919876543210', 'fake_payment', 0.85, 'confirmed'),
(2, 'fake@upi', '+919876543211', 'phishing', 0.75, 'under_review');