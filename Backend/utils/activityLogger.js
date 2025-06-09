const sql = require('../config/db');

const logActivity = async (empId, activity) => {
  if (!empId) return;
  const now = new Date();
  const time = now.toTimeString().split(" ")[0];
  const date = now.toISOString().split("T")[0];

  try {
    await sql`
      INSERT INTO activity_logs (emp_id, activity, time, date)
      VALUES (${empId}, ${activity}, ${time}, ${date})
    `;
  } catch (err) {
    console.error("Activity log insert failed:", err.message);
  }
};

module.exports = logActivity;
