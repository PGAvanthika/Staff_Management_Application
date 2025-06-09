const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");

// GET /api/review/projects
router.get("/projects", reviewController.getAllProjects);

// GET /api/review/projects/:projectId/tasks
router.get("/projects/:projectId/tasks", reviewController.getTasksByProject);

module.exports = router;
