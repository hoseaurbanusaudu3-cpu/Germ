const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const termController = require('../controllers/termController');
const { authenticate } = require('../middleware/auth');
const { isAdmin } = require('../middleware/authorize');
const validate = require('../middleware/validate');

const termValidation = [
  body('name').notEmpty().withMessage('Term name is required'),
  body('session_id').isInt().withMessage('Valid session ID is required')
];

router.get('/', authenticate, termController.getTerms);
router.get('/:id', authenticate, termController.getTermById);
router.post('/', authenticate, isAdmin, termValidation, validate, termController.createTerm);
router.put('/:id', authenticate, isAdmin, termController.updateTerm);
router.put('/:id/activate', authenticate, isAdmin, termController.activateTerm);
router.delete('/:id', authenticate, isAdmin, termController.deleteTerm);

module.exports = router;
