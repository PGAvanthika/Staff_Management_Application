const taskService = require('../services/taskService');

exports.createTask = async (req, res) => {
  try {
    const task = await taskService.createTask(req.body);
    res.status(201).json({
      message: "Task created successfully",
      task
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
};
