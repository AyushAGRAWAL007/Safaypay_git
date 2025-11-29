// controllers/verificationController.js
const Verification = require('../models/Verification');

exports.getVerificationStatus = async (req, res) => {
    try {
        const verification = await Verification.findByUserId(req.user.id);

        res.json({
            success: true,
            data: {
                verification: verification || {
                    kyc_status: 'not_started',
                    verification_level: 'basic'
                }
            }
        });

    } catch (error) {
        console.error('Get verification status error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error while fetching verification status'
        });
    }
};

exports.submitVerification = async (req, res) => {
    try {
        const { document_url, verification_level = 'enhanced' } = req.body;
        const userId = req.user.id;

        if (!document_url) {
            return res.status(400).json({
                success: false,
                error: 'Document URL is required'
            });
        }

        // Check if verification already exists
        const existingVerification = await Verification.findByUserId(userId);

        let result;
        if (existingVerification) {
            // Update existing verification
            result = await Verification.update(userId, {
                document_url,
                verification_level,
                kyc_status: 'pending'
            });
        } else {
            // Create new verification
            result = await Verification.create(userId, {
                document_url,
                verification_level,
                kyc_status: 'pending'
            });
        }

        res.json({
            success: true,
            message: 'Verification submitted successfully',
            data: {
                verification: {
                    kyc_status: 'pending',
                    verification_level,
                    document_url
                }
            }
        });

    } catch (error) {
        console.error('Submit verification error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error while submitting verification'
        });
    }
};