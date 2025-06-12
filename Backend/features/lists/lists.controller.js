const listsService = require('./lists.service');

exports.getListsForUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    const lists = await listsService.getListsForUser(userId);
    res.json(lists);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch lists' });
  }
};

exports.createList = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, color, position } = req.body;
    const list = await listsService.createList({ user_id: userId, name, color, position });
    res.status(201).json(list);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create list' });
  }
};

exports.updateList = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, color, position } = req.body;
    const updated = await listsService.updateList(id, { name, color, position });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update list' });
  }
};

exports.deleteList = async (req, res) => {
  try {
    const { id } = req.params;
    await listsService.deleteList(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete list' });
  }
}; 