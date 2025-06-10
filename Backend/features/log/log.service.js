const sql = require('../../config/db');

exports.fetchLoginLogDates = async () => {
  const result = await sql`
    SELECT DISTINCT date 
    FROM login_logs
    ORDER BY date DESC
  `;
  return result.map(row => row.date);
};

exports.fetchLoginLogsByDate = async (date) => {
  const result = await sql`
    SELECT emp_id, log_type, status, time
    FROM login_logs
    WHERE date = ${date}
    ORDER BY time DESC
  `;
  return result;
};

exports.fetchActivityLogDates = async () => {
  const result = await sql`
    SELECT DISTINCT date 
    FROM activity_logs
    ORDER BY date DESC
  `;
  return result.map(row => row.date);
};

exports.fetchActivityLogsByDate = async (date) => {
  const result = await sql`
    SELECT emp_id, activity, time
    FROM activity_logs
    WHERE date = ${date}
    ORDER BY time DESC
  `;
  return result;
};
