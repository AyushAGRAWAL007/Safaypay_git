// models/ScammerReport.js
const { pool } = require('../config/database');

class ScammerReport {
    // Create new scammer report
    static async create(reportData) {
        const {
            reporter_user_id,
            scammer_photo_data,
            scammer_location,
            scammer_upi_id,
            scammer_phone,
            transaction_amount,
            report_description,
            report_category,
            device_info
        } = reportData;

        // Calculate confidence score
        const confidence_score = this.calculateConfidenceScore(reportData);

        const query = `
            INSERT INTO scammer_reports 
            (reporter_user_id, scammer_photo_data, scammer_location, scammer_upi_id, 
             scammer_phone, transaction_amount, report_description, report_category, 
             confidence_score, device_info) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        const [result] = await pool.execute(query, [
            reporter_user_id,
            scammer_photo_data,
            scammer_location,
            scammer_upi_id,
            scammer_phone,
            transaction_amount,
            report_description,
            report_category,
            confidence_score,
            device_info
        ]);

        return result.insertId;
    }

    // Calculate confidence score
    static calculateConfidenceScore(reportData) {
        let score = 0;

        if (reportData.scammer_photo_data) score += 30;
        if (reportData.scammer_location) score += 25;
        if (reportData.scammer_upi_id) score += 20;
        if (reportData.scammer_phone) score += 15;
        if (reportData.report_description && reportData.report_description.length > 50) score += 10;

        return Math.min(score, 100);
    }

    // Find existing scammer reports
    static async findExistingScammer(scammerUpiId, scammerPhone) {
        const conditions = [];
        const params = [];

        if (scammerUpiId) {
            conditions.push('scammer_upi_id = ?');
            params.push(scammerUpiId);
        }

        if (scammerPhone) {
            conditions.push('scammer_phone = ?');
            params.push(scammerPhone);
        }

        if (conditions.length === 0) return null;

        const query = `
            SELECT * FROM scammer_reports 
            WHERE (${conditions.join(' OR ')})
            AND status IN ('pending', 'under_review', 'confirmed')
            ORDER BY verified_reports DESC, confidence_score DESC
            LIMIT 1
        `;

        const [scammers] = await pool.execute(query, params);
        return scammers[0] || null;
    }

    // Update existing scammer report (multiple reports)
    static async updateReportCount(scammerId, newConfidenceScore) {
        const query = `
            UPDATE scammer_reports 
            SET verified_reports = verified_reports + 1,
                confidence_score = GREATEST(confidence_score, ?),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `;
        const [result] = await pool.execute(query, [newConfidenceScore, scammerId]);
        return result.affectedRows > 0;
    }

    // Check if recipient is potential scammer
    static async checkPotentialScammer(upiId, phone) {
        const conditions = [];
        const params = [];

        if (upiId) {
            conditions.push('scammer_upi_id = ?');
            params.push(upiId);
        }

        if (phone) {
            conditions.push('scammer_phone = ?');
            params.push(phone);
        }

        if (conditions.length === 0) return null;

        const query = `
            SELECT *, 
                   (confidence_score + (verified_reports * 5)) as threat_score
            FROM scammer_reports 
            WHERE (${conditions.join(' OR ')})
            AND status IN ('under_review', 'confirmed')
            AND confidence_score >= 50
            ORDER BY threat_score DESC 
            LIMIT 1
        `;

        const [scammers] = await pool.execute(query, params);
        
        if (scammers.length > 0) {
            const scammer = scammers[0];
            return {
                isPotentialScammer: true,
                threatLevel: this.getThreatLevel(scammer.threat_score),
                confidence: scammer.confidence_score,
                totalReports: scammer.verified_reports,
                reason: `Reported by ${scammer.verified_reports} user(s)`,
                scammerData: scammer
            };
        }

        return { isPotentialScammer: false };
    }

    // Get threat level
    static getThreatLevel(score) {
        if (score >= 80) return 'HIGH';
        if (score >= 60) return 'MEDIUM';
        return 'LOW';
    }

    // Get scammer reports for admin
    static async getReports(status = null, limit = 50, offset = 0) {
        let query = `
            SELECT sr.*, u.name as reporter_name, u.email as reporter_email
            FROM scammer_reports sr
            LEFT JOIN users u ON sr.reporter_user_id = u.id
        `;
        const params = [];

        if (status) {
            query += ' WHERE sr.status = ?';
            params.push(status);
        }

        query += ' ORDER BY sr.verified_reports DESC, sr.confidence_score DESC LIMIT ? OFFSET ?';
        params.push(limit, offset);

        const [reports] = await pool.execute(query, params);
        return reports;
    }

    // Update report status
    static async updateStatus(reportId, status) {
        const query = 'UPDATE scammer_reports SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
        const [result] = await pool.execute(query, [status, reportId]);
        return result.affectedRows > 0;
    }

    // Get report by ID
    static async findById(id) {
        const query = `
            SELECT sr.*, u.name as reporter_name, u.email as reporter_email
            FROM scammer_reports sr
            LEFT JOIN users u ON sr.reporter_user_id = u.id
            WHERE sr.id = ?
        `;
        const [reports] = await pool.execute(query, [id]);
        return reports[0] || null;
    }
}

module.exports = ScammerReport;