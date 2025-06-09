const db = require("../config/db");

exports.fetchAllProjects = async () => {
  const result = await db.query("SELECT * FROM projects ORDER BY created_at DESC");
  const projectsData = result.rows || result;

  if (!Array.isArray(projectsData)) {
    throw new Error("Invalid data received from database");
  }

  return projectsData.map(project => ({
    id: project.project_id,
    title: project.project_name,
  }));
};

exports.fetchTasksByProject = async (projectId) => {
  const result = await db.query(
    `SELECT task_id, description, deadline, task_status, assigned_to, assigned_by
     FROM tasks WHERE project_id = $1 ORDER BY deadline`,
    [projectId]
  );

  const tasksData = result.rows || result;

  if (!Array.isArray(tasksData)) {
    throw new Error("Invalid data received from database");
  }

  return tasksData;
};
