const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

// GET /api/analytics - Get all analytics data
router.get('/', analyticsController.getAnalytics);

module.exports = router;
