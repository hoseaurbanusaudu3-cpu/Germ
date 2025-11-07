const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const scoreController = require('../controllers/scoreController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const validate = require('../middleware/validate');
const upload = require('../middleware/upload');

// Validation rules
const bulkScoresValidation = [
  body('scores').isArray({ min: 1 }).withMessage('Scores array is required'),
  body('scores.*.student_id').isInt().withMessage('Valid student ID is required'),
  body('scores.*.class_id').isInt().withMessage('Valid class ID is required'),
  body('scores.*.subject_id').isInt().withMessage('Valid subject ID is required'),
  body('scores.*.term_id').isInt().withMessage('Valid term ID is required'),
  body('scores.*.session_id').isInt().withMessage('Valid session ID is required'),
  body('scores.*.ca1').isFloat({ min: 0, max: 20 }).withMessage('CA1 must be between 0 and 20'),
  body('scores.*.ca2').isFloat({ min: 0, max: 20 }).withMessage('CA2 must be between 0 and 20'),
  body('scores.*.exam').isFloat({ min: 0, max: 60 }).withMessage('Exam must be between 0 and 60')
];

const submitScoresValidation = [
  body('scoreIds').isArray({ min: 1 }).withMessage('Score IDs array is required')
];

// Routes
router.get('/', authenticate, scoreController.getScores);
router.get('/class/:classId/students', authenticate, scoreController.getClassStudents);
router.post('/bulk', authenticate, authorize('admin', 'teacher', 'class_teacher'), bulkScoresValidation, validate, scoreController.bulkSaveScores);
router.post('/submit', authenticate, authorize('admin', 'teacher', 'class_teacher'), submitScoresValidation, validate, scoreController.submitScores);
router.get('/export', authenticate, scoreController.exportScores);
router.post('/import', authenticate, authorize('admin', 'teacher', 'class_teacher'), upload.single('file'), scoreController.importScores);

module.exports = router;
