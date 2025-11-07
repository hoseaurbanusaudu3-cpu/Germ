/**
 * Calculate grade based on total score
 * @param {number} total - Total score
 * @returns {string} Grade letter
 */
const calculateGrade = (total) => {
  if (total >= 80) return 'A';
  if (total >= 70) return 'B';
  if (total >= 60) return 'C';
  if (total >= 50) return 'D';
  if (total >= 40) return 'E';
  return 'F';
};

/**
 * Get remark based on grade
 * @param {string} grade - Grade letter
 * @returns {string} Remark
 */
const getGradeRemark = (grade) => {
  const remarks = {
    'A': 'Excellent',
    'B': 'Very Good',
    'C': 'Good',
    'D': 'Fair',
    'E': 'Pass',
    'F': 'Fail'
  };
  return remarks[grade] || 'N/A';
};

/**
 * Calculate class statistics for a set of scores
 * @param {Array<number>} totals - Array of total scores
 * @returns {object} Statistics object
 */
const calculateClassStats = (totals) => {
  if (!totals || totals.length === 0) {
    return {
      average: 0,
      min: 0,
      max: 0
    };
  }

  const sum = totals.reduce((acc, val) => acc + val, 0);
  const average = sum / totals.length;
  const min = Math.min(...totals);
  const max = Math.max(...totals);

  return {
    average: parseFloat(average.toFixed(2)),
    min: parseFloat(min.toFixed(2)),
    max: parseFloat(max.toFixed(2))
  };
};

/**
 * Validate score components
 * @param {number} ca1 - CA1 score
 * @param {number} ca2 - CA2 score
 * @param {number} exam - Exam score
 * @returns {object} Validation result
 */
const validateScores = (ca1, ca2, exam) => {
  const errors = [];

  if (ca1 < 0 || ca1 > 20) {
    errors.push('CA1 must be between 0 and 20');
  }

  if (ca2 < 0 || ca2 > 20) {
    errors.push('CA2 must be between 0 and 20');
  }

  if (exam < 0 || exam > 60) {
    errors.push('Exam must be between 0 and 60');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Calculate promotion status based on average
 * @param {number} average - Student's average score
 * @returns {string} Promotion status
 */
const calculatePromotionStatus = (average) => {
  if (average >= 70) return 'Promoted';
  if (average >= 50) return 'Trial Promotion';
  return 'Repeat';
};

module.exports = {
  calculateGrade,
  getGradeRemark,
  calculateClassStats,
  validateScores,
  calculatePromotionStatus
};
