const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken, revokeRefreshToken, revokeAllUserTokens } = require('../utils/tokenManager');
const { successResponse, errorResponse } = require('../utils/responseFormatter');
const { logActivity } = require('../middleware/activityLogger');

/**
 * User login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return errorResponse(res, 401, 'Invalid credentials');
    }

    // Check if user is active
    if (user.status !== 'active') {
      return errorResponse(res, 401, 'Account is inactive');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return errorResponse(res, 401, 'Invalid credentials');
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    // Update last login
    await user.update({ last_login: new Date() });

    // Log activity
    await logActivity(
      { user, ip: req.ip, get: req.get.bind(req) },
      'LOGIN',
      'users',
      user.id,
      { email: user.email }
    );

    // Return user data without password
    const userData = user.toJSON();
    delete userData.password_hash;

    return successResponse(res, 200, 'Login successful', {
      user: userData,
      accessToken,
      refreshToken
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Refresh access token
 */
const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return errorResponse(res, 400, 'Refresh token required');
    }

    // Verify refresh token
    const decoded = await verifyRefreshToken(refreshToken);

    // Get user
    const user = await User.findByPk(decoded.id);

    if (!user || user.status !== 'active') {
      return errorResponse(res, 401, 'Invalid refresh token');
    }

    // Generate new access token
    const accessToken = generateAccessToken(user);

    return successResponse(res, 200, 'Token refreshed', { accessToken });
  } catch (error) {
    if (error.message.includes('token')) {
      return errorResponse(res, 401, error.message);
    }
    next(error);
  }
};

/**
 * Logout
 */
const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      await revokeRefreshToken(refreshToken);
    }

    // Log activity
    await logActivity(
      req,
      'LOGOUT',
      'users',
      req.user.id
    );

    return successResponse(res, 200, 'Logout successful');
  } catch (error) {
    next(error);
  }
};

/**
 * Logout from all devices
 */
const logoutAll = async (req, res, next) => {
  try {
    await revokeAllUserTokens(req.user.id);

    // Log activity
    await logActivity(
      req,
      'LOGOUT_ALL',
      'users',
      req.user.id
    );

    return successResponse(res, 200, 'Logged out from all devices');
  } catch (error) {
    next(error);
  }
};

/**
 * Change password
 */
const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;

    // Get user with password
    const user = await User.findByPk(req.user.id);

    // Verify old password
    const isValidPassword = await bcrypt.compare(oldPassword, user.password_hash);

    if (!isValidPassword) {
      return errorResponse(res, 401, 'Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await user.update({ password_hash: hashedPassword });

    // Revoke all refresh tokens
    await revokeAllUserTokens(user.id);

    // Log activity
    await logActivity(
      req,
      'CHANGE_PASSWORD',
      'users',
      user.id
    );

    return successResponse(res, 200, 'Password changed successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user profile
 */
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password_hash'] }
    });

    return successResponse(res, 200, 'Profile retrieved', user);
  } catch (error) {
    next(error);
  }
};

/**
 * Update current user profile
 */
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body;

    const user = await User.findByPk(req.user.id);

    await user.update({
      name: name || user.name,
      phone: phone || user.phone
    });

    // Log activity
    await logActivity(
      req,
      'UPDATE_PROFILE',
      'users',
      user.id,
      { name, phone }
    );

    const userData = user.toJSON();
    delete userData.password_hash;

    return successResponse(res, 200, 'Profile updated', userData);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  refresh,
  logout,
  logoutAll,
  changePassword,
  getProfile,
  updateProfile
};
