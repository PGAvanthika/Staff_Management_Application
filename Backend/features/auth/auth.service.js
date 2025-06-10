const db = require('../../config/db');
const bcrypt = require("bcrypt");

exports.verifyUser = async (email, password) => {
  const users = await db`SELECT * FROM users WHERE email = ${email}`;
  
  if (users.length === 0) {
    const error = new Error("Invalid credentials");
    error.code = "INVALID_CREDENTIALS";
    throw error;
  }

  const user = users[0];
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    await exports.logLoginAttempt(user.id, "login", "fail");
    const error = new Error("Invalid credentials");
    error.code = "INVALID_CREDENTIALS";
    throw error;
  }

  return user;
};

exports.logLoginAttempt = async (empId, logType, status) => {
  if (!empId) return;

  const now = new Date();
  const time = now.toTimeString().split(" ")[0];
  const date = now.toISOString().split("T")[0];

  try {
    await db`
      INSERT INTO login_logs (emp_id, log_type, status, time, date)
      VALUES (${empId}, ${logType}, ${status}, ${time}, ${date});
    `;
  } catch (err) {
    console.error("Log write failed:", err.message);
  }
};
