const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/projects", async (req, res) => {
  try {
    // result is already an array of projects, not { rows: [...] }
    const result = await db.query("SELECT * FROM projects ORDER BY created_at DESC");

    // Defensive check: make sure result is an array
    if (!Array.isArray(result)) {
      console.error("Unexpected query result:", result);
      return res.status(500).json({ error: "Invalid data received from database" });
    }

    const projects = result.map(project => ({
      id: project.project_id,
      title: project.project_name,
    }));

    res.json(projects);
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});


module.exports = router;
