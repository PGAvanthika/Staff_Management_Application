const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../../middlewares/authMiddleware');
const listsController = require('./lists.controller');

// Get all lists for the logged-in user
router.get('/', isLoggedIn, listsController.getListsForUser);
// Create a new list
router.post('/', isLoggedIn, listsController.createList);
// Update a list
router.put('/:id', isLoggedIn, listsController.updateList);
// Delete a list
router.delete('/:id', isLoggedIn, listsController.deleteList);

module.exports = router; 