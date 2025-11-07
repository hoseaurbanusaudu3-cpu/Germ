const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const classController = require('../controllers/classController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const validate = require('../middleware/validate');

const classValidation = [
  body('name').notEmpty().withMessage('Class name is required'),
  body('level').notEmpty().withMessage('Level is required')
];

router.get('/', authenticate, classController.getClasses);
router.get('/:id', authenticate, classController.getClassById);
router.post('/', authenticate, authorize('admin'), classValidation, validate, classController.createClass);
router.put('/:id', authenticate, authorize('admin'), classController.updateClass);
router.delete('/:id', authenticate, authorize('admin'), classController.deleteClass);

module.exports = router;
