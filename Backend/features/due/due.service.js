const sql = require('../../config/db');

exports.createDueExtension = async (data) => {
  console.log('=== DUE SERVICE - CREATE DUE EXTENSION ===');
  console.log('Input data:', data);
  
  const { emp_id, tl_id, project_id, task_id, to_manager, no_of_days, reason, due_date } = data;
  
  console.log('Executing SQL query with parameters:', [emp_id, tl_id, project_id, task_id, to_manager, no_of_days, reason, due_date]);
  
  const result = await sql.query(
    `INSERT INTO dues (emp_id, tl_id, project_id, task_id, to_manager, no_of_days, reason, due_date)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    [emp_id, tl_id, project_id, task_id, to_manager, no_of_days, reason, due_date]
  );
  
  console.log('SQL query result:', result);
  return result[0];
};

exports.getAllDueExtensions = async () => {
  return await sql`SELECT * FROM dues ORDER BY due_id DESC`;
};

exports.getDueExtensionById = async (id) => {
  const result = await sql`SELECT * FROM dues WHERE due_id = ${id}`;
  return result[0];
};

// Get all due extensions for a specific manager
exports.getDueExtensionsForManager = async (managerId) => {
  console.log('=== GETTING DUE EXTENSIONS FOR MANAGER ===', managerId);
  
  const result = await sql.query(
    `SELECT d.*, t.deadline as current_deadline, t.description as task_description, p.project_name, u1.email as employee_email, u2.email as team_leader_email
     FROM dues d
     JOIN tasks t ON d.task_id = t.task_id
     JOIN projects p ON d.project_id = p.project_id
     JOIN users u1 ON d.emp_id = u1.id
     JOIN users u2 ON d.tl_id = u2.id
     WHERE d.to_manager = $1 AND d.status IN ('pending', 'escalated', 'tl_approved')
     ORDER BY d.due_id DESC`,
    [managerId]
  );
  
  console.log('Due extensions result:', result);
  return result;
};

// Get all due extensions for a specific manager for a given month
exports.getDueExtensionsHistoryForManager = async (managerId, year, month) => {
  try {
    const result = await sql`
      SELECT d.*, t.deadline as current_deadline 
      FROM dues d
      JOIN tasks t ON d.task_id = t.task_id
      WHERE d.to_manager = ${managerId}
        AND d.created_at IS NOT NULL
        AND EXTRACT(YEAR FROM d.created_at) = ${year}
        AND EXTRACT(MONTH FROM d.created_at) = ${month}
        AND d.status IN ('approved', 'rejected')
      ORDER BY d.due_id DESC
    `;
    return result;
  } catch (err) {
    throw err;
  }
};

// Update due extension status and task deadline if approved
exports.updateDueExtensionStatus = async (dueId, status, managerId) => {
  const due = await this.getDueExtensionById(dueId);
  if (!due || due.to_manager !== managerId) {
    throw new Error('Due extension not found or unauthorized');
  }
  if (due.status !== 'pending' && due.status !== 'escalated') {
    throw new Error('This due extension has already been processed.');
  }

  if (status === 'approved') {
    // Calculate new deadline by adding days to current deadline
    const result = await sql.query(
      `WITH updated_due AS (
        UPDATE dues 
        SET status = $1
        WHERE due_id = $2
        RETURNING *
      )
      UPDATE tasks t
      SET deadline = (
        SELECT deadline + INTERVAL '1 day' * no_of_days
        FROM updated_due
        WHERE due_id = $2
      )
      FROM updated_due d
      WHERE t.task_id = d.task_id
      RETURNING t.*, d.*`,
      [status, dueId]
    );
    return result[0];
  } else if (status === 'rejected') {
    const result = await sql.query(
      'UPDATE dues SET status = $1 WHERE due_id = $2 RETURNING *',
      [status, dueId]
    );
    return result[0];
  } else {
    throw new Error('Invalid status');
  }
};

exports.updateDueExtension = async (id, data) => {
  const fields = [];
  const values = [];
  
  if (data.no_of_days !== undefined) {
    fields.push('no_of_days');
    values.push(data.no_of_days);
  }
  if (data.reason !== undefined) {
    fields.push('reason');
    values.push(data.reason);
  }
  if (data.status !== undefined) {
    fields.push('status');
    values.push(data.status);
  }
  
  if (fields.length === 0) return null;
  
  const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');
  const query = `
    UPDATE dues 
    SET ${setClause} 
    WHERE due_id = $${fields.length + 1} 
    RETURNING *
  `;
  
  const result = await sql.unsafe(query, [...values, id]);
  return result[0];
};

exports.getDueExtensionsForTeamLeader = async (tlId) => {
  const query = `
    SELECT 
      d.*,
      t.description as task_description,
      t.deadline as task_deadline,
      p.project_name,
      u1.email as employee_email,
      u2.email as manager_email
    FROM dues d
    JOIN tasks t ON d.task_id = t.task_id
    JOIN projects p ON d.project_id = p.project_id
    JOIN users u1 ON d.emp_id = u1.id
    JOIN users u2 ON d.to_manager = u2.id
    WHERE d.tl_id = $1 
      AND t.assigned_by = $1  -- Only show requests for tasks assigned by this team leader
      AND d.status IN ('pending', 'escalated')  -- Only show pending and escalated requests
    ORDER BY d.due_id DESC
  `;
  return sql.query(query, [tlId]);
};

exports.updateDueExtensionStatusByTeamLeader = async (id, status, tlId) => {
  // Only allow TL to update if the due is assigned to them and is pending
  const due = await sql.query("SELECT * FROM dues WHERE due_id = $1 AND tl_id = $2 AND status = 'pending'", [id, tlId]);
  if (!due.length) return null;

  // Team Leaders can only escalate to manager or reject, not approve themselves
  if (status === 'tl_approved') {
    // Change to 'escalated' status for manager approval
    status = 'escalated';
  }

  // Update status
  const result = await sql.query("UPDATE dues SET status = $1 WHERE due_id = $2 RETURNING *", [status, id]);
  return result[0];
};

// Get due extension history for Team Leader
exports.getTeamLeaderDueHistory = async (tlId, year, month) => {
  const query = `
    SELECT 
      d.*,
      t.description as task_description,
      t.deadline as task_deadline,
      p.project_name,
      u1.email as employee_email,
      u2.email as manager_email
    FROM dues d
    JOIN tasks t ON d.task_id = t.task_id
    JOIN projects p ON d.project_id = p.project_id
    JOIN users u1 ON d.emp_id = u1.id
    JOIN users u2 ON d.to_manager = u2.id
    WHERE d.tl_id = $1 
      AND d.created_at IS NOT NULL
      AND EXTRACT(YEAR FROM d.created_at) = $2
      AND EXTRACT(MONTH FROM d.created_at) = $3
      AND d.status IN ('approved', 'rejected', 'escalated')
    ORDER BY d.due_id DESC
  `;
  return sql.query(query, [tlId, year, month]);
}; 