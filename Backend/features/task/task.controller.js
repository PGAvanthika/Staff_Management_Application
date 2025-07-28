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

    if (error.code === 'DUPLICATE') {
      return res.status(409).json({ message: error.message });
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

// Get tasks assigned to a team leader
exports.getTasksByTeamLeader = async (req, res) => {
  try {
    const teamLeaderId = req.user.userId;
    const tasks = await taskService.getTasksByTeamLeader(teamLeaderId);
    res.json(tasks);
  } catch (error) {
    console.error('=== GET TEAM LEADER TASKS ERROR ===', error);
    res.status(500).json({ message: 'Database error while fetching tasks', error: error.message });
  }
};

// Get tasks assigned to an employee
exports.getTasksByEmployee = async (req, res) => {
  try {
    const employeeId = req.user.userId;
    const tasks = await taskService.getTasksByEmployee(employeeId);
    res.json(tasks);
  } catch (error) {
    console.error('=== GET EMPLOYEE TASKS ERROR ===', error);
    res.status(500).json({ message: 'Database error while fetching tasks', error: error.message });
  }
};

// Get KPI data for the current user
exports.getUserKPI = async (req, res) => {
  try {
    console.log('=== KPI ENDPOINT CALLED ===');
    console.log('User ID:', req.user?.userId);
    console.log('User Role:', req.user?.role);
    
    const userId = req.user.userId;
    console.log('Fetching KPI data for user:', userId);
    
    const kpiData = await taskService.calculateUserKPI(userId);
    console.log('KPI Data retrieved:', kpiData);
    
    res.json(kpiData);
  } catch (error) {
    console.error('=== GET USER KPI ERROR ===', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Database error while fetching KPI data', error: error.message });
  }
};

// Get daily performance data for the current user
exports.getDailyPerformance = async (req, res) => {
  try {
    const userId = req.user.userId;
    const dailyData = await taskService.getDailyPerformance(userId);
    res.json(dailyData);
  } catch (error) {
    console.error('=== GET DAILY PERFORMANCE ERROR ===', error);
    res.status(500).json({ message: 'Database error while fetching daily performance', error: error.message });
  }
};

// Get monthly progress data for the current user
exports.getMonthlyProgress = async (req, res) => {
  try {
    const userId = req.user.userId;
    const monthlyData = await taskService.getMonthlyProgress(userId);
    res.json(monthlyData);
  } catch (error) {
    console.error('=== GET MONTHLY PROGRESS ERROR ===', error);
    res.status(500).json({ message: 'Database error while fetching monthly progress', error: error.message });
  }
};

// Complete a task
exports.completeTask = async (req, res) => {
  try {
    const { task_id } = req.params;
    const employeeId = req.user.userId;
    
    console.log('=== COMPLETING TASK ===');
    console.log('Task ID:', task_id);
    console.log('Employee ID:', employeeId);
    
    const completedTask = await taskService.completeTask(task_id, employeeId);
    
    if (!completedTask) {
      return res.status(404).json({ message: 'Task not found or unauthorized' });
    }
    
    console.log('Task completed successfully:', completedTask);
    res.json({ 
      message: 'Task completed successfully', 
      task: completedTask,
      penaltyApplied: completedTask.penaltyApplied,
      completedOnTime: completedTask.completedOnTime
    });
  } catch (error) {
    console.error('=== COMPLETE TASK ERROR ===', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      code: error.code
    });
    res.status(500).json({ message: 'Database error while completing task', error: error.message });
  }
};

// Get completed task history for the current user for a given month
exports.getCompletedTaskHistory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const year = parseInt(req.query.year, 10);
    const month = parseInt(req.query.month, 10);
    
    if (!year || !month) {
      return res.status(400).json({ error: 'Year and month are required' });
    }
    
    console.log('=== GETTING COMPLETED TASK HISTORY ===');
    console.log('User ID:', userId);
    console.log('Year:', year);
    console.log('Month:', month);
    
    const history = await taskService.getCompletedTaskHistory(userId, year, month);
    res.json(history);
  } catch (error) {
    console.error('=== COMPLETED TASK HISTORY ERROR ===', error);
    res.status(500).json({ message: 'Database error while fetching task history', error: error.message });
  }
};

// Get completed task history for a manager (all employees)
exports.getManagerCompletedTaskHistory = async (req, res) => {
  try {
    const managerId = req.user.userId;
    const year = parseInt(req.query.year, 10);
    const month = parseInt(req.query.month, 10);
    
    if (!year || !month) {
      return res.status(400).json({ error: 'Year and month are required' });
    }
    
    console.log('=== GETTING MANAGER COMPLETED TASK HISTORY ===');
    console.log('Manager ID:', managerId);
    console.log('Year:', year);
    console.log('Month:', month);
    
    const history = await taskService.getManagerCompletedTaskHistory(managerId, year, month);
    res.json(history);
  } catch (error) {
    console.error('=== MANAGER COMPLETED TASK HISTORY ERROR ===', error);
    res.status(500).json({ message: 'Database error while fetching manager task history', error: error.message });
  }
};
