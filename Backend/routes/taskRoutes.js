const express = require("express");
const router = express.Router();
const { isLoggedIn, isManager } = require('../middlewares/authMiddleware');
const taskController = require('../controllers/taskController');

// POST /api/tasks
router.post("/", isLoggedIn, isManager, taskController.createTask);

module.exports = router;
