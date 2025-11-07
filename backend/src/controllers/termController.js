const { Term, Session } = require('../models');
const { successResponse, errorResponse } = require('../utils/responseFormatter');
const { logActivity } = require('../middleware/activityLogger');

const getTerms = async (req, res, next) => {
  try {
    const { sessionId } = req.query;
    const where = {};
    if (sessionId) where.session_id = sessionId;

    const terms = await Term.findAll({
      where,
      include: [{ model: Session }],
      order: [['created_at', 'ASC']]
    });

    return successResponse(res, 200, 'Terms retrieved', terms);
  } catch (error) {
    next(error);
  }
};

const getTermById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const term = await Term.findByPk(id, {
      include: [{ model: Session }]
    });

    if (!term) {
      return errorResponse(res, 404, 'Term not found');
    }

    return successResponse(res, 200, 'Term retrieved', term);
  } catch (error) {
    next(error);
  }
};

const createTerm = async (req, res, next) => {
  try {
    const { name, session_id, is_active, start_date, end_date, next_term_begins } = req.body;

    // If setting as active, deactivate others in same session
    if (is_active) {
      await Term.update({ is_active: false }, { where: { session_id } });
    }

    const term = await Term.create({
      name,
      session_id,
      is_active,
      start_date,
      end_date,
      next_term_begins
    });

    await logActivity(req, 'CREATE_TERM', 'terms', term.id, { name, session_id });

    return successResponse(res, 201, 'Term created successfully', term);
  } catch (error) {
    next(error);
  }
};

const updateTerm = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, is_active, start_date, end_date, next_term_begins } = req.body;

    const term = await Term.findByPk(id);

    if (!term) {
      return errorResponse(res, 404, 'Term not found');
    }

    // If setting as active, deactivate others in same session
    if (is_active) {
      await Term.update({ is_active: false }, { where: { session_id: term.session_id } });
    }

    await term.update({ name, is_active, start_date, end_date, next_term_begins });

    await logActivity(req, 'UPDATE_TERM', 'terms', term.id);

    return successResponse(res, 200, 'Term updated successfully', term);
  } catch (error) {
    next(error);
  }
};

const activateTerm = async (req, res, next) => {
  try {
    const { id } = req.params;

    const term = await Term.findByPk(id);

    if (!term) {
      return errorResponse(res, 404, 'Term not found');
    }

    // Deactivate all terms in same session
    await Term.update({ is_active: false }, { where: { session_id: term.session_id } });

    // Activate this term
    await term.update({ is_active: true });

    await logActivity(req, 'ACTIVATE_TERM', 'terms', term.id);

    return successResponse(res, 200, 'Term activated successfully', term);
  } catch (error) {
    next(error);
  }
};

const deleteTerm = async (req, res, next) => {
  try {
    const { id } = req.params;

    const term = await Term.findByPk(id);

    if (!term) {
      return errorResponse(res, 404, 'Term not found');
    }

    if (term.is_active) {
      return errorResponse(res, 400, 'Cannot delete active term');
    }

    await term.destroy();

    await logActivity(req, 'DELETE_TERM', 'terms', id);

    return successResponse(res, 200, 'Term deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTerms,
  getTermById,
  createTerm,
  updateTerm,
  activateTerm,
  deleteTerm
};
