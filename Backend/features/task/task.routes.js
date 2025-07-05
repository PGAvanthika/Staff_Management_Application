const express = require("express");
const router = express.Router();
const { isLoggedIn } = require('../../middlewares/authMiddleware');
const taskController = require('./task.controller');

// POST /api/tasks
router.post("/", isLoggedIn, taskController.createTask);

// PUT /api/tasks/:id
router.put('/:id', isLoggedIn, taskController.updateTask);

// GET /api/tasks/teamleader
router.get('/teamleader', isLoggedIn, taskController.getTasksByTeamLeader);

module.exports = router;
