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

// Get all due extensions for the logged-in manager
router.get('/manager/dues', isLoggedIn, isManager, dueController.getManagerDueExtensions);

// Get due extension history for the logged-in manager for a given month
router.get('/manager/history', isLoggedIn, isManager, dueController.getManagerDueHistory);

// Manager can update a due extension status (approve/reject)
router.put('/:id/status', isLoggedIn, isManager, dueController.updateDueStatus);

// Manager can update a due extension (e.g., approve/reject or update fields)
router.put('/:id', isLoggedIn, isManager, dueController.updateDueExtension);

module.exports = router; 