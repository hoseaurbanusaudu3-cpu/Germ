const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/responseFormatter');
const { logActivity } = require('../middleware/activityLogger');
const { Op } = require('sequelize');

const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, role, status, search } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (role) where.role = role;
    if (status) where.status = status;
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password_hash'] },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    return paginatedResponse(res, rows, page, limit, count);
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password_hash'] }
    });

    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }

    return successResponse(res, 200, 'User retrieved', user);
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { name, email, phone, role, password } = req.body;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await User.create({
      name,
      email,
      phone,
      role,
      password_hash: hashedPassword,
      status: 'active'
    });

    await logActivity(req, 'CREATE_USER', 'users', user.id, { email, role });

    const userData = user.toJSON();
    delete userData.password_hash;

    return successResponse(res, 201, 'User created successfully', userData);
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, phone, role, status } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }

    await user.update({ name, phone, role, status });

    await logActivity(req, 'UPDATE_USER', 'users', user.id);

    const userData = user.toJSON();
    delete userData.password_hash;

    return successResponse(res, 200, 'User updated successfully', userData);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (parseInt(id) === req.user.id) {
      return errorResponse(res, 400, 'Cannot delete your own account');
    }

    const user = await User.findByPk(id);

    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }

    await user.destroy();

    await logActivity(req, 'DELETE_USER', 'users', id);

    return successResponse(res, 200, 'User deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
