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

  const assignedToUser = await sql.query(
    "SELECT role FROM users WHERE id = $1",
    [assigned_to]
  );
  if (assignedToUser.length === 0) {
    throw new Error('Assigned to user does not exist');
  }
  if (assignedToUser[0].role !== 'employee') {
    throw new Error('Tasks can only be assigned to employees');
  }

  const assignedByUser = await sql.query(
    "SELECT role FROM users WHERE id = $1",
    [assigned_by]
  );
  if (assignedByUser.length === 0) {
    throw new Error('Assigned by user does not exist');
  }
  if (!['Manager', 'team_leader'].includes(assignedByUser[0].role)) {
    throw new Error('Only Managers or Team Leaders can assign tasks');
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
