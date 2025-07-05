const express = require("express");
const router = express.Router();
const { isLoggedIn, authorizeRoles } = require("../../middlewares/authMiddleware");
const reviewController = require("./review.controller");

// Get all projects for manager or team leader
router.get(
  "/projects",
  isLoggedIn,
  authorizeRoles("manager", "team_leader", "Admin"),
  reviewController.getProjectsForManager
);

// Get tasks by project for manager or team leader
router.get(
  "/projects/:projectId/tasks",
  isLoggedIn,
  authorizeRoles("manager", "team_leader", "Admin"),
  reviewController.getTasksByProjectForManager
);

module.exports = router;
