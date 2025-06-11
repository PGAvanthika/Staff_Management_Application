const dueService = require('./due.service');

exports.createDueExtension = async (req, res) => {
  try {
    const { emp_id, tl_id, project_id, task_id, to_manager, no_of_days, reason } = req.body;
    if (
      !emp_id || !tl_id || !project_id || !task_id ||
      !to_manager || !no_of_days || !reason
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const due = await dueService.createDueExtension(req.body);
    res.status(201).json(due);
  } catch (err) {
    if (err.code === '23503') { // Foreign key violation
      return res.status(400).json({ error: "Invalid reference: One of the IDs does not exist" });
    }
    res.status(500).json({ error: err.message });
  }
};

exports.getAllDueExtensions = async (req, res) => {
  try {
    const dues = await dueService.getAllDueExtensions();
    res.json(dues);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getDueExtensionById = async (req, res) => {
  try {
    const due = await dueService.getDueExtensionById(req.params.id);
    if (!due) return res.status(404).json({ error: 'Due extension not found' });
    res.json(due);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all due extensions for the logged-in manager
exports.getManagerDueExtensions = async (req, res) => {
  try {
    const managerId = req.user.userId;
    const dues = await dueService.getDueExtensionsForManager(managerId);
    res.json(dues);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get due extension history for the logged-in manager for a given month
exports.getManagerDueHistory = async (req, res) => {
  try {
    const managerId = req.user.userId;
    const year = parseInt(req.query.year, 10);
    const month = parseInt(req.query.month, 10);
    if (!year || !month) {
      return res.status(400).json({ error: 'Year and month are required' });
    }
    const dues = await dueService.getDueExtensionsHistoryForManager(managerId, year, month);
    res.json(dues);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update due extension status (approve/reject)
exports.updateDueStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;
    const managerId = req.user.userId;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const result = await dueService.updateDueExtensionStatus(id, status, managerId);
    if (!result) {
      return res.status(404).json({ error: 'Due extension not found' });
    }
    res.json(result);
  } catch (err) {
    if (err.message === 'Due extension not found or unauthorized' || err.message === 'This due extension has already been processed.') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

exports.updateDueExtension = async (req, res) => {
  try {
    const updated = await dueService.updateDueExtension(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Due extension not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 