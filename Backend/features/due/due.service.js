const sql = require('../../config/db');

// Create a due extension request
exports.createDueExtension = async (data) => {
  const { emp_id, tl_id, project_id, task_id, to_manager, no_of_days, reason, due_date } = data;

  const result = await sql`
    INSERT INTO dues (emp_id, tl_id, project_id, task_id, to_manager, no_of_days, reason, due_date)
    VALUES (${emp_id}, ${tl_id}, ${project_id}, ${task_id}, ${to_manager}, ${no_of_days}, ${reason}, ${due_date})
    RETURNING *
  `;
  return result[0];
};

exports.getAllDueExtensions = async () => {
  return await sql`SELECT * FROM dues ORDER BY due_id DESC`;
};

exports.getDueExtensionById = async (id) => {
  const result = await sql`SELECT * FROM dues WHERE due_id = ${id}`;
  return result[0];
};

// Get all due extensions for a specific manager (assigner)
exports.getDueExtensionsForManager = async (managerId) => {
  return await sql`
    SELECT * FROM dues 
    WHERE to_manager = ${managerId} 
      AND status IN ('pending', 'escalated')
    ORDER BY due_id DESC
  `;
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
    // Manager approval: update due status and extend task deadline
    const result = await sql`
      WITH updated_due AS (
        UPDATE dues 
        SET status = 'approved'
        WHERE due_id = ${dueId}
        RETURNING *
      )
      UPDATE tasks t
      SET deadline = (
        SELECT deadline + (no_of_days || ' days')::interval
        FROM updated_due
        WHERE due_id = ${dueId}
      )
      FROM updated_due d
      WHERE t.task_id = d.task_id
      RETURNING t.*, d.*
    `;
    return result[0];
  } else if (status === 'rejected') {
    const result = await sql`
      UPDATE dues 
      SET status = 'rejected'
      WHERE due_id = ${dueId}
      RETURNING *
    `;
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
  return await sql`
    SELECT * FROM dues 
    WHERE tl_id = ${tlId}
    ORDER BY due_id DESC
  `;
};

exports.updateDueExtensionStatusByTeamLeader = async (id, status, tlId) => {
  // Only allow TL to update if the due is assigned to them and is pending/escalated
  const [due] = await sql`
    SELECT * FROM dues 
    WHERE due_id = ${id} AND tl_id = ${tlId} AND status = 'pending'
  `;
  if (!due) return null;

  if (status === 'escalated') {
    // Escalate to manager without changing deadline
    const [updated] = await sql`
      UPDATE dues 
      SET status = 'escalated'
      WHERE due_id = ${id}
      RETURNING *
    `;
    return updated;
  }

  if (status === 'tl_approved') {
    // TL is the assigner: finalize approval and extend deadline
    const result = await sql`
      WITH updated_due AS (
        UPDATE dues 
        SET status = 'approved'
        WHERE due_id = ${id}
        RETURNING *
      )
      UPDATE tasks t
      SET deadline = (
        SELECT deadline + (no_of_days || ' days')::interval
        FROM updated_due
        WHERE due_id = ${id}
      )
      FROM updated_due d
      WHERE t.task_id = d.task_id
      RETURNING t.*, d.*
    `;
    return result[0];
  }

  if (status === 'tl_rejected') {
    const [updated] = await sql`
      UPDATE dues 
      SET status = 'rejected'
      WHERE due_id = ${id}
      RETURNING *
    `;
    return updated;
  }

  throw new Error('Invalid status');
}; 