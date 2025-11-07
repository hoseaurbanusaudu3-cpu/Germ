const { Session, Term } = require('../models');
const { successResponse, errorResponse } = require('../utils/responseFormatter');
const { logActivity } = require('../middleware/activityLogger');

const getSessions = async (req, res, next) => {
  try {
    const sessions = await Session.findAll({
      include: [{ model: Term }],
      order: [['created_at', 'DESC']]
    });

    return successResponse(res, 200, 'Sessions retrieved', sessions);
  } catch (error) {
    next(error);
  }
};

const getSessionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const session = await Session.findByPk(id, {
      include: [{ model: Term }]
    });

    if (!session) {
      return errorResponse(res, 404, 'Session not found');
    }

    return successResponse(res, 200, 'Session retrieved', session);
  } catch (error) {
    next(error);
  }
};

const createSession = async (req, res, next) => {
  try {
    const { name, is_active } = req.body;

    // If setting as active, deactivate others
    if (is_active) {
      await Session.update({ is_active: false }, { where: {} });
    }

    const session = await Session.create({ name, is_active });

    await logActivity(req, 'CREATE_SESSION', 'sessions', session.id, { name });

    return successResponse(res, 201, 'Session created successfully', session);
  } catch (error) {
    next(error);
  }
};

const updateSession = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, is_active } = req.body;

    const session = await Session.findByPk(id);

    if (!session) {
      return errorResponse(res, 404, 'Session not found');
    }

    // If setting as active, deactivate others
    if (is_active) {
      await Session.update({ is_active: false }, { where: {} });
    }

    await session.update({ name, is_active });

    await logActivity(req, 'UPDATE_SESSION', 'sessions', session.id);

    return successResponse(res, 200, 'Session updated successfully', session);
  } catch (error) {
    next(error);
  }
};

const activateSession = async (req, res, next) => {
  try {
    const { id } = req.params;

    const session = await Session.findByPk(id);

    if (!session) {
      return errorResponse(res, 404, 'Session not found');
    }

    // Deactivate all sessions
    await Session.update({ is_active: false }, { where: {} });

    // Activate this session
    await session.update({ is_active: true });

    await logActivity(req, 'ACTIVATE_SESSION', 'sessions', session.id);

    return successResponse(res, 200, 'Session activated successfully', session);
  } catch (error) {
    next(error);
  }
};

const deleteSession = async (req, res, next) => {
  try {
    const { id } = req.params;

    const session = await Session.findByPk(id);

    if (!session) {
      return errorResponse(res, 404, 'Session not found');
    }

    if (session.is_active) {
      return errorResponse(res, 400, 'Cannot delete active session');
    }

    await session.destroy();

    await logActivity(req, 'DELETE_SESSION', 'sessions', id);

    return successResponse(res, 200, 'Session deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSessions,
  getSessionById,
  createSession,
  updateSession,
  activateSession,
  deleteSession
};
