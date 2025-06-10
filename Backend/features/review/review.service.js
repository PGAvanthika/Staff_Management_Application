const sql = require('../../config/db');

// Fetch all projects related to a manager
exports.fetchProjectsByManager = async (managerId) => {
  const query = `
    SELECT DISTINCT p.project_id, p.project_name, p.created_at
    FROM projects p
    JOIN tasks t ON t.project_id = p.project_id
    WHERE t.assigned_by = $1 OR t.assigned_to = $1
    ORDER BY p.created_at DESC
  `;

  try {
    const result = await sql.query(query, [managerId]);

    // If result is an array, use it directly
    if (!Array.isArray(result)) {
      throw new Error("Unexpected DB response format");
    }


    return result.map(project => ({
      id: project.project_id,
      title: project.project_name,
      createdAt: project.created_at,
    }));
  } catch (error) {
    throw error;
  }
};

// Fetch tasks for a given project and manager
exports.fetchTasksByProjectAndManager = async (projectId, managerId) => {
  const query = `
    SELECT t.task_id, t.description, t.deadline, t.task_status
    FROM tasks t
    WHERE t.project_id = $1
      AND (t.assigned_by = $2 OR t.assigned_to = $2)
    ORDER BY t.deadline ASC
  `;

  try {
    const result = await sql.query(query, [projectId, managerId]);

    if (!Array.isArray(result)) {
      throw new Error("Unexpected DB response format");
    }


    return result.map(task => ({
      task_id: task.task_id,
      description: task.description,
      deadline: task.deadline,
      task_status: task.task_status,
    }));
  } catch (error) {
    throw error;
  }
};
