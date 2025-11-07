const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const paymentController = require('../controllers/paymentController');
const { authenticate } = require('../middleware/auth');
const { authorize, isAccountant } = require('../middleware/authorize');
const validate = require('../middleware/validate');
const upload = require('../middleware/upload');

const paymentValidation = [
  body('student_id').isInt().withMessage('Valid student ID is required'),
  body('class_id').isInt().withMessage('Valid class ID is required'),
  body('amount').isFloat({ min: 0 }).withMessage('Valid amount is required'),
  body('method').isIn(['cash', 'bank_transfer', 'online', 'cheque']).withMessage('Invalid payment method')
];

const rejectValidation = [
  body('reason').notEmpty().withMessage('Rejection reason is required')
];

router.get('/', authenticate, paymentController.getPayments);
router.get('/:id', authenticate, paymentController.getPaymentById);
router.post('/', authenticate, authorize('admin', 'accountant', 'parent'), paymentValidation, validate, paymentController.recordPayment);
router.put('/:id', authenticate, authorize('admin', 'accountant'), paymentController.updatePayment);
router.post('/:id/verify', authenticate, isAccountant, paymentController.verifyPayment);
router.post('/:id/reject', authenticate, isAccountant, rejectValidation, validate, paymentController.rejectPayment);
router.get('/student/:studentId', authenticate, paymentController.getStudentPayments);
router.post('/:id/proof', authenticate, upload.single('proof'), paymentController.uploadProof);

module.exports = router;
