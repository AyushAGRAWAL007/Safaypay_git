// controllers/userController.js
const User = require('../models/User');
const Transaction = require('../models/Transaction');

exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        // Get recent transactions
        const recentTransactions = await Transaction.getUserTransactions(req.user.id, 5, 0);

        res.json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    account_number: user.account_number,
                    current_balance: user.current_balance,
                    daily_limit: user.daily_limit,
                    monthly_limit: user.monthly_limit,
                    used_today: user.used_today,
                    used_this_month: user.used_this_month,
                    kyc_status: user.kyc_status
                },
                recentTransactions
            }
        });

    } catch (error) {
        console.error('Get user profile error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error while fetching user profile'
        });
    }
};

exports.searchUsers = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query || query.length < 2) {
            return res.status(400).json({
                success: false,
                error: 'Search query must be at least 2 characters long'
            });
        }

        const users = await User.search(query);

        res.json({
            success: true,
            data: {
                users,
                total: users.length
            }
        });

    } catch (error) {
        console.error('Search users error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error while searching users'
        });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { name, phone } = req.body;
        const userId = req.user.id;

        // Build update query dynamically
        const updates = [];
        const params = [];

        if (name) {
            updates.push('name = ?');
            params.push(name);
        }

        if (phone) {
            updates.push('phone = ?');
            params.push(phone);
        }

        if (updates.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'No fields to update'
            });
        }

        params.push(userId);

        const query = `UPDATE users SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
        const [result] = await pool.execute(query, params);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        // Get updated user
        const updatedUser = await User.findById(userId);

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                user: updatedUser
            }
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error while updating profile'
        });
    }
};