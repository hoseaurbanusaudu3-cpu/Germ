const fs = require('fs');
const csv = require('csv-parser');
const { createObjectCsvWriter } = require('csv-writer');
const { Score, Student, Subject } = require('../models');
const { calculateGrade, getGradeRemark, validateScores } = require('../utils/gradeCalculator');

/**
 * Export scores to CSV
 */
const exportScores = async (scores) => {
  const csvWriter = createObjectCsvWriter({
    path: '/tmp/scores_export.csv',
    header: [
      { id: 'reg_no', title: 'Registration Number' },
      { id: 'student_name', title: 'Student Name' },
      { id: 'class_name', title: 'Class' },
      { id: 'subject_name', title: 'Subject' },
      { id: 'ca1', title: 'CA1 (20)' },
      { id: 'ca2', title: 'CA2 (20)' },
      { id: 'exam', title: 'Exam (60)' },
      { id: 'total', title: 'Total (100)' },
      { id: 'grade', title: 'Grade' },
      { id: 'remark', title: 'Remark' }
    ]
  });

  const records = scores.map(score => ({
    reg_no: score.Student.reg_no,
    student_name: score.Student.full_name,
    class_name: score.Class.name,
    subject_name: score.Subject.name,
    ca1: score.ca1,
    ca2: score.ca2,
    exam: score.exam,
    total: score.total,
    grade: score.grade,
    remark: score.remark
  }));

  await csvWriter.writeRecords(records);
  
  const csvData = fs.readFileSync('/tmp/scores_export.csv', 'utf8');
  fs.unlinkSync('/tmp/scores_export.csv');
  
  return csvData;
};

/**
 * Import scores from CSV
 */
const importScores = async (filePath, userId) => {
  return new Promise((resolve, reject) => {
    const results = [];
    const errors = [];
    let lineNumber = 1;

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        lineNumber++;
        try {
          // Validate required fields
          if (!row.reg_no || !row.subject_name || !row.ca1 || !row.ca2 || !row.exam) {
            errors.push({
              line: lineNumber,
              error: 'Missing required fields',
              row
            });
            return;
          }

          // Validate score values
          const ca1 = parseFloat(row.ca1);
          const ca2 = parseFloat(row.ca2);
          const exam = parseFloat(row.exam);

          const validation = validateScores(ca1, ca2, exam);
          if (!validation.valid) {
            errors.push({
              line: lineNumber,
              error: validation.errors.join(', '),
              row
            });
            return;
          }

          results.push({
            reg_no: row.reg_no.trim(),
            subject_name: row.subject_name.trim(),
            ca1,
            ca2,
            exam
          });
        } catch (err) {
          errors.push({
            line: lineNumber,
            error: err.message,
            row
          });
        }
      })
      .on('end', async () => {
        // Process valid records
        const imported = [];
        const importErrors = [];

        for (const record of results) {
          try {
            // Find student
            const student = await Student.findOne({ where: { reg_no: record.reg_no } });
            if (!student) {
              importErrors.push({
                record,
                error: 'Student not found'
              });
              continue;
            }

            // Find subject
            const subject = await Subject.findOne({ where: { name: record.subject_name } });
            if (!subject) {
              importErrors.push({
                record,
                error: 'Subject not found'
              });
              continue;
            }

            // Calculate total and grade
            const total = record.ca1 + record.ca2 + record.exam;
            const grade = calculateGrade(total);
            const remark = getGradeRemark(grade);

            // Create or update score
            const [score, created] = await Score.findOrCreate({
              where: {
                student_id: student.id,
                subject_id: subject.id
                // Add term_id and session_id from context if needed
              },
              defaults: {
                ca1: record.ca1,
                ca2: record.ca2,
                exam: record.exam,
                total,
                grade,
                remark,
                submitted_by: userId
              }
            });

            if (!created) {
              await score.update({
                ca1: record.ca1,
                ca2: record.ca2,
                exam: record.exam,
                total,
                grade,
                remark
              });
            }

            imported.push(score);
          } catch (err) {
            importErrors.push({
              record,
              error: err.message
            });
          }
        }

        // Clean up file
        fs.unlinkSync(filePath);

        resolve({
          total: results.length,
          imported: imported.length,
          errors: errors.length + importErrors.length,
          errorDetails: [...errors, ...importErrors]
        });
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};

/**
 * Generate CSV template for score import
 */
const generateScoreTemplate = async () => {
  const csvWriter = createObjectCsvWriter({
    path: '/tmp/score_template.csv',
    header: [
      { id: 'reg_no', title: 'Registration Number' },
      { id: 'subject_name', title: 'Subject Name' },
      { id: 'ca1', title: 'CA1 (0-20)' },
      { id: 'ca2', title: 'CA2 (0-20)' },
      { id: 'exam', title: 'Exam (0-60)' }
    ]
  });

  const sampleData = [
    { reg_no: 'GRA/2024/001', subject_name: 'Mathematics', ca1: 18, ca2: 19, exam: 55 },
    { reg_no: 'GRA/2024/002', subject_name: 'English', ca1: 17, ca2: 18, exam: 52 }
  ];

  await csvWriter.writeRecords(sampleData);
  
  const csvData = fs.readFileSync('/tmp/score_template.csv', 'utf8');
  fs.unlinkSync('/tmp/score_template.csv');
  
  return csvData;
};

module.exports = {
  exportScores,
  importScores,
  generateScoreTemplate
};
