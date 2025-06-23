const express = require('express');
const router = express.Router();
const { isLoggedIn, authorizeRoles } = require('../../middlewares/authMiddleware');
const projectController = require('./project.controller');

// Create new project (Admin or Manager)
router.post("/", isLoggedIn, authorizeRoles('Admin', 'Manager'), projectController.createProject);

// Check if project exists (Admin or Manager)
router.get("/:projectId", isLoggedIn, authorizeRoles('Admin', 'Manager','team_leader'), projectController.checkProjectExists);

module.exports = router;
