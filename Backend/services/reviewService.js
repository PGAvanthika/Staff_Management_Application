const db = require("../config/db");

exports.fetchProjectsByManager = async (managerId) => {
  const result = await db.query(
    `SELECT DISTINCT p.project_id, p.project_name, p.created_at
     FROM projects p
     JOIN tasks t ON t.project_id = p.project_id
     WHERE t.assigned_by = $1 OR t.assigned_to = $1
     ORDER BY p.created_at DESC`,
    [managerId]
  );
  const projectsData = result.rows || result;

  if (!Array.isArray(projectsData)) {
    throw new Error("Invalid data received from database");
  }

  return projectsData.map(project => ({
    id: project.project_id,
    title: project.project_name,
    // Optionally include createdAt if you want to use it later:
    // createdAt: project.created_at,
  }));
};

exports.fetchTasksByProjectAndManager = async (projectId, managerId) => {
  const result = await db.query(
    `SELECT task_id, description, deadline, task_status, assigned_to, assigned_by
     FROM tasks
     WHERE project_id = $1 AND (assigned_by = $2 OR assigned_to = $2)
     ORDER BY deadline`,
    [projectId, managerId]
  );

  const tasksData = result.rows || result;

  if (!Array.isArray(tasksData)) {
    throw new Error("Invalid data received from database");
  }

  return tasksData;
};
