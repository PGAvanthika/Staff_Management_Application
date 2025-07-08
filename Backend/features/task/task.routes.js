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

// GET /api/tasks/employee
router.get('/employee', isLoggedIn, taskController.getTasksByEmployee);

module.exports = router;
