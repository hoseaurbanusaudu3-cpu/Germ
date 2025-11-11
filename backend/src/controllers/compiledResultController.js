const { CompiledResult, Student, Class, Term, Session, Score, Subject, Affective, Psychomotor } = require('../models');
const { successResponse, errorResponse } = require('../utils/responseFormatter');
const { logActivity } = require('../middleware/activityLogger');
const notificationService = require('../services/notificationService');

const getCompiledResults = async (req, res, next) => {
  try {
    const { classId } = req.params;
    const { termId, sessionId, status } = req.query;

    const where = { class_id: classId };
    if (termId) where.term_id = termId;
    if (sessionId) where.session_id = sessionId;
    if (status) where.status = status;

    const results = await CompiledResult.findAll({
      where,
      include: [
        { model: Student, attributes: ['id', 'reg_no', 'full_name'] },
        { model: Term, attributes: ['id', 'name'] },
        { model: Session, attributes: ['id', 'name'] }
      ],
      order: [['position', 'ASC']]
    });

    return successResponse(res, 200, 'Results retrieved', results);
  } catch (error) {
    next(error);
  }
};

const compileResult = async (req, res, next) => {
  try {
    const { classId } = req.params;
    const { studentId, termId, sessionId, affective, psychomotor, attendance, comments } = req.body;

    // Get all scores for this student
    const scores = await Score.findAll({
      where: {
        student_id: studentId,
        class_id: classId,
        term_id: termId,
        session_id: sessionId,
        status: 'submitted'
      },
      include: [{ model: Subject }]
    });

    if (scores.length === 0) {
      return errorResponse(res, 400, 'No submitted scores found for this student');
    }

    // Calculate totals
    const totalScore = scores.reduce((sum, score) => sum + parseFloat(score.total), 0);
    const average = totalScore / scores.length;

    // Get all students in class for position calculation
    const allResults = await Score.findAll({
      where: { class_id: classId, term_id: termId, session_id: sessionId, status: 'submitted' },
      attributes: ['student_id'],
      group: ['student_id'],
      raw: true
    });

    // Check if result already exists
    let compiledResult = await CompiledResult.findOne({
      where: { student_id: studentId, term_id: termId, session_id: sessionId }
    });

    const resultData = {
      student_id: studentId,
      class_id: classId,
      term_id: termId,
      session_id: sessionId,
      total_score: totalScore,
      average: parseFloat(average.toFixed(2)),
      total_students: allResults.length,
      times_present: attendance?.present || 0,
      times_absent: attendance?.absent || 0,
      class_teacher_comment: comments?.classTeacher || '',
      status: 'draft',
      submitted_by: req.user.id
    };

    if (compiledResult) {
      await compiledResult.update(resultData);
    } else {
      compiledResult = await CompiledResult.create(resultData);
    }

    // Save affective domain
    if (affective && Array.isArray(affective)) {
      await Affective.destroy({ where: { compiled_id: compiledResult.id } });
      for (const item of affective) {
        await Affective.create({
          compiled_id: compiledResult.id,
          attribute: item.attribute,
          score: item.score,
          remark: item.remark
        });
      }
    }

    // Save psychomotor domain
    if (psychomotor && Array.isArray(psychomotor)) {
      await Psychomotor.destroy({ where: { compiled_id: compiledResult.id } });
      for (const item of psychomotor) {
        await Psychomotor.create({
          compiled_id: compiledResult.id,
          attribute: item.attribute,
          score: item.score,
          remark: item.remark
        });
      }
    }

    await logActivity(req, 'COMPILE_RESULT', 'compiled_results', compiledResult.id);

    return successResponse(res, 200, 'Result compiled successfully', compiledResult);
  } catch (error) {
    next(error);
  }
};

const submitResult = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await CompiledResult.findByPk(id);

    if (!result) {
      return errorResponse(res, 404, 'Result not found');
    }

    if (result.status !== 'draft') {
      return errorResponse(res, 400, 'Result has already been submitted');
    }

    await result.update({
      status: 'submitted',
      submitted_by: req.user.id,
      submitted_at: new Date()
    });

    await logActivity(req, 'SUBMIT_RESULT', 'compiled_results', result.id);

    // Send notification to admin that results were submitted
    try {
      const io = req.app.get('io');
      const klass = await Class.findByPk(result.class_id);
      const classTeacherId = klass?.class_teacher_id || req.user.id;
      await notificationService.notifyResultSubmission(
        io,
        classTeacherId,
        result.class_id,
        klass?.name || 'Class'
      );
    } catch (notifyErr) {
      console.error('Failed to notify admin of result submission:', notifyErr);
    }

    return successResponse(res, 200, 'Result submitted for approval', result);
  } catch (error) {
    next(error);
  }
};

const getPendingApprovals = async (req, res, next) => {
  try {
    const results = await CompiledResult.findAll({
      where: { status: 'submitted' },
      include: [
        { model: Student, attributes: ['id', 'reg_no', 'full_name'] },
        { model: Class, attributes: ['id', 'name'] },
        { model: Term, attributes: ['id', 'name'] },
        { model: Session, attributes: ['id', 'name'] }
      ],
      order: [['submitted_at', 'DESC']]
    });

    return successResponse(res, 200, 'Pending approvals retrieved', results);
  } catch (error) {
    next(error);
  }
};

const approveResult = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { principalComment } = req.body;

    const result = await CompiledResult.findByPk(id);

    if (!result) {
      return errorResponse(res, 404, 'Result not found');
    }

    if (result.status !== 'submitted') {
      return errorResponse(res, 400, 'Result must be submitted before approval');
    }

    await result.update({
      status: 'approved',
      approved_by: req.user.id,
      approved_at: new Date(),
      principal_comment: principalComment || result.principal_comment
    });

    await logActivity(req, 'APPROVE_RESULT', 'compiled_results', result.id);

    // Notify parent that result was approved
    try {
      const io = req.app.get('io');
      const student = await Student.findByPk(result.student_id);
      if (student?.parent_id) {
        await notificationService.notifyResultApproval(
          io,
          req.user.id,
          student.parent_id,
          student.full_name
        );
      }
    } catch (notifyErr) {
      console.error('Failed to notify parent of result approval:', notifyErr);
    }

    return successResponse(res, 200, 'Result approved successfully', result);
  } catch (error) {
    next(error);
  }
};

const rejectResult = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const result = await CompiledResult.findByPk(id);

    if (!result) {
      return errorResponse(res, 404, 'Result not found');
    }

    await result.update({
      status: 'rejected',
      rejection_reason: reason
    });

    await logActivity(req, 'REJECT_RESULT', 'compiled_results', result.id, { reason });

    // Notify class teacher of rejection
    try {
      const io = req.app.get('io');
      const klass = await Class.findByPk(result.class_id);
      if (klass?.class_teacher_id) {
        await notificationService.sendNotification(io, {
          sender_id: req.user.id,
          receiver_id: klass.class_teacher_id,
          title: 'Result Rejected',
          message: `Result for student ID ${result.student_id} was rejected: ${reason}`,
          type: 'warning',
          link: `/compiled/${result.class_id}`
        });
      }
    } catch (notifyErr) {
      console.error('Failed to notify class teacher of result rejection:', notifyErr);
    }

    return successResponse(res, 200, 'Result rejected', result);
  } catch (error) {
    next(error);
  }
};

const getStudentResult = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const { termId, sessionId } = req.query;

    const where = { student_id: studentId };
    if (termId) where.term_id = termId;
    if (sessionId) where.session_id = sessionId;

    const result = await CompiledResult.findOne({
      where,
      include: [
        { model: Student },
        { model: Class },
        { model: Term },
        { model: Session },
        { model: Affective },
        { model: Psychomotor }
      ]
    });

    if (!result) {
      return errorResponse(res, 404, 'Result not found');
    }

    // Get scores
    const scores = await Score.findAll({
      where: {
        student_id: studentId,
        term_id: result.term_id,
        session_id: result.session_id
      },
      include: [{ model: Subject }]
    });

    return successResponse(res, 200, 'Result retrieved', {
      ...result.toJSON(),
      scores
    });
  } catch (error) {
    next(error);
  }
};

const downloadResultPDF = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const { termId, sessionId } = req.query;

    // Get complete result data
    const result = await CompiledResult.findOne({
      where: { student_id: studentId, term_id: termId, session_id: sessionId, status: 'approved' },
      include: [
        { model: Student },
        { model: Class },
        { model: Term },
        { model: Session },
        { model: Affective },
        { model: Psychomotor }
      ]
    });

    if (!result) {
      return errorResponse(res, 404, 'Approved result not found');
    }

    // Get scores
    const scores = await Score.findAll({
      where: {
        student_id: studentId,
        term_id: termId,
        session_id: sessionId
      },
      include: [{ model: Subject }]
    });

    // Lazy-load PDF service to avoid startup issues when dependencies are missing
    const pdfService = require('../services/pdfService');
    const config = require('../config');

    // Generate PDF
    const pdfBuffer = await pdfService.generateResultPDF({
      student: result.Student,
      class: result.Class,
      term: result.Term,
      session: result.Session,
      scores,
      compiledResult: result,
      affective: result.Affectives,
      psychomotor: result.Psychomotors,
      school: config.school
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=result_${result.Student.reg_no}_${result.Term.name}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCompiledResults,
  compileResult,
  submitResult,
  getPendingApprovals,
  approveResult,
  rejectResult,
  getStudentResult,
  downloadResultPDF
};
