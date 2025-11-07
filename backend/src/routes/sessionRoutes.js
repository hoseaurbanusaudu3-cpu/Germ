const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const sessionController = require('../controllers/sessionController');
const { authenticate } = require('../middleware/auth');
const { isAdmin } = require('../middleware/authorize');
const validate = require('../middleware/validate');

const sessionValidation = [
  body('name').notEmpty().withMessage('Session name is required')
];

router.get('/', authenticate, sessionController.getSessions);
router.get('/:id', authenticate, sessionController.getSessionById);
router.post('/', authenticate, isAdmin, sessionValidation, validate, sessionController.createSession);
router.put('/:id', authenticate, isAdmin, sessionController.updateSession);
router.put('/:id/activate', authenticate, isAdmin, sessionController.activateSession);
router.delete('/:id', authenticate, isAdmin, sessionController.deleteSession);

module.exports = router;
