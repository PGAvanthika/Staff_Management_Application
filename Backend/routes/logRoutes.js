// routes/logRoutes.js
const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Get distinct dates for login logs
router.get("/login-logs/dates", async (req, res) => {
  try {
    const dates = await db`
      SELECT DISTINCT date 
      FROM login_logs
      ORDER BY date DESC
    `;
    res.status(200).json(dates.map(row => row.date));
  } catch (err) {
    console.error("Error fetching login log dates:", err.message);
    res.status(500).json({ message: "Failed to fetch login log dates" });
  }
});

// Get login logs by date
router.get("/login-logs/:date", async (req, res) => {
  const { date } = req.params;
  try {
    const logs = await db`
      SELECT emp_id, log_type, status, time
      FROM login_logs
      WHERE date = ${date}
      ORDER BY time DESC
    `;
    res.status(200).json(logs);
  } catch (err) {
    console.error("Error fetching login logs:", err.message);
    res.status(500).json({ message: "Failed to fetch login logs" });
  }
});

// Similarly, for activity logs (if applicable):

// Get distinct dates for activity logs
router.get("/activity-logs/dates", async (req, res) => {
  try {
    const dates = await db`
      SELECT DISTINCT date
      FROM activity_logs
      ORDER BY date DESC
    `;
    res.status(200).json(dates.map(row => row.date));
  } catch (err) {
    console.error("Error fetching activity log dates:", err.message);
    res.status(500).json({ message: "Failed to fetch activity log dates" });
  }
});

// Get activity logs by date
router.get("/activity-logs/:date", async (req, res) => {
  const { date } = req.params;
  try {
    const logs = await db`
      SELECT emp_id, activity, time
      FROM activity_logs
      WHERE date = ${date}
      ORDER BY time DESC
    `;
    res.status(200).json(logs);
  } catch (err) {
    console.error("Error fetching activity logs:", err.message);
    res.status(500).json({ message: "Failed to fetch activity logs" });
  }
});

module.exports = router;
