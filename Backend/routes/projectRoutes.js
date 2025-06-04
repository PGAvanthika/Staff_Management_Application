const express = require('express');
const router = express.Router();
const sql = require('../config/db'); // Make sure this is a pg Pool

router.post('/', async (req, res) => {
  const { project_id, project_name } = req.body;

  if (!project_id || !project_name) {
    return res.status(400).json({ message: "Project ID and Name required" });
  }

  try {
    await sql.query(
      "INSERT INTO projects (project_id, project_name) VALUES ($1, $2)",
      [project_id, project_name]
    );
    res.status(201).json({ message: "Project created successfully" });
  } catch (err) {
    console.error("DB Error:", err);
    res.status(500).json({ message: "Database error" });
  }
});

module.exports = router;
