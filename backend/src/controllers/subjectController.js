const { Subject, ClassSubject, Class, User } = require('../models');
const { successResponse, errorResponse } = require('../utils/responseFormatter');
const { logActivity } = require('../middleware/activityLogger');

const getSubjects = async (req, res, next) => {
  try {
    const { status } = req.query;
    const where = {};
    if (status) where.status = status;

    const subjects = await Subject.findAll({
      where,
      order: [['name', 'ASC']]
    });

    return successResponse(res, 200, 'Subjects retrieved', subjects);
  } catch (error) {
    next(error);
  }
};

const getSubjectById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const subject = await Subject.findByPk(id);

    if (!subject) {
      return errorResponse(res, 404, 'Subject not found');
    }

    return successResponse(res, 200, 'Subject retrieved', subject);
  } catch (error) {
    next(error);
  }
};

const createSubject = async (req, res, next) => {
  try {
    const { name, code, is_core, status } = req.body;

    const subject = await Subject.create({ name, code, is_core, status });

    await logActivity(req, 'CREATE_SUBJECT', 'subjects', subject.id, { name, code });

    return successResponse(res, 201, 'Subject created successfully', subject);
  } catch (error) {
    next(error);
  }
};

const updateSubject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, code, is_core, status } = req.body;

    const subject = await Subject.findByPk(id);

    if (!subject) {
      return errorResponse(res, 404, 'Subject not found');
    }

    await subject.update({ name, code, is_core, status });

    await logActivity(req, 'UPDATE_SUBJECT', 'subjects', subject.id);

    return successResponse(res, 200, 'Subject updated successfully', subject);
  } catch (error) {
    next(error);
  }
};

const deleteSubject = async (req, res, next) => {
  try {
    const { id } = req.params;

    const subject = await Subject.findByPk(id);

    if (!subject) {
      return errorResponse(res, 404, 'Subject not found');
    }

    await subject.destroy();

    await logActivity(req, 'DELETE_SUBJECT', 'subjects', id);

    return successResponse(res, 200, 'Subject deleted successfully');
  } catch (error) {
    next(error);
  }
};

const assignTeacher = async (req, res, next) => {
  try {
    const { class_id, subject_id, teacher_id, session_id } = req.body;

    const assignment = await ClassSubject.create({
      class_id,
      subject_id,
      teacher_id,
      session_id
    });

    await logActivity(req, 'ASSIGN_TEACHER', 'class_subjects', assignment.id, {
      class_id,
      subject_id,
      teacher_id
    });

    const result = await ClassSubject.findByPk(assignment.id, {
      include: [
        { model: Class, attributes: ['id', 'name'] },
        { model: Subject, attributes: ['id', 'name'] },
        { model: User, as: 'teacher', attributes: ['id', 'name'] }
      ]
    });

    return successResponse(res, 201, 'Teacher assigned successfully', result);
  } catch (error) {
    next(error);
  }
};

const getClassSubjects = async (req, res, next) => {
  try {
    const { classId, teacherId } = req.query;
    const where = {};
    if (classId) where.class_id = classId;
    if (teacherId) where.teacher_id = teacherId;

    const assignments = await ClassSubject.findAll({
      where,
      include: [
        { model: Class, attributes: ['id', 'name'] },
        { model: Subject, attributes: ['id', 'name', 'code'] },
        { model: User, as: 'teacher', attributes: ['id', 'name'] }
      ]
    });

    return successResponse(res, 200, 'Assignments retrieved', assignments);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
  assignTeacher,
  getClassSubjects
};
