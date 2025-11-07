const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const notificationController = require('../controllers/notificationController');
const { authenticate } = require('../middleware/auth');
const { isAdmin } = require('../middleware/authorize');
const validate = require('../middleware/validate');

const notificationValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('message').notEmpty().withMessage('Message is required')
];

router.get('/', authenticate, notificationController.getNotifications);
router.post('/send', authenticate, isAdmin, notificationValidation, validate, notificationController.sendNotification);
router.put('/:id/read', authenticate, notificationController.markAsRead);

module.exports = router;
