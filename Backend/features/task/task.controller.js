const taskService = require('./task.service');

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

exports.updateTask = async (req, res) => {
  try {
    const updatedTask = await taskService.updateTask(req.params.id, req.body);
    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task updated successfully', task: updatedTask });
  } catch (error) {
    console.error('=== TASK UPDATE ERROR ===', error);
    res.status(500).json({ message: 'Database error while updating task', error: error.message });
  }
};
