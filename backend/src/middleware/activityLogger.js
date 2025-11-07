const { ActivityLog } = require('../models');

/**
 * Log user activity
 * @param {string} action - Action performed
 * @param {string} targetTable - Table affected
 * @param {number} targetId - ID of affected record
 * @param {object} details - Additional details
 */
const logActivity = async (req, action, targetTable = null, targetId = null, details = null) => {
  try {
    if (!req.user) return;

    await ActivityLog.create({
      user_id: req.user.id,
      action,
      target_table: targetTable,
      target_id: targetId,
      details_json: details,
      ip_address: req.ip || req.connection.remoteAddress,
      user_agent: req.get('user-agent')
    });
  } catch (error) {
    console.error('Activity logging error:', error);
    // Don't throw - logging failure shouldn't break the request
  }
};

/**
 * Middleware to automatically log certain actions
 */
const autoLog = (action, getTarget = null) => {
  return async (req, res, next) => {
    const originalJson = res.json.bind(res);
    
    res.json = function(data) {
      // Only log successful operations
      if (data.success !== false && req.user) {
        const target = getTarget ? getTarget(req, data) : null;
        
        logActivity(
          req,
          action,
          target?.table,
          target?.id,
          target?.details
        ).catch(err => console.error('Auto-log error:', err));
      }
      
      return originalJson(data);
    };
    
    next();
  };
};

module.exports = {
  logActivity,
  autoLog
};
