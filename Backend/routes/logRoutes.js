const express = require("express");
const router = express.Router();
const logController = require("../controllers/logController");

// Login Logs
router.get("/login-logs/dates", logController.getLoginLogDates);
router.get("/login-logs/:date", logController.getLoginLogsByDate);

// Activity Logs
router.get("/activity-logs/dates", logController.getActivityLogDates);
router.get("/activity-logs/:date", logController.getActivityLogsByDate);

module.exports = router;
