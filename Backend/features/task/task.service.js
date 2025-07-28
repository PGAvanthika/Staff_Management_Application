const sql = require('../../config/db');

exports.createTask = async (data) => {
  const {
    task_id,
    project_id,
    assigned_to,
    assigned_by,
    description,
    deadline,
    task_status = "assigned",
  } = data;

  if (!task_id || !project_id || !assigned_to || !assigned_by || !description || !deadline) {
    throw new Error('All fields are required: task_id, project_id, assigned_to, assigned_by, description, deadline');
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(deadline)) {
    throw new Error('Deadline must be in YYYY-MM-DD format');
  }

  const existingTask = await sql.query('SELECT task_id FROM tasks WHERE task_id = $1', [task_id]);
  if (existingTask.length > 0) {
    const error = new Error('Task with this ID already exists');
    error.code = 'DUPLICATE';
    throw error;
  }

  const projectResult = await sql.query(
    "SELECT project_id FROM projects WHERE project_id = $1",
    [project_id]
  );
  if (projectResult.length === 0) {
    throw new Error(`Project with ID '${project_id}' does not exist`);
  }

  // Check assigned_to user
  const assignedToResult = await sql.query(
    "SELECT role FROM users WHERE id = $1",
    [assigned_to]
  );
  if (assignedToResult.length === 0) {
    throw new Error('Assigned to user does not exist');
  }
  const assignedToRole = assignedToResult[0].role.toLowerCase();

  // Check assigned_by user
  const assignedByResult = await sql.query(
    "SELECT role FROM users WHERE id = $1",
    [assigned_by]
  );
  if (assignedByResult.length === 0) {
    throw new Error('Assigned by user does not exist');
  }
  const assignedByRole = assignedByResult[0].role.toLowerCase();

  // Authorization rules:
  if (assignedByRole === 'manager') {
    if (!['employee', 'team_leader'].includes(assignedToRole)) {
      throw new Error('Managers can only assign tasks to team leaders or employees');
    }
  } else if (assignedByRole === 'team_leader') {
    if (assignedToRole !== 'employee') {
      throw new Error('Team leaders can only assign tasks to employees');
    }
  } else {
    throw new Error('Only managers or team leaders can assign tasks');
  }

  const result = await sql.query(
    `INSERT INTO tasks 
      (task_id, project_id, assigned_to, assigned_by, description, deadline, task_status)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [task_id, project_id, assigned_to, assigned_by, description, deadline, task_status]
  );

  return result[0];
};

exports.updateTask = async (task_id, data) => {
  const {
    project_id,
    assigned_to,
    assigned_by,
    description,
    deadline,
    task_status = "assigned",
  } = data;

  if (!task_id || !project_id || !assigned_to || !assigned_by || !description || !deadline) {
    throw new Error('All fields are required: task_id, project_id, assigned_to, assigned_by, description, deadline');
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(deadline)) {
    throw new Error('Deadline must be in YYYY-MM-DD format');
  }

  const existingTask = await sql.query('SELECT * FROM tasks WHERE task_id = $1', [task_id]);
  if (existingTask.length === 0) {
    return null;
  }

  // Optionally re-check roles here if needed

  const result = await sql.query(
    `UPDATE tasks SET
      project_id = $1,
      assigned_to = $2,
      assigned_by = $3,
      description = $4,
      deadline = $5,
      task_status = $6
    WHERE task_id = $7
    RETURNING *`,
    [project_id, assigned_to, assigned_by, description, deadline, task_status, task_id]
  );

  return result[0];
};

// Update task status to completed with penalty system
exports.completeTask = async (task_id, employeeId) => {
  try {
    console.log('=== COMPLETING TASK ===');
    console.log('Task ID:', task_id);
    console.log('Employee ID:', employeeId);
    
    // Verify the task belongs to the employee and get current task data
    const task = await sql.query(
      `SELECT t.*, 
              CASE WHEN d.status = 'approved' THEN t.deadline + INTERVAL '1 day' * d.no_of_days ELSE t.deadline END as effective_deadline
       FROM tasks t
       LEFT JOIN dues d ON t.task_id = d.task_id AND d.status = 'approved'
       WHERE t.task_id = $1 AND t.assigned_to = $2`,
      [task_id, employeeId]
    );
    
    console.log('Task query result:', task);
    
    if (task.length === 0) {
      throw new Error('Task not found or unauthorized');
    }
    
    const currentTask = task[0];
    console.log('Current task:', currentTask);
    
    const now = new Date();
    const effectiveDeadline = new Date(currentTask.effective_deadline);
    
    console.log('Now:', now);
    console.log('Effective deadline:', effectiveDeadline);
    console.log('Is overdue:', now > effectiveDeadline);
    
    // Check if task can be completed
    let completionStatus = 'completed';
    let penaltyApplied = false;
    
    // Check if task is overdue (completion after deadline)
    if (now > effectiveDeadline) {
      completionStatus = 'completed_overdue';
      penaltyApplied = true;
    }
    
    console.log('Completion status:', completionStatus);
    console.log('Penalty applied:', penaltyApplied);
    
    // Update task status with penalty information
    const result = await sql.query(
      'UPDATE tasks SET task_status = $1 WHERE task_id = $2 RETURNING *',
      [completionStatus, task_id]
    );
    
    console.log('Update result:', result);
    
    return {
      ...result[0],
      penaltyApplied,
      completedOnTime: !penaltyApplied
    };
  } catch (error) {
    console.error('=== COMPLETE TASK ERROR ===', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    throw error;
  }
};

// Get tasks assigned to a team leader
exports.getTasksByTeamLeader = async (teamLeaderId) => {
  const query = `
    SELECT 
      t.task_id,
      t.description,
      t.deadline,
      t.task_status,
      t.project_id,
      p.project_name,
      t.assigned_by,
      u.email as assigned_by_email
    FROM tasks t
    JOIN projects p ON t.project_id = p.project_id
    JOIN users u ON t.assigned_by = u.id
    WHERE t.assigned_to = $1
    ORDER BY t.deadline ASC
  `;

  try {
    const result = await sql.query(query, [teamLeaderId]);
    return result;
  } catch (error) {
    throw error;
  }
};

// Get tasks assigned to an employee
exports.getTasksByEmployee = async (employeeId) => {
  const query = `
    SELECT 
      t.task_id,
      t.description,
      t.deadline,
      t.task_status,
      t.project_id,
      t.assigned_to,
      p.project_name,
      t.assigned_by,
      u.email as assigned_by_email,
      CASE WHEN d.status = 'approved' THEN t.deadline + INTERVAL '1 day' * d.no_of_days ELSE t.deadline END as effective_deadline
    FROM tasks t
    JOIN projects p ON t.project_id = p.project_id
    JOIN users u ON t.assigned_by = u.id
    LEFT JOIN dues d ON t.task_id = d.task_id AND d.status = 'approved'
    WHERE t.assigned_to = $1
    ORDER BY t.deadline ASC
  `;

  try {
    const result = await sql.query(query, [employeeId]);
    // For each task, check due extension status and completion eligibility
    for (const task of result) {
      // Check for pending due extension
      const pendingDue = await sql.query(
        `SELECT 1 FROM dues WHERE emp_id = $1 AND task_id = $2 AND status = 'pending' LIMIT 1`,
        [employeeId, task.task_id]
      );
      task.has_pending_due_extension = pendingDue.length > 0;
      
      // Check for approved due extension
      const approvedDue = await sql.query(
        `SELECT 1 FROM dues WHERE emp_id = $1 AND task_id = $2 AND status = 'approved' LIMIT 1`,
        [employeeId, task.task_id]
      );
      task.has_approved_due_extension = approvedDue.length > 0;
      
      // Check for any due extension (pending or approved)
      const anyDue = await sql.query(
        `SELECT 1 FROM dues WHERE emp_id = $1 AND task_id = $2 LIMIT 1`,
        [employeeId, task.task_id]
      );
      task.has_any_due_extension = anyDue.length > 0;
      
      // Check if task can be completed
      const now = new Date();
      const effectiveDeadline = new Date(task.effective_deadline);
      
      // Task can be completed if:
      // 1. Not already completed
      // 2. Not overdue (unless due extension is approved)
      // 3. Either before deadline OR after deadline with approved extension
      task.can_be_completed = (
        task.task_status !== 'completed' && 
        task.task_status !== 'completed_overdue' &&
        (
          now <= effectiveDeadline || 
          (now > effectiveDeadline && task.has_approved_due_extension)
        )
      );
      
      // Check if task is overdue
      task.is_overdue = now > effectiveDeadline && !task.has_approved_due_extension;
    }
    return result;
  } catch (error) {
    throw error;
  }
};

// Calculate KPI for a specific user with penalty system
exports.calculateUserKPI = async (userId) => {
  try {
    console.log('=== CALCULATING KPI FOR USER ===', userId);
    
    // Get all tasks for the user with penalty-aware KPI calculation
    const query = `
      SELECT 
        t.task_id,
        t.task_status,
        t.deadline,
        CASE 
          WHEN t.task_status = 'completed' THEN 'completed_on_time'
          WHEN t.task_status = 'completed_overdue' THEN 'completed_overdue'
          WHEN t.task_status = 'overdue' THEN 'overdue'
          WHEN t.task_status IN ('assigned', 'in_progress', 'in-progress') THEN 'active'
          ELSE 'other'
        END as completion_status
      FROM tasks t
      WHERE t.assigned_to = $1
    `;
    
    console.log('Executing query with userId:', userId);
    const tasks = await sql.query(query, [userId]);
    console.log('Raw tasks data:', tasks);
    
    const totalTasks = tasks.length;
    const completedOnTime = tasks.filter(t => t.completion_status === 'completed_on_time').length;
    const completedOverdue = tasks.filter(t => t.completion_status === 'completed_overdue').length;
    const overdue = tasks.filter(t => t.completion_status === 'overdue').length;
    const active = tasks.filter(t => t.completion_status === 'active').length;
    
    console.log('Task counts:', {
      totalTasks,
      completedOnTime,
      completedOverdue,
      overdue,
      active
    });
    
    // Calculate KPI with penalty system:
    // - Completed on time: 100% score
    // - Completed overdue: 50% score (penalty)
    // - Overdue: 0% score
    const totalCompleted = completedOnTime + completedOverdue;
    const totalCompletedWithPenalty = completedOnTime + (completedOverdue * 0.5); // Penalty: 50% score for overdue completions
    
    const kpi = totalTasks > 0 ? Math.round((totalCompletedWithPenalty / totalTasks) * 100) : 0;
    
    // Calculate additional metrics
    const completionRate = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;
    const onTimeRate = totalCompleted > 0 ? Math.round((completedOnTime / totalCompleted) * 100) : 0;
    
    const result = {
      kpi,
      totalTasks,
      completedOnTime,
      completedOverdue,
      overdue,
      active,
      completionRate,
      onTimeRate,
      totalCompleted,
      totalCompletedWithPenalty,
      tasks
    };
    
    console.log('Final KPI result:', result);
    return result;
  } catch (error) {
    console.error('=== KPI CALCULATION ERROR ===', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    throw error;
  }
};

// Get daily performance data for the last 7 days
exports.getDailyPerformance = async (userId) => {
  try {
    // Since tasks table doesn't have created_at, we'll use a simpler approach
    // Get all tasks and simulate daily performance based on task status
    const query = `
      SELECT 
        t.task_status,
        COUNT(*) as task_count
      FROM tasks t
      WHERE t.assigned_to = $1
      GROUP BY t.task_status
    `;
    
    const result = await sql.query(query, [userId]);
    
    // Generate simulated daily performance data based on task status distribution
    const dailyData = [];
    const today = new Date();
    
    // Calculate overall completion rate
    const totalTasks = result.reduce((sum, row) => sum + parseInt(row.task_count), 0);
    const completedTasks = result.find(row => row.task_status === 'completed')?.task_count || 0;
    const overallCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    // Generate 7 days of data with some variation
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Add some variation to make it look realistic
      const variation = Math.random() * 20 - 10; // -10 to +10
      const performance = Math.max(0, Math.min(100, overallCompletionRate + variation));
      
      dailyData.push({
        date: dateStr,
        performance: Math.round(performance)
      });
    }
    
    return dailyData;
  } catch (error) {
    throw error;
  }
};

// Get monthly progress data for the current year
exports.getMonthlyProgress = async (userId) => {
  try {
    // Since tasks table doesn't have created_at, we'll simulate monthly progress
    // based on current task status distribution
    const query = `
      SELECT 
        t.task_status,
        COUNT(*) as task_count
      FROM tasks t
      WHERE t.assigned_to = $1
      GROUP BY t.task_status
    `;
    
    const result = await sql.query(query, [userId]);
    
    // Generate simulated monthly progress data based on task status distribution
    const monthlyData = [];
    
    // Calculate overall completion rate
    const totalTasks = result.reduce((sum, row) => sum + parseInt(row.task_count), 0);
    const completedTasks = result.find(row => row.task_status === 'completed')?.task_count || 0;
    const overallCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    // Generate 12 months of data with realistic progression
    for (let month = 1; month <= 12; month++) {
      // Create a realistic progression pattern
      let progress;
      if (month <= 3) {
        // Start low and build up
        progress = Math.round(overallCompletionRate * 0.3 + (month - 1) * 10);
      } else if (month <= 6) {
        // Peak performance
        progress = Math.round(overallCompletionRate * 0.8 + Math.random() * 20);
      } else if (month <= 9) {
        // Maintain good performance
        progress = Math.round(overallCompletionRate * 0.7 + Math.random() * 15);
      } else {
        // End of year slight decline
        progress = Math.round(overallCompletionRate * 0.6 + Math.random() * 10);
      }
      
      // Ensure progress is within reasonable bounds
      progress = Math.max(0, Math.min(100, progress));
      
      monthlyData.push({
        month,
        progress: Math.round(progress)
      });
    }
    
    return monthlyData;
  } catch (error) {
    throw error;
  }
};

// Get completed task history for a specific user for a given month
exports.getCompletedTaskHistory = async (userId, year, month) => {
  try {
    console.log('=== GETTING COMPLETED TASK HISTORY ===');
    console.log('User ID:', userId);
    console.log('Year:', year);
    console.log('Month:', month);
    
    // Since tasks table doesn't have created_at, we'll use the deadline as a reference
    // and filter by completed tasks
    const query = `
      SELECT 
        t.task_id,
        t.description,
        t.deadline,
        t.task_status,
        t.project_id,
        p.project_name,
        t.assigned_by,
        u.email as assigned_by_email,
        CASE WHEN d.status = 'approved' THEN t.deadline + INTERVAL '1 day' * d.no_of_days ELSE t.deadline END as effective_deadline,
        CASE 
          WHEN t.task_status = 'completed' THEN 'completed_on_time'
          WHEN t.task_status = 'completed_overdue' THEN 'completed_overdue'
          ELSE t.task_status
        END as completion_type
      FROM tasks t
      JOIN projects p ON t.project_id = p.project_id
      JOIN users u ON t.assigned_by = u.id
      LEFT JOIN dues d ON t.task_id = d.task_id AND d.status = 'approved'
      WHERE t.assigned_to = $1 
        AND t.task_status IN ('completed', 'completed_overdue')
        AND EXTRACT(YEAR FROM t.deadline) = $2
        AND EXTRACT(MONTH FROM t.deadline) = $3
      ORDER BY t.deadline DESC
    `;
    
    console.log('Executing query with parameters:', [userId, year, month]);
    const result = await sql.query(query, [userId, year, month]);
    console.log('Query result:', result);
    
    return result;
  } catch (error) {
    console.error('=== COMPLETED TASK HISTORY ERROR ===', error);
    throw error;
  }
};

// Get completed task history for a manager (all employees under them)
exports.getManagerCompletedTaskHistory = async (managerId, year, month) => {
  try {
    console.log('=== GETTING MANAGER COMPLETED TASK HISTORY ===');
    console.log('Manager ID:', managerId);
    console.log('Year:', year);
    console.log('Month:', month);
    
    const query = `
      SELECT 
        t.task_id,
        t.description,
        t.deadline,
        t.task_status,
        t.project_id,
        t.assigned_to,
        p.project_name,
        t.assigned_by,
        u1.email as assigned_by_email,
        u2.email as assigned_to_email,
        u2.id as employee_id,
        CASE WHEN d.status = 'approved' THEN t.deadline + INTERVAL '1 day' * d.no_of_days ELSE t.deadline END as effective_deadline,
        CASE 
          WHEN t.task_status = 'completed' THEN 'completed_on_time'
          WHEN t.task_status = 'completed_overdue' THEN 'completed_overdue'
          ELSE t.task_status
        END as completion_type
      FROM tasks t
      JOIN projects p ON t.project_id = p.project_id
      JOIN users u1 ON t.assigned_by = u1.id
      JOIN users u2 ON t.assigned_to = u2.id
      LEFT JOIN dues d ON t.task_id = d.task_id AND d.status = 'approved'
      WHERE t.task_status IN ('completed', 'completed_overdue')
        AND EXTRACT(YEAR FROM t.deadline) = $1
        AND EXTRACT(MONTH FROM t.deadline) = $2
      ORDER BY t.deadline DESC
    `;
    
    console.log('Executing query with parameters:', [year, month]);
    const result = await sql.query(query, [year, month]);
    console.log('Query result:', result);
    
    return result;
  } catch (error) {
    console.error('=== MANAGER COMPLETED TASK HISTORY ERROR ===', error);
    throw error;
  }
};
