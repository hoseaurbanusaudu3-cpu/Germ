const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');

router.get('/payments', authenticate, authorize('admin', 'accountant'), reportController.getPaymentReport);
router.get('/class-performance', authenticate, authorize('admin', 'teacher', 'class_teacher'), reportController.getClassPerformance);

module.exports = router;
