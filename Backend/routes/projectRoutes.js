const express = require('express');
const router = express.Router();
const { isLoggedIn, isManager } = require('../middlewares/authMiddleware');
const projectController = require('../controllers/projectController');

// Create new project
router.post("/", isLoggedIn, isManager, projectController.createProject);

// Check if project exists
router.get("/:projectId", isLoggedIn, isManager, projectController.checkProjectExists);

module.exports = router;
