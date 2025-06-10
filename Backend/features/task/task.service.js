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

  const result = await sql.query(
    `INSERT INTO tasks 
      (task_id, project_id, assigned_to, assigned_by, description, deadline, task_status)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [task_id, project_id, assigned_to, assigned_by, description, deadline, task_status]
  );

  return result[0];
};
