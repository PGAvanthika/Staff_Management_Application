const notesService = require('./notes.service');

exports.getNotesForUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    const notes = await notesService.getNotesForUser(userId);
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
};

exports.createNote = async (req, res) => {
  try {
    const userId = req.user.userId;
    const note = await notesService.createNote({ ...req.body, user_id: userId });
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create note', details: err.message, stack: err.stack });
  }
};

exports.updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await notesService.updateNote(id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update note' });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    await notesService.deleteNote(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete note' });
  }
}; 