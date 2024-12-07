const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');

// GET /api/settings
router.get('/', settingsController.getSettings);

// PUT /api/settings
router.put('/', settingsController.updateSettings);

module.exports = router;
