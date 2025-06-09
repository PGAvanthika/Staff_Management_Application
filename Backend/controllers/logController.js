const logService = require("../services/logService");

exports.getLoginLogDates = async (req, res) => {
  try {
    const dates = await logService.fetchLoginLogDates();
    res.status(200).json(dates);
  } catch (err) {
    console.error("Error fetching login log dates:", err.message);
    res.status(500).json({ message: "Failed to fetch login log dates" });
  }
};

exports.getLoginLogsByDate = async (req, res) => {
  const { date } = req.params;
  try {
    const logs = await logService.fetchLoginLogsByDate(date);
    res.status(200).json(logs);
  } catch (err) {
    console.error("Error fetching login logs:", err.message);
    res.status(500).json({ message: "Failed to fetch login logs" });
  }
};

exports.getActivityLogDates = async (req, res) => {
  try {
    const dates = await logService.fetchActivityLogDates();
    res.status(200).json(dates);
  } catch (err) {
    console.error("Error fetching activity log dates:", err.message);
    res.status(500).json({ message: "Failed to fetch activity log dates" });
  }
};

exports.getActivityLogsByDate = async (req, res) => {
  const { date } = req.params;
  try {
    const logs = await logService.fetchActivityLogsByDate(date);
    res.status(200).json(logs);
  } catch (err) {
    console.error("Error fetching activity logs:", err.message);
    res.status(500).json({ message: "Failed to fetch activity logs" });
  }
};
