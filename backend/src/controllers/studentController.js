const { Student, Class, User } = require('../models');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/responseFormatter');
const { logActivity } = require('../middleware/activityLogger');
const { Op } = require('sequelize');

/**
 * Get all students with pagination and filters
 */
const getStudents = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, classId, status, search } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    
    if (classId) where.class_id = classId;
    if (status) where.status = status;
    if (search) {
      where[Op.or] = [
        { full_name: { [Op.like]: `%${search}%` } },
        { reg_no: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows } = await Student.findAndCountAll({
      where,
      include: [
        { model: Class, attributes: ['id', 'name', 'level'] },
        { model: User, as: 'parent', attributes: ['id', 'name', 'email', 'phone'] }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    return paginatedResponse(res, rows, page, limit, count);
  } catch (error) {
    next(error);
  }
};

/**
 * Get student by ID
 */
const getStudentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const student = await Student.findByPk(id, {
      include: [
        { model: Class, attributes: ['id', 'name', 'level'] },
        { model: User, as: 'parent', attributes: ['id', 'name', 'email', 'phone'] }
      ]
    });

    if (!student) {
      return errorResponse(res, 404, 'Student not found');
    }

    return successResponse(res, 200, 'Student retrieved', student);
  } catch (error) {
    next(error);
  }
};

/**
 * Create new student
 */
const createStudent = async (req, res, next) => {
  try {
    const studentData = req.body;

    const student = await Student.create(studentData);

    await logActivity(req, 'CREATE_STUDENT', 'students', student.id, studentData);

    return successResponse(res, 201, 'Student created successfully', student);
  } catch (error) {
    next(error);
  }
};

/**
 * Update student
 */
const updateStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const student = await Student.findByPk(id);

    if (!student) {
      return errorResponse(res, 404, 'Student not found');
    }

    await student.update(updateData);

    await logActivity(req, 'UPDATE_STUDENT', 'students', student.id, updateData);

    return successResponse(res, 200, 'Student updated successfully', student);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete student
 */
const deleteStudent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const student = await Student.findByPk(id);

    if (!student) {
      return errorResponse(res, 404, 'Student not found');
    }

    await student.destroy();

    await logActivity(req, 'DELETE_STUDENT', 'students', id);

    return successResponse(res, 200, 'Student deleted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Upload student photo
 */
const uploadPhoto = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return errorResponse(res, 400, 'No file uploaded');
    }

    const student = await Student.findByPk(id);

    if (!student) {
      return errorResponse(res, 404, 'Student not found');
    }

    const photoPath = `/uploads/students/${req.file.filename}`;
    await student.update({ photo_path: photoPath });

    await logActivity(req, 'UPLOAD_PHOTO', 'students', id);

    return successResponse(res, 200, 'Photo uploaded successfully', { photo_path: photoPath });
  } catch (error) {
    next(error);
  }
};

/**
 * Link parent to student
 */
const linkParent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { parentId } = req.body;

    const student = await Student.findByPk(id);
    if (!student) {
      return errorResponse(res, 404, 'Student not found');
    }

    const parent = await User.findOne({ where: { id: parentId, role: 'parent' } });
    if (!parent) {
      return errorResponse(res, 404, 'Parent not found');
    }

    await student.update({ parent_id: parentId });

    await logActivity(req, 'LINK_PARENT', 'students', id, { parentId });

    return successResponse(res, 200, 'Parent linked successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  uploadPhoto,
  linkParent
};
