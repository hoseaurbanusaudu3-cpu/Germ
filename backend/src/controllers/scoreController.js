const { Score, Student, Subject, Class, Term, Session, User } = require('../models');
const { successResponse, errorResponse } = require('../utils/responseFormatter');
const { calculateGrade, getGradeRemark, calculateClassStats, validateScores } = require('../utils/gradeCalculator');
const { logActivity } = require('../middleware/activityLogger');
const csvService = require('../services/csvService');
const notificationService = require('../services/notificationService');

/**
 * Get scores with filters
 */
const getScores = async (req, res, next) => {
  try {
    const { classId, subjectId, termId, sessionId, studentId, status } = req.query;

    const where = {};
    if (classId) where.class_id = classId;
    if (subjectId) where.subject_id = subjectId;
    if (termId) where.term_id = termId;
    if (sessionId) where.session_id = sessionId;
    if (studentId) where.student_id = studentId;
    if (status) where.status = status;

    const scores = await Score.findAll({
      where,
      include: [
        { model: Student, attributes: ['id', 'reg_no', 'full_name'] },
        { model: Subject, attributes: ['id', 'name', 'code'] },
        { model: Class, attributes: ['id', 'name'] },
        { model: Term, attributes: ['id', 'name'] },
        { model: Session, attributes: ['id', 'name'] }
      ],
      order: [['student_id', 'ASC']]
    });

    return successResponse(res, 200, 'Scores retrieved', scores);
  } catch (error) {
    next(error);
  }
};

/**
 * Get class students for score entry
 */
const getClassStudents = async (req, res, next) => {
  try {
    const { classId } = req.params;
    const { subjectId, termId, sessionId } = req.query;

    const students = await Student.findAll({
      where: { class_id: classId, status: 'active' },
      attributes: ['id', 'reg_no', 'full_name'],
      order: [['full_name', 'ASC']]
    });

    // Get existing scores if filters provided
    let scores = [];
    if (subjectId && termId && sessionId) {
      scores = await Score.findAll({
        where: {
          class_id: classId,
          subject_id: subjectId,
          term_id: termId,
          session_id: sessionId
        }
      });
    }

    // Map scores to students
    const studentsWithScores = students.map(student => {
      const score = scores.find(s => s.student_id === student.id);
      return {
        ...student.toJSON(),
        score: score || null
      };
    });

    return successResponse(res, 200, 'Students retrieved', studentsWithScores);
  } catch (error) {
    next(error);
  }
};

/**
 * Bulk create/update scores
 */
const bulkSaveScores = async (req, res, next) => {
  try {
    const { scores } = req.body;

    if (!Array.isArray(scores) || scores.length === 0) {
      return errorResponse(res, 400, 'Scores array is required');
    }

    const results = [];
    const errors = [];

    for (const scoreData of scores) {
      try {
        // Validate scores
        const validation = validateScores(scoreData.ca1, scoreData.ca2, scoreData.exam);
        if (!validation.valid) {
          errors.push({
            student_id: scoreData.student_id,
            errors: validation.errors
          });
          continue;
        }

        // Calculate total and grade
        const total = parseFloat(scoreData.ca1) + parseFloat(scoreData.ca2) + parseFloat(scoreData.exam);
        const grade = calculateGrade(total);
        const remark = getGradeRemark(grade);

        const scorePayload = {
          ...scoreData,
          total,
          grade,
          remark,
          submitted_by: req.user.id
        };

        // Check if score exists
        const existingScore = await Score.findOne({
          where: {
            student_id: scoreData.student_id,
            subject_id: scoreData.subject_id,
            term_id: scoreData.term_id,
            session_id: scoreData.session_id
          }
        });

        if (existingScore) {
          // Check if locked
          if (existingScore.status === 'locked') {
            errors.push({
              student_id: scoreData.student_id,
              errors: ['Score is locked and cannot be modified']
            });
            continue;
          }
          await existingScore.update(scorePayload);
          results.push(existingScore);
        } else {
          const newScore = await Score.create(scorePayload);
          results.push(newScore);
        }
      } catch (err) {
        errors.push({
          student_id: scoreData.student_id,
          errors: [err.message]
        });
      }
    }

    // Calculate class statistics
    if (results.length > 0) {
      const totals = results.map(s => parseFloat(s.total));
      const stats = calculateClassStats(totals);

      // Update all scores with class stats
      await Score.update(
        {
          class_average: stats.average,
          class_min: stats.min,
          class_max: stats.max
        },
        {
          where: {
            subject_id: results[0].subject_id,
            term_id: results[0].term_id,
            session_id: results[0].session_id,
            class_id: results[0].class_id
          }
        }
      );
    }

    await logActivity(req, 'BULK_SAVE_SCORES', 'scores', null, { count: results.length });

    return successResponse(res, 200, 'Scores saved successfully', {
      saved: results.length,
      errors: errors.length,
      errorDetails: errors
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Submit scores (lock for editing)
 */
const submitScores = async (req, res, next) => {
  try {
    const { scoreIds } = req.body;

    await Score.update(
      {
        status: 'submitted',
        submitted_by: req.user.id,
        submitted_at: new Date()
      },
      {
        where: { id: scoreIds }
      }
    );

    await logActivity(req, 'SUBMIT_SCORES', 'scores', null, { count: scoreIds.length });

    // Notify class teacher that scores were submitted
    try {
      const io = req.app.get('io');
      const firstScore = await Score.findByPk(scoreIds[0]);
      if (firstScore) {
        const subject = await Subject.findByPk(firstScore.subject_id);
        await notificationService.notifyScoreSubmission(
          io,
          req.user.id,
          firstScore.class_id,
          subject?.name || 'Subject'
        );
      }
    } catch (notifyErr) {
      console.error('Failed to notify class teacher of score submission:', notifyErr);
    }

    return successResponse(res, 200, 'Scores submitted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Export scores to CSV
 */
const exportScores = async (req, res, next) => {
  try {
    const { classId, subjectId, termId, sessionId } = req.query;

    const where = {};
    if (classId) where.class_id = classId;
    if (subjectId) where.subject_id = subjectId;
    if (termId) where.term_id = termId;
    if (sessionId) where.session_id = sessionId;

    const scores = await Score.findAll({
      where,
      include: [
        { model: Student, attributes: ['reg_no', 'full_name'] },
        { model: Subject, attributes: ['name'] },
        { model: Class, attributes: ['name'] }
      ]
    });

    const csvData = await csvService.exportScores(scores);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=scores.csv');
    res.send(csvData);
  } catch (error) {
    next(error);
  }
};

/**
 * Import scores from CSV
 */
const importScores = async (req, res, next) => {
  try {
    if (!req.file) {
      return errorResponse(res, 400, 'CSV file is required');
    }

    const result = await csvService.importScores(req.file.path, req.user.id);

    await logActivity(req, 'IMPORT_SCORES', 'scores', null, result);

    return successResponse(res, 200, 'Import completed', result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getScores,
  getClassStudents,
  bulkSaveScores,
  submitScores,
  exportScores,
  importScores
};
