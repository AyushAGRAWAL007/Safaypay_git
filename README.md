SafayPay: AI-Powered UPI Fraud Prevention

The Problem We're Solving

Every day, thousands of Indians lose money to UPI scams including fake customer care numbers, QR code frauds, and impersonation attacks. Current security measures are reactive; they kick in after the money is already gone. We asked: What if we could stop scams before the transaction completes?

That's exactly what SafayPay does.

How It Actually Works

For Senders (People Paying Money)
1. Set Your Safety Limit: Choose an amount threshold such as 5,000 rupees. Any transaction above this triggers our security check
2. Initiate Payment: Send money like you normally would via UPI
3. Automatic Protection: If the amount exceeds your limit, we pause the transaction and verify the receiver

For Receivers (People Getting Paid)  
1. Location Check: We automatically capture their current GPS location
2. Live Selfie Required: They need to take a real-time photo with no uploaded images allowed
3. Instant Face Matching: We compare their face against known scammer databases
4. Transaction Decision: 
   - Clean match: Payment goes through immediately  
   - Scammer detected: You get an instant alert with evidence




Our Backend Architecture
backend/
├── config/
│   └── db.js                 # Database connections & setup
│
├── models/                   # Data structure definitions
│   ├── User.js              # User accounts & preferences
│   ├── Transaction.js       # Payment records & status tracking
│   ├── Verification.js      # Security check results & evidence
│   ├── Photo.js             # Image storage & management
│   ├── ScammerReport.js     # Known fraudster database
│   └── index.js             # Model relationships & exports
│
├── controllers/              # Business logic handlers
│   ├── userController.js     # Account operations
│   ├── transactionController.js # Payment processing
│   ├── verificationController.js # Security workflows
│   └── scamController.js     # Fraud detection engine
│
├── routes/                   # API endpoints
│   ├── userRoutes.js         # /api/users/* endpoints
│   ├── transactionRoutes.js  # /api/transactions/* endpoints  
│   ├── verificationRoutes.js # /api/verify/* endpoints
│   └── scammer.js            # /api/scammer/* endpoints
│
├── middleware/               # Security & processing layers
│   ├── authMiddleware.js     # Login verification
│   ├── verifyToken.js        # API security tokens
│   ├── asyncHandler.js       # Error handling wrapper
│   ├── errorHandler.js       # Global error management
│   └── upload.js             # Photo handling & validation
│
├── schema/                   # Database structure
│   └── sample_data.sql       # Test data & initial setup
│
└── server.js                 # Main application entry point



Key Technologies

n8n Workflow Automation
- Parallel execution of location capture, behavioral analysis, and pattern detection
- Robust error handling where failed services don't stop the entire process
- Multi-channel alert system integration
- Webhook-based real-time communication

Agentic AI Decision Engine
- Behavioral pattern analysis and anomaly detection
- Real-time risk assessment without requiring scammer databases
- Continuous learning that improves with each transaction
- Risk scoring and confidence-based verification

Security Features
- Encrypted data storage for all sensitive information
- Temporary photo storage with automatic deletion after processing
- No long-term biometric data retention
- Secure API endpoints with proper authentication
- Behavioral analysis instead of facial matching databases
Technology Stack

Backend: Node.js with Express.js framework and MySQL database
Automation: n8n workflow orchestration platform
AI/ML: Behavioral pattern recognition and anomaly detection
Notifications: Twilio for SMS, along with email and push notifications
Frontend: React.js with mobile-responsive user interface
Security: JWT tokens, encryption protocols, and secure API practices