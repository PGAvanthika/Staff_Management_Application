const sql = require('../../config/db');

exports.createProject = async (project_id, project_name) => {
  const existing = await sql.query("SELECT * FROM projects WHERE project_id = $1", [project_id]);

  if (existing.length > 0) {
    const err = new Error("Project already exists");
    err.code = 'DUPLICATE';
    throw err;
  }

  const result = await sql.query(
    "INSERT INTO projects (project_id, project_name) VALUES ($1, $2) RETURNING *",
    [project_id, project_name]
  );

  return result[0];
};

exports.checkIfExists = async (projectId) => {
  const rows = await sql.query(
    "SELECT project_id FROM projects WHERE project_id = $1",
    [projectId]
  );

  if (!rows || !Array.isArray(rows)) {
    throw new Error("Invalid response from database");
  }

  return rows.length > 0;
};

exports.getAllProjects = async () => {
  const result = await sql.query("SELECT * FROM projects ORDER BY created_at DESC");
  if (!Array.isArray(result)) {
    throw new Error("Unexpected DB response format");
  }
  return result;
};
