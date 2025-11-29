// controllers/scammerController.js
const ScammerReport = require('../models/ScammerReport');

exports.reportScammer = async (req, res) => {
    const connection = await pool.getConnection();
    
    try {
        await connection.beginTransaction();

        const {
            scammer_photo_data,
            scammer_location,
            scammer_upi_id,
            scammer_phone,
            transaction_amount,
            report_description,
            report_category,
            device_info
        } = req.body;

        const reporter_user_id = req.user.id;

        // Validate required fields
        if (!scammer_upi_id && !scammer_phone) {
            await connection.rollback();
            return res.status(400).json({
                success: false,
                error: 'Either scammer UPI ID or phone number is required'
            });
        }

        // Check if scammer already exists
        const existingScammer = await ScammerReport.findExistingScammer(scammer_upi_id, scammer_phone);
        
        let result;
        if (existingScammer) {
            // Update existing report
            const newConfidenceScore = ScammerReport.calculateConfidenceScore(req.body);
            await ScammerReport.updateReportCount(existingScammer.id, newConfidenceScore);
            
            result = {
                isNewReport: false,
                reportId: existingScammer.id,
                confidenceScore: Math.max(existingScammer.confidence_score, newConfidenceScore),
                totalReports: existingScammer.verified_reports + 1
            };
        } else {
            // Create new report
            const reportId = await ScammerReport.create({
                reporter_user_id,
                scammer_photo_data,
                scammer_location,
                scammer_upi_id,
                scammer_phone,
                transaction_amount,
                report_description,
                report_category,
                device_info
            });

            result = {
                isNewReport: true,
                reportId,
                confidenceScore: ScammerReport.calculateConfidenceScore(req.body),
                totalReports: 1
            };
        }

        await connection.commit();

        res.status(201).json({
            success: true,
            message: result.isNewReport ? 
                'Scammer report submitted successfully' : 
                'Scammer report updated (multiple reports)',
            data: result
        });

    } catch (error) {
        await connection.rollback();
        console.error('Scammer report error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error while reporting scammer'
        });
    } finally {
        connection.release();
    }
};

exports.checkScammer = async (req, res) => {
    try {
        const { upi_id, phone } = req.body;

        if (!upi_id && !phone) {
            return res.status(400).json({
                success: false,
                error: 'Either UPI ID or phone number is required'
            });
        }

        const result = await ScammerReport.checkPotentialScammer(upi_id, phone);

        res.json({
            success: true,
            data: result
        });

    } catch (error) {
        console.error('Scammer check error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error while checking scammer'
        });
    }
};

exports.getScammerReports = async (req, res) => {
    try {
        const { status, limit = 50, offset = 0 } = req.query;
        
        const reports = await ScammerReport.getReports(status, parseInt(limit), parseInt(offset));

        res.json({
            success: true,
            data: {
                reports,
                pagination: {
                    limit: parseInt(limit),
                    offset: parseInt(offset),
                    total: reports.length
                }
            }
        });

    } catch (error) {
        console.error('Get scammer reports error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error while fetching scammer reports'
        });
    }
};

exports.updateReportStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['pending', 'under_review', 'confirmed', 'rejected'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid status'
            });
        }

        const report = await ScammerReport.findById(id);
        if (!report) {
            return res.status(404).json({
                success: false,
                error: 'Scammer report not found'
            });
        }

        await ScammerReport.updateStatus(id, status);

        res.json({
            success: true,
            message: `Scammer report status updated to ${status}`
        });

    } catch (error) {
        console.error('Update scammer status error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error while updating scammer report status'
        });
    }
};