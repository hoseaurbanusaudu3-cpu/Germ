const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const subjectController = require('../controllers/subjectController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const validate = require('../middleware/validate');

const subjectValidation = [
  body('name').notEmpty().withMessage('Subject name is required')
];

const assignmentValidation = [
  body('class_id').isInt().withMessage('Valid class ID is required'),
  body('subject_id').isInt().withMessage('Valid subject ID is required'),
  body('teacher_id').isInt().withMessage('Valid teacher ID is required'),
  body('session_id').isInt().withMessage('Valid session ID is required')
];

router.get('/', authenticate, subjectController.getSubjects);
router.get('/:id', authenticate, subjectController.getSubjectById);
router.post('/', authenticate, authorize('admin'), subjectValidation, validate, subjectController.createSubject);
router.put('/:id', authenticate, authorize('admin'), subjectController.updateSubject);
router.delete('/:id', authenticate, authorize('admin'), subjectController.deleteSubject);

// Class subject assignments
router.get('/class-subjects', authenticate, subjectController.getClassSubjects);
router.post('/class-subjects', authenticate, authorize('admin'), assignmentValidation, validate, subjectController.assignTeacher);

module.exports = router;
