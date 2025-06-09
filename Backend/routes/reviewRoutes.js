const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/projects", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM projects ORDER BY created_at DESC");
    
    // Handle both possible return formats from your db query method
    const projectsData = result.rows || result;
    
    if (!Array.isArray(projectsData)) {
      console.error("Unexpected query result:", result);
      return res.status(500).json({ error: "Invalid data received from database" });
    }

    const projects = projectsData.map(project => ({
      id: project.project_id,
      title: project.project_name,
    }));

    res.json(projects);
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

router.get("/projects/:projectId/tasks", async (req, res) => {
  const { projectId } = req.params;
  
  try {
    const result = await db.query(
      `SELECT task_id, description, deadline, task_status, assigned_to, assigned_by
       FROM tasks WHERE project_id = $1 ORDER BY deadline`,
      [projectId]
    );

    // Handle both possible return formats from your db query method
    const tasksData = result.rows || result;
    
    if (!Array.isArray(tasksData)) {
      console.error("Unexpected query result:", result);
      return res.status(500).json({ error: "Invalid data from database" });
    }
    
    return res.json(tasksData);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    return res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

module.exports = router;