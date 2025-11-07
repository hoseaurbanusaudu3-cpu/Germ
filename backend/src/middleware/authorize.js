/**
 * Role-Based Access Control Middleware
 * @param {Array<string>} roles - Array of allowed roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.'
      });
    }

    next();
  };
};

/**
 * Check if user is admin
 */
const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  next();
};

/**
 * Check if user is teacher or class teacher
 */
const isTeacher = (req, res, next) => {
  if (!req.user || !['teacher', 'class_teacher', 'admin'].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Teacher access required'
    });
  }
  next();
};

/**
 * Check if user is class teacher
 */
const isClassTeacher = (req, res, next) => {
  if (!req.user || !['class_teacher', 'admin'].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Class teacher access required'
    });
  }
  next();
};

/**
 * Check if user is accountant
 */
const isAccountant = (req, res, next) => {
  if (!req.user || !['accountant', 'admin'].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Accountant access required'
    });
  }
  next();
};

/**
 * Check if user is parent
 */
const isParent = (req, res, next) => {
  if (!req.user || req.user.role !== 'parent') {
    return res.status(403).json({
      success: false,
      message: 'Parent access required'
    });
  }
  next();
};

module.exports = {
  authorize,
  isAdmin,
  isTeacher,
  isClassTeacher,
  isAccountant,
  isParent
};
