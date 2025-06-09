const express = require('express');
const router = express.Router();
const db = require('../config/db');
const {isLoggedIn,isManager} = require('../middlewares/authMiddleware');

// POST /api/projects - Create a new project
router.post("/",async (req, res) => {
  const { project_id, project_name } = req.body;

  if (!project_id || !project_name) {
    return res.status(400).json({ message: "Both project_id and project_name are required" });
  }

  try {
    // Check if project already exists
    const existing = await db.query("SELECT * FROM projects WHERE project_id = $1", [project_id]);

    if (existing.length > 0) {
      return res.status(409).json({ message: "Project with this ID already exists" });
    }

    // Insert project
    const result = await db.query(
      "INSERT INTO projects (project_id, project_name) VALUES ($1, $2) RETURNING *",
      [project_id, project_name]
    );

    res.status(201).json({
      message: "Project created successfully",
      project: result[0]
    });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ message: "Database error while creating project", error: error.message });
  }
});

// GET /api/projects/:projectId - Check if project exists
router.get("/:projectId", async (req, res) => {
  const { projectId } = req.params;

  try {
    const rows = await db.query(
      "SELECT project_id FROM projects WHERE project_id = $1",
      [projectId]
    );

    if (!rows || !Array.isArray(rows)) {
      throw new Error("Invalid response from database");
    }

    res.json({ exists: rows.length > 0 });
  } catch (error) {
    console.error("Project check error:", error);
    res.status(500).json({
      message: "Database error while checking project",
      error: error.message,
    });
  }
});

module.exports = router;
