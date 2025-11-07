const { Fee, Class, Session, Term } = require('../models');
const { successResponse, errorResponse } = require('../utils/responseFormatter');
const { logActivity } = require('../middleware/activityLogger');

const getFeeStructures = async (req, res, next) => {
  try {
    const { classId, sessionId, termId } = req.query;
    const where = {};
    if (classId) where.class_id = classId;
    if (sessionId) where.session_id = sessionId;
    if (termId) where.term_id = termId;

    const fees = await Fee.findAll({
      where,
      include: [
        { model: Class, attributes: ['id', 'name', 'level'] },
        { model: Session, attributes: ['id', 'name'] },
        { model: Term, attributes: ['id', 'name'] }
      ],
      order: [['created_at', 'DESC']]
    });

    return successResponse(res, 200, 'Fee structures retrieved', fees);
  } catch (error) {
    next(error);
  }
};

const getFeeById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const fee = await Fee.findByPk(id, {
      include: [
        { model: Class, attributes: ['id', 'name', 'level'] },
        { model: Session, attributes: ['id', 'name'] },
        { model: Term, attributes: ['id', 'name'] }
      ]
    });

    if (!fee) {
      return errorResponse(res, 404, 'Fee structure not found');
    }

    return successResponse(res, 200, 'Fee structure retrieved', fee);
  } catch (error) {
    next(error);
  }
};

const createFeeStructure = async (req, res, next) => {
  try {
    const { class_id, session_id, term_id, breakdown_json } = req.body;

    // Calculate total
    const total_amount = Object.values(breakdown_json).reduce((sum, val) => sum + parseFloat(val || 0), 0);

    const fee = await Fee.create({
      class_id,
      session_id,
      term_id,
      breakdown_json,
      total_amount
    });

    await logActivity(req, 'CREATE_FEE_STRUCTURE', 'fees', fee.id, { class_id, total_amount });

    return successResponse(res, 201, 'Fee structure created successfully', fee);
  } catch (error) {
    next(error);
  }
};

const updateFeeStructure = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { breakdown_json } = req.body;

    const fee = await Fee.findByPk(id);

    if (!fee) {
      return errorResponse(res, 404, 'Fee structure not found');
    }

    // Calculate new total
    const total_amount = Object.values(breakdown_json).reduce((sum, val) => sum + parseFloat(val || 0), 0);

    await fee.update({ breakdown_json, total_amount });

    await logActivity(req, 'UPDATE_FEE_STRUCTURE', 'fees', fee.id);

    return successResponse(res, 200, 'Fee structure updated successfully', fee);
  } catch (error) {
    next(error);
  }
};

const deleteFeeStructure = async (req, res, next) => {
  try {
    const { id } = req.params;

    const fee = await Fee.findByPk(id);

    if (!fee) {
      return errorResponse(res, 404, 'Fee structure not found');
    }

    await fee.destroy();

    await logActivity(req, 'DELETE_FEE_STRUCTURE', 'fees', id);

    return successResponse(res, 200, 'Fee structure deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFeeStructures,
  getFeeById,
  createFeeStructure,
  updateFeeStructure,
  deleteFeeStructure
};
