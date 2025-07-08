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
    const result = await sql.query(query, [employeeId]);
    // For each task, check if there is a pending due extension
    for (const task of result) {
      const due = await sql.query(
        `SELECT 1 FROM dues WHERE emp_id = $1 AND task_id = $2 AND status = 'pending' LIMIT 1`,
        [employeeId, task.task_id]
      );
      task.has_pending_due_extension = due.length > 0;
    }
    return result;
  } catch (error) {
    throw error;
  }
};
