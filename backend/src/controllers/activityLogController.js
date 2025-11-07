const { ActivityLog, User } = require('../models');
const { successResponse, paginatedResponse } = require('../utils/responseFormatter');

const getActivityLogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, action, userId, startDate, endDate } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (action) where.action = action;
    if (userId) where.user_id = userId;
    if (startDate && endDate) {
      where.created_at = { [require('sequelize').Op.between]: [startDate, endDate] };
    }

    const { count, rows } = await ActivityLog.findAndCountAll({
      where,
      include: [{ model: User, attributes: ['id', 'name', 'email', 'role'] }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    return paginatedResponse(res, rows, page, limit, count);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getActivityLogs
};
