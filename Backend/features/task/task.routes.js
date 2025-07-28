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

// GET /api/tasks/kpi
router.get('/kpi', isLoggedIn, taskController.getUserKPI);

// GET /api/tasks/daily-performance
router.get('/daily-performance', isLoggedIn, taskController.getDailyPerformance);

// GET /api/tasks/monthly-progress
router.get('/monthly-progress', isLoggedIn, taskController.getMonthlyProgress);

// PUT /api/tasks/:task_id/complete
router.put('/:task_id/complete', isLoggedIn, taskController.completeTask);

// GET /api/tasks/history - Get completed task history for current user
router.get('/history', isLoggedIn, taskController.getCompletedTaskHistory);

// GET /api/tasks/manager/history - Get completed task history for manager (all employees)
router.get('/manager/history', isLoggedIn, isManager, taskController.getManagerCompletedTaskHistory);

module.exports = router;
