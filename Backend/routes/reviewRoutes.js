// routes/reviewRoutes.js
const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const { isLoggedIn, isManager } = require("../middlewares/authMiddleware");

// Apply authentication and role check middleware to all routes in this router
router.use(isLoggedIn, isManager);

// Routes for manager to get projects and tasks they are assigned or assigned by them
router.get("/projects", reviewController.getProjectsForManager);
router.get("/projects/:projectId/tasks", reviewController.getTasksByProjectForManager);

module.exports = router;
