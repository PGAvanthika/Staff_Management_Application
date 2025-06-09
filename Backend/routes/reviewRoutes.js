const express = require("express");
const router = express.Router();
const { isLoggedIn, isManager } = require("../middlewares/authMiddleware");
const reviewController = require("../controllers/reviewController");

// Get all projects assigned by or assigned to the logged-in manager
router.get("/projects", isLoggedIn, isManager, reviewController.getProjectsForManager);

// Get tasks by project and manager
router.get("/projects/:projectId/tasks", isLoggedIn, isManager, reviewController.getTasksByProjectForManager);

module.exports = router;
