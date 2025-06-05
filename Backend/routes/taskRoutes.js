const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { isLoggedIn, isManager } = require('../middlewares/authMiddleware');
// POST /api/tasks - Create new task
router.post("/", async (req, res) => {
  try {
    const {
      task_id,
      project_id,
      assigned_to,
      assigned_by,
      description,
      deadline,
      task_status = "assigned",
    } = req.body;

    if (!task_id || !project_id || !assigned_to || !assigned_by || !description || !deadline) {
      return res.status(400).json({
        message: 'All fields are required: task_id, project_id, assigned_to, assigned_by, description, deadline'
      });
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(deadline)) {
      return res.status(400).json({ message: 'Deadline must be in YYYY-MM-DD format' });
    }

    // Adjusted for your db returning an array directly
    const existingTask = await db.query('SELECT task_id FROM tasks WHERE task_id = $1', [task_id]);
    if (existingTask.length > 0) {
      return res.status(409).json({ message: 'Task with this ID already exists' });
    }

    const projectResult = await db.query(
      "SELECT project_id FROM projects WHERE project_id = $1",
      [project_id]
    );
    if (projectResult.length === 0) {
      return res.status(400).json({ message: `Project with ID '${project_id}' does not exist` });
    }

    const result = await db.query(
      `INSERT INTO tasks 
        (task_id, project_id, assigned_to, assigned_by, description, deadline, task_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [task_id, project_id, assigned_to, assigned_by, description, deadline, task_status]
    );

    // For insert, assuming result is also array
    res.status(201).json({
      message: "Task created successfully",
      task: result[0]
    });
  } catch (error) {
    console.error("=== TASK CREATION ERROR ===", error);

    if (error.code === '23503') {
      if (error.constraint === 'tasks_project_id_fkey') {
        return res.status(400).json({ message: 'Invalid project ID' });
      }
      if (error.constraint === 'tasks_assigned_to_fkey') {
        return res.status(400).json({ message: 'Invalid assigned_to user' });
      }
      if (error.constraint === 'tasks_assigned_by_fkey') {
        return res.status(400).json({ message: 'Invalid assigned_by user' });
      }
    }

    res.status(500).json({
      message: "Database error while creating task",
      error: error.message
    });
  }
});


module.exports = router;
