// routes/users.js
const express = require('express');
const { authenticate } = require('../middleware/auth');
const { getUserProfile, searchUsers, updateProfile } = require('../controllers/userController');

const router = express.Router();

router.use(authenticate);

router.get('/profile', getUserProfile);
router.get('/search', searchUsers);
router.put('/profile', updateProfile);

module.exports = router;
