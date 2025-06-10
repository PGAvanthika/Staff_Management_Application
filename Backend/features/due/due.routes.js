const express = require('express');
const router = express.Router();
const { isLoggedIn, isManager } = require('../../middlewares/authMiddleware');
const dueController = require('./due.controller');

// Create a new due extension request
router.post('/', isLoggedIn, dueController.createDueExtension);

// Get all due extension requests
router.get('/', isLoggedIn, dueController.getAllDueExtensions);

// Get a specific due extension by ID
router.get('/:id', isLoggedIn, dueController.getDueExtensionById);

// Manager can update a due extension (e.g., approve/reject or update fields)
router.put('/:id', isLoggedIn, isManager, dueController.updateDueExtension);

module.exports = router; 