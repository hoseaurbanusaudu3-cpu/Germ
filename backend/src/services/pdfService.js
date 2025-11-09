// const puppeteer = require('puppeteer'); // Temporarily disabled for deployment
const path = require('path');
const config = require('../config');

/**
 * Generate PDF report card
 * NOTE: Puppeteer temporarily disabled for deployment
 * Returns HTML that can be printed to PDF by the browser
 */
const generateResultPDF = async (resultData) => {
  // Temporarily return HTML instead of PDF
  // The frontend can use window.print() to generate PDF
  const html = generateResultHTML(resultData);
  return Buffer.from(html, 'utf-8');
};

/**
 * Generate HTML for result card
 */
const generateResultHTML = (data) => {
  const {
    student,
    class: classInfo,
    term,
    session,
    scores,
    compiledResult,
    affective,
    psychomotor,
    school
  } = data;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Result Card - ${student.full_name}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Arial', sans-serif;
          font-size: 12px;
          line-height: 1.4;
          color: #333;
        }
        
        .container {
          width: 100%;
          padding: 20px;
        }
        
        .header {
          text-align: center;
          margin-bottom: 20px;
          border-bottom: 3px solid #2c3e50;
          padding-bottom: 15px;
        }
        
        .school-name {
          font-size: 24px;
          font-weight: bold;
          color: #2c3e50;
          margin-bottom: 5px;
        }
        
        .school-motto {
          font-style: italic;
          color: #7f8c8d;
          margin-bottom: 10px;
        }
        
        .report-title {
          font-size: 18px;
          font-weight: bold;
          margin-top: 10px;
        }
        
        .student-info {
          display: flex;
          justify-content: space-between;
          margin: 20px 0;
          padding: 15px;
          background: #ecf0f1;
          border-radius: 5px;
        }
        
        .info-group {
          flex: 1;
        }
        
        .info-label {
          font-weight: bold;
          color: #2c3e50;
        }
        
        .scores-table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        
        .scores-table th {
          background: #34495e;
          color: white;
          padding: 10px;
          text-align: left;
          font-weight: bold;
        }
        
        .scores-table td {
          padding: 8px;
          border: 1px solid #bdc3c7;
        }
        
        .scores-table tr:nth-child(even) {
          background: #f8f9fa;
        }
        
        .summary-section {
          display: flex;
          gap: 20px;
          margin: 20px 0;
        }
        
        .summary-box {
          flex: 1;
          padding: 15px;
          border: 2px solid #3498db;
          border-radius: 5px;
          text-align: center;
        }
        
        .summary-label {
          font-size: 11px;
          color: #7f8c8d;
          margin-bottom: 5px;
        }
        
        .summary-value {
          font-size: 20px;
          font-weight: bold;
          color: #2c3e50;
        }
        
        .traits-section {
          margin: 20px 0;
        }
        
        .traits-title {
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 10px;
          color: #2c3e50;
        }
        
        .traits-table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .traits-table td {
          padding: 6px;
          border: 1px solid #bdc3c7;
        }
        
        .rating {
          text-align: center;
          font-weight: bold;
        }
        
        .comments-section {
          margin: 20px 0;
        }
        
        .comment-box {
          margin: 10px 0;
          padding: 10px;
          border: 1px solid #bdc3c7;
          border-radius: 5px;
        }
        
        .comment-label {
          font-weight: bold;
          color: #2c3e50;
          margin-bottom: 5px;
        }
        
        .signature-section {
          display: flex;
          justify-content: space-between;
          margin-top: 30px;
        }
        
        .signature-box {
          text-align: center;
        }
        
        .signature-line {
          border-top: 1px solid #333;
          margin-top: 40px;
          padding-top: 5px;
        }
        
        .grade-a { color: #27ae60; font-weight: bold; }
        .grade-b { color: #2980b9; font-weight: bold; }
        .grade-c { color: #f39c12; font-weight: bold; }
        .grade-d { color: #e67e22; font-weight: bold; }
        .grade-e { color: #d35400; font-weight: bold; }
        .grade-f { color: #c0392b; font-weight: bold; }
        
        @media print {
          .container {
            padding: 0;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <div class="school-name">${school.name || 'GRACELAND ROYAL ACADEMY GOMBE'}</div>
          <div class="school-motto">${school.motto || 'Wisdom & Illumination'}</div>
          <div class="report-title">STUDENT REPORT CARD</div>
        </div>
        
        <!-- Student Information -->
        <div class="student-info">
          <div class="info-group">
            <div><span class="info-label">Name:</span> ${student.full_name}</div>
            <div><span class="info-label">Reg. No:</span> ${student.reg_no}</div>
            <div><span class="info-label">Class:</span> ${classInfo.name}</div>
          </div>
          <div class="info-group">
            <div><span class="info-label">Session:</span> ${session.name}</div>
            <div><span class="info-label">Term:</span> ${term.name}</div>
            <div><span class="info-label">Gender:</span> ${student.gender}</div>
          </div>
        </div>
        
        <!-- Scores Table -->
        <table class="scores-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>CA1 (20)</th>
              <th>CA2 (20)</th>
              <th>Exam (60)</th>
              <th>Total (100)</th>
              <th>Grade</th>
              <th>Remark</th>
              <th>Class Avg</th>
            </tr>
          </thead>
          <tbody>
            ${scores.map(score => `
              <tr>
                <td>${score.Subject.name}</td>
                <td>${score.ca1}</td>
                <td>${score.ca2}</td>
                <td>${score.exam}</td>
                <td>${score.total}</td>
                <td class="grade-${score.grade.toLowerCase()}">${score.grade}</td>
                <td>${score.remark}</td>
                <td>${score.class_average || '-'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <!-- Summary -->
        <div class="summary-section">
          <div class="summary-box">
            <div class="summary-label">Total Score</div>
            <div class="summary-value">${compiledResult.total_score}</div>
          </div>
          <div class="summary-box">
            <div class="summary-label">Average</div>
            <div class="summary-value">${compiledResult.average}%</div>
          </div>
          <div class="summary-box">
            <div class="summary-label">Position</div>
            <div class="summary-value">${compiledResult.position}/${compiledResult.total_students}</div>
          </div>
          <div class="summary-box">
            <div class="summary-label">Attendance</div>
            <div class="summary-value">${compiledResult.times_present}/${compiledResult.times_present + compiledResult.times_absent}</div>
          </div>
        </div>
        
        <!-- Affective Domain -->
        ${affective && affective.length > 0 ? `
        <div class="traits-section">
          <div class="traits-title">AFFECTIVE DOMAIN</div>
          <table class="traits-table">
            ${affective.map(trait => `
              <tr>
                <td>${trait.attribute}</td>
                <td class="rating">${trait.score}/5</td>
                <td>${trait.remark || ''}</td>
              </tr>
            `).join('')}
          </table>
        </div>
        ` : ''}
        
        <!-- Psychomotor Domain -->
        ${psychomotor && psychomotor.length > 0 ? `
        <div class="traits-section">
          <div class="traits-title">PSYCHOMOTOR DOMAIN</div>
          <table class="traits-table">
            ${psychomotor.map(trait => `
              <tr>
                <td>${trait.attribute}</td>
                <td class="rating">${trait.score}/5</td>
                <td>${trait.remark || ''}</td>
              </tr>
            `).join('')}
          </table>
        </div>
        ` : ''}
        
        <!-- Comments -->
        <div class="comments-section">
          ${compiledResult.class_teacher_comment ? `
          <div class="comment-box">
            <div class="comment-label">Class Teacher's Comment:</div>
            <div>${compiledResult.class_teacher_comment}</div>
          </div>
          ` : ''}
          
          ${compiledResult.principal_comment ? `
          <div class="comment-box">
            <div class="comment-label">Principal's Comment:</div>
            <div>${compiledResult.principal_comment}</div>
          </div>
          ` : ''}
        </div>
        
        <!-- Signatures -->
        <div class="signature-section">
          <div class="signature-box">
            <div class="signature-line">Class Teacher</div>
          </div>
          <div class="signature-box">
            <div class="signature-line">Principal</div>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="text-align: center; margin-top: 30px; font-size: 10px; color: #7f8c8d;">
          Generated on ${new Date().toLocaleDateString()} | ${school.name || 'Graceland Royal Academy'}
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = {
  generateResultPDF,
  generateResultHTML
};
