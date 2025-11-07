const { Payment, Student, Class, CompiledResult, Score } = require('../models');
const { successResponse, errorResponse } = require('../utils/responseFormatter');
const { Op } = require('sequelize');

const getPaymentReport = async (req, res, next) => {
  try {
    const { sessionId, termId, classId, startDate, endDate } = req.query;

    const where = {};
    if (sessionId) where.session_id = sessionId;
    if (termId) where.term_id = termId;
    if (classId) where.class_id = classId;
    if (startDate && endDate) {
      where.created_at = { [Op.between]: [startDate, endDate] };
    }

    const payments = await Payment.findAll({
      where,
      include: [
        { model: Student, attributes: ['id', 'reg_no', 'full_name'] },
        { model: Class, attributes: ['id', 'name'] }
      ]
    });

    const summary = {
      totalAmount: payments.reduce((sum, p) => sum + parseFloat(p.amount), 0),
      verifiedAmount: payments.filter(p => p.status === 'verified').reduce((sum, p) => sum + parseFloat(p.amount), 0),
      pendingAmount: payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + parseFloat(p.amount), 0),
      totalPayments: payments.length,
      verified: payments.filter(p => p.status === 'verified').length,
      pending: payments.filter(p => p.status === 'pending').length,
      rejected: payments.filter(p => p.status === 'rejected').length
    };

    return successResponse(res, 200, 'Payment report generated', { payments, summary });
  } catch (error) {
    next(error);
  }
};

const getClassPerformance = async (req, res, next) => {
  try {
    const { classId, termId, sessionId } = req.query;

    const results = await CompiledResult.findAll({
      where: { class_id: classId, term_id: termId, session_id: sessionId, status: 'approved' },
      include: [{ model: Student, attributes: ['id', 'reg_no', 'full_name'] }]
    });

    const summary = {
      totalStudents: results.length,
      averageScore: results.reduce((sum, r) => sum + parseFloat(r.average), 0) / results.length || 0,
      highestScore: Math.max(...results.map(r => parseFloat(r.average))),
      lowestScore: Math.min(...results.map(r => parseFloat(r.average)))
    };

    return successResponse(res, 200, 'Class performance report generated', { results, summary });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPaymentReport,
  getClassPerformance
};
