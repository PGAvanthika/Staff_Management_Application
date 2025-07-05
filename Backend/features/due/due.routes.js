const express = require('express');
const router = express.Router();
const { isLoggedIn, isManager, authorizeRoles } = require('../../middlewares/authMiddleware');
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

// Team Leader can view and act on due extension requests
router.get('/teamleader/dues', isLoggedIn, authorizeRoles('Team_Leader'), dueController.getTeamLeaderDueExtensions);
router.put('/teamleader/dues/:id/status', isLoggedIn, authorizeRoles('Team_Leader'), dueController.updateDueStatusByTeamLeader);

module.exports = router; 