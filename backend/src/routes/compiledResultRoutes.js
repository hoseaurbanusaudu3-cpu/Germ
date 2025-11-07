const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const compiledResultController = require('../controllers/compiledResultController');
const { authenticate } = require('../middleware/auth');
const { authorize, isAdmin, isClassTeacher } = require('../middleware/authorize');
const validate = require('../middleware/validate');

const compileValidation = [
  body('studentId').isInt().withMessage('Valid student ID is required'),
  body('termId').isInt().withMessage('Valid term ID is required'),
  body('sessionId').isInt().withMessage('Valid session ID is required')
];

const approveValidation = [
  body('principalComment').optional().notEmpty().withMessage('Comment cannot be empty')
];

const rejectValidation = [
  body('reason').notEmpty().withMessage('Rejection reason is required')
];

// Compiled results
router.get('/:classId', authenticate, compiledResultController.getCompiledResults);
router.post('/:classId/compile', authenticate, isClassTeacher, compileValidation, validate, compiledResultController.compileResult);
router.post('/:id/submit', authenticate, isClassTeacher, compiledResultController.submitResult);

// Admin approval
router.get('/pending', authenticate, isAdmin, compiledResultController.getPendingApprovals);
router.post('/:id/approve', authenticate, isAdmin, approveValidation, validate, compiledResultController.approveResult);
router.post('/:id/reject', authenticate, isAdmin, rejectValidation, validate, compiledResultController.rejectResult);

// Student result
router.get('/student/:studentId', authenticate, compiledResultController.getStudentResult);
router.get('/student/:studentId/pdf', authenticate, compiledResultController.downloadResultPDF);

module.exports = router;
