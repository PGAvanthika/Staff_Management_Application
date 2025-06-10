const sql = require('../../config/db');

exports.createDueExtension = async (data) => {
  const { emp_id, tl_id, project_id, task_id, to_manager, no_of_days, reason } = data;
  const result = await sql`
    INSERT INTO dues (emp_id, tl_id, project_id, task_id, to_manager, no_of_days, reason)
    VALUES (${emp_id}, ${tl_id}, ${project_id}, ${task_id}, ${to_manager}, ${no_of_days}, ${reason})
    RETURNING *;
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

exports.updateDueExtension = async (id, data) => {
  // Only allow updating certain fields (e.g., no_of_days, reason, status)
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
  const result = await sql.unsafe(
    `UPDATE dues SET ${setClause} WHERE due_id = $${fields.length + 1} RETURNING *`,
    ...values,
    id
  );
  return result[0];
}; 