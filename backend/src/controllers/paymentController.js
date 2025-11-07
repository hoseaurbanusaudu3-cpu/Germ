const { Payment, Student, Class, Session, Term, User } = require('../models');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/responseFormatter');
const { logActivity } = require('../middleware/activityLogger');

const getPayments = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, studentId, status, classId } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (studentId) where.student_id = studentId;
    if (status) where.status = status;
    if (classId) where.class_id = classId;

    const { count, rows } = await Payment.findAndCountAll({
      where,
      include: [
        { model: Student, attributes: ['id', 'reg_no', 'full_name'] },
        { model: Class, attributes: ['id', 'name'] },
        { model: Session, attributes: ['id', 'name'] },
        { model: Term, attributes: ['id', 'name'] }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    return paginatedResponse(res, rows, page, limit, count);
  } catch (error) {
    next(error);
  }
};

const getPaymentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const payment = await Payment.findByPk(id, {
      include: [
        { model: Student, attributes: ['id', 'reg_no', 'full_name'] },
        { model: Class, attributes: ['id', 'name'] },
        { model: User, as: 'processor', attributes: ['id', 'name'] }
      ]
    });

    if (!payment) {
      return errorResponse(res, 404, 'Payment not found');
    }

    return successResponse(res, 200, 'Payment retrieved', payment);
  } catch (error) {
    next(error);
  }
};

const recordPayment = async (req, res, next) => {
  try {
    const { student_id, class_id, session_id, term_id, amount, method, reference, description } = req.body;

    const payment = await Payment.create({
      student_id,
      class_id,
      session_id,
      term_id,
      amount,
      method,
      reference,
      description,
      status: 'pending'
    });

    await logActivity(req, 'RECORD_PAYMENT', 'payments', payment.id, { student_id, amount });

    return successResponse(res, 201, 'Payment recorded successfully', payment);
  } catch (error) {
    next(error);
  }
};

const updatePayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { amount, method, reference, description } = req.body;

    const payment = await Payment.findByPk(id);

    if (!payment) {
      return errorResponse(res, 404, 'Payment not found');
    }

    if (payment.status !== 'pending') {
      return errorResponse(res, 400, 'Cannot update processed payment');
    }

    await payment.update({ amount, method, reference, description });

    await logActivity(req, 'UPDATE_PAYMENT', 'payments', payment.id);

    return successResponse(res, 200, 'Payment updated successfully', payment);
  } catch (error) {
    next(error);
  }
};

const verifyPayment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const payment = await Payment.findByPk(id);

    if (!payment) {
      return errorResponse(res, 404, 'Payment not found');
    }

    if (payment.status !== 'pending') {
      return errorResponse(res, 400, 'Payment already processed');
    }

    await payment.update({
      status: 'verified',
      processed_by: req.user.id,
      processed_at: new Date()
    });

    await logActivity(req, 'VERIFY_PAYMENT', 'payments', payment.id);

    // TODO: Send notification to parent

    return successResponse(res, 200, 'Payment verified successfully', payment);
  } catch (error) {
    next(error);
  }
};

const rejectPayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const payment = await Payment.findByPk(id);

    if (!payment) {
      return errorResponse(res, 404, 'Payment not found');
    }

    if (payment.status !== 'pending') {
      return errorResponse(res, 400, 'Payment already processed');
    }

    await payment.update({
      status: 'rejected',
      processed_by: req.user.id,
      processed_at: new Date(),
      rejection_reason: reason
    });

    await logActivity(req, 'REJECT_PAYMENT', 'payments', payment.id, { reason });

    // TODO: Send notification to parent

    return successResponse(res, 200, 'Payment rejected', payment);
  } catch (error) {
    next(error);
  }
};

const getStudentPayments = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    const payments = await Payment.findAll({
      where: { student_id: studentId },
      include: [
        { model: Session, attributes: ['id', 'name'] },
        { model: Term, attributes: ['id', 'name'] }
      ],
      order: [['created_at', 'DESC']]
    });

    // Calculate totals
    const totalPaid = payments
      .filter(p => p.status === 'verified')
      .reduce((sum, p) => sum + parseFloat(p.amount), 0);

    return successResponse(res, 200, 'Student payments retrieved', {
      payments,
      summary: {
        totalPaid,
        totalPayments: payments.length,
        verified: payments.filter(p => p.status === 'verified').length,
        pending: payments.filter(p => p.status === 'pending').length
      }
    });
  } catch (error) {
    next(error);
  }
};

const uploadProof = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return errorResponse(res, 400, 'No file uploaded');
    }

    const payment = await Payment.findByPk(id);

    if (!payment) {
      return errorResponse(res, 404, 'Payment not found');
    }

    const proofPath = `/uploads/proofs/${req.file.filename}`;
    await payment.update({ proof_path: proofPath });

    await logActivity(req, 'UPLOAD_PAYMENT_PROOF', 'payments', id);

    return successResponse(res, 200, 'Payment proof uploaded successfully', { proof_path: proofPath });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPayments,
  getPaymentById,
  recordPayment,
  updatePayment,
  verifyPayment,
  rejectPayment,
  getStudentPayments,
  uploadProof
};
