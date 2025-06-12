const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../../middlewares/authMiddleware');
const notesController = require('./notes.controller');

// Get all notes for the logged-in user
router.get('/', isLoggedIn, notesController.getNotesForUser);
// Create a new note
router.post('/', isLoggedIn, notesController.createNote);
// Update a note
router.put('/:id', isLoggedIn, notesController.updateNote);
// Delete a note
router.delete('/:id', isLoggedIn, notesController.deleteNote);

module.exports = router; 