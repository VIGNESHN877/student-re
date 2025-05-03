const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminController = require('../controllers/admin');

// Admin dashboard routes
router.get('/dashboard', auth, adminController.getDashboardStats);

module.exports = router;