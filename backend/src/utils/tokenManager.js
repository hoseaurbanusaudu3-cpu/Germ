const jwt = require('jsonwebtoken');
const config = require('../config');
const { RefreshToken } = require('../models');

/**
 * Generate access token
 * @param {object} user - User object
 * @returns {string} JWT token
 */
const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    config.jwt.secret,
    { expiresIn: config.jwt.expire }
  );
};

/**
 * Generate refresh token
 * @param {object} user - User object
 * @returns {Promise<string>} Refresh token
 */
const generateRefreshToken = async (user) => {
  const token = jwt.sign(
    { id: user.id },
    config.jwt.refreshSecret,
    { expiresIn: config.jwt.refreshExpire }
  );

  const decoded = jwt.decode(token);
  const expiresAt = new Date(decoded.exp * 1000);

  await RefreshToken.create({
    user_id: user.id,
    token,
    expires_at: expiresAt
  });

  return token;
};

/**
 * Verify refresh token
 * @param {string} token - Refresh token
 * @returns {Promise<object>} Decoded token
 */
const verifyRefreshToken = async (token) => {
  try {
    const decoded = jwt.verify(token, config.jwt.refreshSecret);
    
    const refreshToken = await RefreshToken.findOne({
      where: {
        token,
        is_revoked: false
      }
    });

    if (!refreshToken) {
      throw new Error('Invalid refresh token');
    }

    if (new Date() > refreshToken.expires_at) {
      throw new Error('Refresh token expired');
    }

    return decoded;
  } catch (error) {
    throw error;
  }
};

/**
 * Revoke refresh token
 * @param {string} token - Refresh token
 */
const revokeRefreshToken = async (token) => {
  await RefreshToken.update(
    { is_revoked: true },
    { where: { token } }
  );
};

/**
 * Revoke all user refresh tokens
 * @param {number} userId - User ID
 */
const revokeAllUserTokens = async (userId) => {
  await RefreshToken.update(
    { is_revoked: true },
    { where: { user_id: userId, is_revoked: false } }
  );
};

/**
 * Clean up expired tokens
 */
const cleanupExpiredTokens = async () => {
  await RefreshToken.destroy({
    where: {
      expires_at: {
        [require('sequelize').Op.lt]: new Date()
      }
    }
  });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  revokeRefreshToken,
  revokeAllUserTokens,
  cleanupExpiredTokens
};
