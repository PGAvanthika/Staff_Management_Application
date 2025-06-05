const express = require('express');
const router = express.Router();
const db = require('../config/db');


// GET /api/projects/:projectId - Check if project exists
router.get("/:projectId", async (req, res) => {
  const { projectId } = req.params;

  try {
    // db.query returns array of rows directly
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
