const { Class, User, Student } = require('../models');
const { successResponse, errorResponse } = require('../utils/responseFormatter');
const { logActivity } = require('../middleware/activityLogger');

const getClasses = async (req, res, next) => {
  try {
    const { level, status } = req.query;
    const where = {};
    if (level) where.level = level;
    if (status) where.status = status;

    const classes = await Class.findAll({
      where,
      include: [
        { model: User, as: 'classTeacher', attributes: ['id', 'name', 'email'] }
      ],
      order: [['name', 'ASC']]
    });

    return successResponse(res, 200, 'Classes retrieved', classes);
  } catch (error) {
    next(error);
  }
};

const getClassById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const classData = await Class.findByPk(id, {
      include: [
        { model: User, as: 'classTeacher', attributes: ['id', 'name', 'email'] },
        { model: Student, attributes: ['id', 'reg_no', 'full_name', 'status'] }
      ]
    });

    if (!classData) {
      return errorResponse(res, 404, 'Class not found');
    }

    return successResponse(res, 200, 'Class retrieved', classData);
  } catch (error) {
    next(error);
  }
};

const createClass = async (req, res, next) => {
  try {
    const { name, level, class_teacher_id, capacity, status } = req.body;

    const classData = await Class.create({
      name,
      level,
      class_teacher_id,
      capacity,
      status
    });

    await logActivity(req, 'CREATE_CLASS', 'classes', classData.id, { name, level });

    return successResponse(res, 201, 'Class created successfully', classData);
  } catch (error) {
    next(error);
  }
};

const updateClass = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, level, class_teacher_id, capacity, status } = req.body;

    const classData = await Class.findByPk(id);

    if (!classData) {
      return errorResponse(res, 404, 'Class not found');
    }

    await classData.update({ name, level, class_teacher_id, capacity, status });

    await logActivity(req, 'UPDATE_CLASS', 'classes', classData.id);

    return successResponse(res, 200, 'Class updated successfully', classData);
  } catch (error) {
    next(error);
  }
};

const deleteClass = async (req, res, next) => {
  try {
    const { id } = req.params;

    const classData = await Class.findByPk(id);

    if (!classData) {
      return errorResponse(res, 404, 'Class not found');
    }

    // Check if class has students
    const studentCount = await Student.count({ where: { class_id: id } });
    if (studentCount > 0) {
      return errorResponse(res, 400, 'Cannot delete class with students. Please reassign students first.');
    }

    await classData.destroy();

    await logActivity(req, 'DELETE_CLASS', 'classes', id);

    return successResponse(res, 200, 'Class deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass
};
