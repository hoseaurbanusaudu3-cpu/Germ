const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');
const { isAdmin } = require('../middleware/authorize');
const validate = require('../middleware/validate');

const createUserValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('role').isIn(['admin', 'teacher', 'class_teacher', 'accountant', 'parent']).withMessage('Invalid role'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const updateUserValidation = [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('role').optional().isIn(['admin', 'teacher', 'class_teacher', 'accountant', 'parent']).withMessage('Invalid role'),
  body('status').optional().isIn(['active', 'inactive']).withMessage('Invalid status')
];

router.get('/', authenticate, isAdmin, userController.getUsers);
router.get('/:id', authenticate, isAdmin, userController.getUserById);
router.post('/', authenticate, isAdmin, createUserValidation, validate, userController.createUser);
router.put('/:id', authenticate, isAdmin, updateUserValidation, validate, userController.updateUser);
router.delete('/:id', authenticate, isAdmin, userController.deleteUser);

module.exports = router;
