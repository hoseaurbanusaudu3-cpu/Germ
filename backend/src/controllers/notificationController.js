const { Notification, User } = require('../models');
const { successResponse, errorResponse } = require('../utils/responseFormatter');
const { logActivity } = require('../middleware/activityLogger');
const notificationService = require('../services/notificationService');

const getNotifications = async (req, res, next) => {
  try {
    const { unreadOnly } = req.query;

    const where = {
      [require('sequelize').Op.or]: [
        { receiver_id: req.user.id },
        { receiver_role: req.user.role },
        { receiver_role: 'all' }
      ]
    };

    if (unreadOnly === 'true') {
      where.is_read = false;
    }

    const notifications = await Notification.findAll({
      where,
      include: [{ model: User, as: 'sender', attributes: ['id', 'name'] }],
      order: [['created_at', 'DESC']],
      limit: 50
    });

    return successResponse(res, 200, 'Notifications retrieved', notifications);
  } catch (error) {
    next(error);
  }
};

const sendNotification = async (req, res, next) => {
  try {
    const { receiver_role, receiver_id, title, message, type, link } = req.body;
    const io = req.app.get('io');

    const notification = await notificationService.sendNotification(io, {
      sender_id: req.user.id,
      receiver_role: receiver_role || 'all',
      receiver_id,
      title,
      message,
      type: type || 'info',
      link
    });

    await logActivity(req, 'SEND_NOTIFICATION', 'notifications', notification.id);

    return successResponse(res, 201, 'Notification sent successfully', notification);
  } catch (error) {
    next(error);
  }
};

const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByPk(id);

    if (!notification) {
      return errorResponse(res, 404, 'Notification not found');
    }

    await notification.update({ is_read: true, read_at: new Date() });
    return successResponse(res, 200, 'Notification marked as read');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotifications,
  sendNotification,
  markAsRead
};
