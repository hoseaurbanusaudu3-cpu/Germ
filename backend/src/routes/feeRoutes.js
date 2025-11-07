const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const feeController = require('../controllers/feeController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const validate = require('../middleware/validate');

const feeValidation = [
  body('class_id').isInt().withMessage('Valid class ID is required'),
  body('session_id').isInt().withMessage('Valid session ID is required'),
  body('term_id').isInt().withMessage('Valid term ID is required'),
  body('breakdown_json').isObject().withMessage('Fee breakdown is required')
];

router.get('/', authenticate, feeController.getFeeStructures);
router.get('/:id', authenticate, feeController.getFeeById);
router.post('/', authenticate, authorize('admin', 'accountant'), feeValidation, validate, feeController.createFeeStructure);
router.put('/:id', authenticate, authorize('admin', 'accountant'), feeController.updateFeeStructure);
router.delete('/:id', authenticate, authorize('admin'), feeController.deleteFeeStructure);

module.exports = router;
