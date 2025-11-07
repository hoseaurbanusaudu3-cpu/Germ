const { Notification, User } = require('../models');

/**
 * Send notification
 */
const sendNotification = async (io, notificationData) => {
  try {
    const notification = await Notification.create(notificationData);

    // Emit via Socket.io
    if (notificationData.receiver_id) {
      // Send to specific user
      io.to(`user_${notificationData.receiver_id}`).emit('notification', notification);
    } else if (notificationData.receiver_role) {
      // Send to all users with specific role
      const users = await User.findAll({
        where: { role: notificationData.receiver_role, status: 'active' },
        attributes: ['id']
      });

      users.forEach(user => {
        io.to(`user_${user.id}`).emit('notification', notification);
      });
    }

    return notification;
  } catch (error) {
    console.error('Notification error:', error);
    throw error;
  }
};

/**
 * Send score submission notification to class teacher
 */
const notifyScoreSubmission = async (io, teacherId, classId, subjectName) => {
  return sendNotification(io, {
    sender_id: teacherId,
    receiver_role: 'class_teacher',
    title: 'Scores Submitted',
    message: `Scores for ${subjectName} have been submitted and are ready for compilation.`,
    type: 'info',
    link: `/compiled/${classId}`
  });
};

/**
 * Send result submission notification to admin
 */
const notifyResultSubmission = async (io, classTeacherId, classId, className) => {
  return sendNotification(io, {
    sender_id: classTeacherId,
    receiver_role: 'admin',
    title: 'Results Submitted for Approval',
    message: `Results for ${className} have been submitted and are pending approval.`,
    type: 'info',
    link: `/results/pending`
  });
};

/**
 * Send result approval notification to parent
 */
const notifyResultApproval = async (io, adminId, parentId, studentName) => {
  return sendNotification(io, {
    sender_id: adminId,
    receiver_id: parentId,
    title: 'Result Approved',
    message: `The result for ${studentName} has been approved and is now available.`,
    type: 'success',
    link: `/results/student`
  });
};

/**
 * Send payment verification notification
 */
const notifyPaymentVerification = async (io, accountantId, parentId, amount, status) => {
  const message = status === 'verified' 
    ? `Your payment of ₦${amount} has been verified.`
    : `Your payment of ₦${amount} was rejected. Please contact the accounts office.`;

  return sendNotification(io, {
    sender_id: accountantId,
    receiver_id: parentId,
    title: status === 'verified' ? 'Payment Verified' : 'Payment Rejected',
    message,
    type: status === 'verified' ? 'success' : 'error',
    link: `/payments`
  });
};

/**
 * Broadcast announcement to all users or specific role
 */
const broadcastAnnouncement = async (io, senderId, targetRole, title, message) => {
  return sendNotification(io, {
    sender_id: senderId,
    receiver_role: targetRole || 'all',
    title,
    message,
    type: 'info'
  });
};

module.exports = {
  sendNotification,
  notifyScoreSubmission,
  notifyResultSubmission,
  notifyResultApproval,
  notifyPaymentVerification,
  broadcastAnnouncement
};
