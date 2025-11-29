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

  // Allow both plain dates and ISO strings as long as they are valid dates
  const parsedDeadline = new Date(deadline);
  if (isNaN(parsedDeadline.getTime())) {
    throw new Error('Deadline must be a valid date');
  }

  const existingTask = await sql`
    SELECT task_id FROM tasks WHERE task_id = ${task_id}
  `;
  if (existingTask.length > 0) {
    const error = new Error('Task with this ID already exists');
    error.code = 'DUPLICATE';
    throw error;
  }

  const projectResult = await sql`
    SELECT project_id FROM projects WHERE project_id = ${project_id}
  `;
  if (projectResult.length === 0) {
    throw new Error(`Project with ID '${project_id}' does not exist`);
  }

  // Check assigned_to user
  const assignedToResult = await sql`
    SELECT role FROM users WHERE id = ${assigned_to}
  `;
  if (assignedToResult.length === 0) {
    throw new Error('Assigned to user does not exist');
  }
  const assignedToRole = assignedToResult[0].role.toLowerCase();

  // Check assigned_by user
  const assignedByResult = await sql`
    SELECT role FROM users WHERE id = ${assigned_by}
  `;
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

  const result = await sql`
    INSERT INTO tasks 
      (task_id, project_id, assigned_to, assigned_by, description, deadline, task_status)
    VALUES (${task_id}, ${project_id}, ${assigned_to}, ${assigned_by}, ${description}, ${deadline}, ${task_status})
    RETURNING *
  `;

  return result[0];
};

exports.updateTask = async (task_id, data) => {
  if (!task_id) {
    throw new Error('Task ID is required');
  }

  // If only status is being updated, do a lightweight update
  if (data && Object.keys(data).length === 1 && data.task_status) {
    const statusResult = await sql`
      UPDATE tasks 
      SET task_status = ${data.task_status}
      WHERE task_id = ${task_id}
      RETURNING *
    `;
    return statusResult[0] || null;
  }

  const {
    project_id,
    assigned_to,
    assigned_by,
    description,
    deadline,
    task_status = "assigned",
  } = data;

  if (!project_id || !assigned_to || !assigned_by || !description || !deadline) {
    throw new Error('All fields are required: project_id, assigned_to, assigned_by, description, deadline');
  }

  const parsedDeadline = new Date(deadline);
  if (isNaN(parsedDeadline.getTime())) {
    throw new Error('Deadline must be a valid date');
  }

  const existingTask = await sql`
    SELECT * FROM tasks WHERE task_id = ${task_id}
  `;
  if (existingTask.length === 0) {
    return null;
  }

  const result = await sql`
    UPDATE tasks SET
      project_id = ${project_id},
      assigned_to = ${assigned_to},
      assigned_by = ${assigned_by},
      description = ${description},
      deadline = ${deadline},
      task_status = ${task_status}
    WHERE task_id = ${task_id}
    RETURNING *
  `;

  return result[0];
};

// Get tasks assigned to a team leader
exports.getTasksByTeamLeader = async (teamLeaderId) => {
  try {
    const result = await sql`
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
      WHERE t.assigned_to = ${teamLeaderId}
      ORDER BY t.deadline ASC
    `;
    return result;
  } catch (error) {
    throw error;
  }
};

// Get tasks assigned to an employee
exports.getTasksByEmployee = async (employeeId) => {
  try {
    const result = await sql`
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
      WHERE t.assigned_to = ${employeeId}
      ORDER BY t.deadline ASC
    `;
    // For each task, check if there is a pending due extension
    for (const task of result) {
      const due = await sql`
        SELECT 1 FROM dues WHERE emp_id = ${employeeId} AND task_id = ${task.task_id} AND status = 'pending' LIMIT 1
      `;
      task.has_pending_due_extension = due.length > 0;
    }
    return result;
  } catch (error) {
    throw error;
  }
};
