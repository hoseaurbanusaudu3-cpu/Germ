const express = require('express');
const router = express.Router();
const activityLogController = require('../controllers/activityLogController');
const { authenticate } = require('../middleware/auth');
const { isAdmin } = require('../middleware/authorize');

router.get('/', authenticate, isAdmin, activityLogController.getActivityLogs);

module.exports = router;
