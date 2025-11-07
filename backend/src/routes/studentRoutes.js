const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const studentController = require('../controllers/studentController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const validate = require('../middleware/validate');
const upload = require('../middleware/upload');

// Validation rules
const createStudentValidation = [
  body('reg_no').notEmpty().withMessage('Registration number is required'),
  body('full_name').notEmpty().withMessage('Full name is required'),
  body('dob').isISO8601().withMessage('Valid date of birth is required'),
  body('gender').isIn(['Male', 'Female']).withMessage('Gender must be Male or Female'),
  body('class_id').isInt().withMessage('Valid class ID is required')
];

const updateStudentValidation = [
  body('reg_no').optional().notEmpty().withMessage('Registration number cannot be empty'),
  body('full_name').optional().notEmpty().withMessage('Full name cannot be empty'),
  body('dob').optional().isISO8601().withMessage('Valid date of birth is required'),
  body('gender').optional().isIn(['Male', 'Female']).withMessage('Gender must be Male or Female'),
  body('class_id').optional().isInt().withMessage('Valid class ID is required')
];

const linkParentValidation = [
  body('parentId').isInt().withMessage('Valid parent ID is required')
];

// Routes
router.get('/', authenticate, studentController.getStudents);
router.get('/:id', authenticate, studentController.getStudentById);
router.post('/', authenticate, authorize('admin', 'teacher', 'class_teacher'), createStudentValidation, validate, studentController.createStudent);
router.put('/:id', authenticate, authorize('admin', 'teacher', 'class_teacher'), updateStudentValidation, validate, studentController.updateStudent);
router.delete('/:id', authenticate, authorize('admin'), studentController.deleteStudent);
router.post('/:id/photo', authenticate, authorize('admin', 'teacher', 'class_teacher'), upload.single('photo'), studentController.uploadPhoto);
router.post('/:id/link-parent', authenticate, authorize('admin'), linkParentValidation, validate, studentController.linkParent);

module.exports = router;
