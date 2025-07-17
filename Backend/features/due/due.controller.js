const dueService = require('./due.service');
const sql = require('../../config/db'); // or wherever your db connection is

exports.createDueExtension = async (req, res) => {
  try {
    const { emp_id, tl_id, project_id, task_id, to_manager, no_of_days, reason, due_date } = req.body;
    if (!emp_id || !tl_id || !project_id || !task_id || !to_manager || !no_of_days || !reason || !due_date) {
      return res.status(400).json({ error: "All fields are required" });
    }
    // Validate IDs
    const [emp, tl, mgr, project, task] = await Promise.all([
      sql.query('SELECT id FROM users WHERE id = $1', [emp_id]),
      sql.query('SELECT id FROM users WHERE id = $1', [tl_id]),
      sql.query('SELECT id FROM users WHERE id = $1', [to_manager]),
      sql.query('SELECT project_id FROM projects WHERE project_id = $1', [project_id]),
      sql.query('SELECT task_id FROM tasks WHERE task_id = $1', [task_id]),
    ]);
    if (!emp.length) return res.status(400).json({ error: 'Invalid employee ID' });
    if (!tl.length) return res.status(400).json({ error: 'Invalid team leader ID' });
    if (!mgr.length) return res.status(400).json({ error: 'Invalid manager ID' });
    if (!project.length) return res.status(400).json({ error: 'Invalid project ID' });
    if (!task.length) return res.status(400).json({ error: 'Invalid task ID' });
    // Do not allow created_at from frontend
    const due = await dueService.createDueExtension({ emp_id, tl_id, project_id, task_id, to_manager, no_of_days, reason, due_date });
    res.status(201).json(due);
  } catch (err) {
    if (err.code === '23503') {
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

// Get all due requests for the logged-in team leader
exports.getTeamLeaderDueExtensions = async (req, res) => {
  try {
    const tlId = req.user.userId;
    const dues = await dueService.getDueExtensionsForTeamLeader(tlId);
    console.log('[DEBUG] TeamLeaderDueExtensions for tlId:', tlId, '| count:', dues.length);
    res.json(dues);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Team leader acts on a due request (approve/reject/escalate)
exports.updateDueStatusByTeamLeader = async (req, res) => {
  try {
    const { status } = req.body; // 'tl_approved', 'tl_rejected', 'escalated'
    const { id } = req.params;
    const tlId = req.user.userId;

    if (!['tl_approved', 'tl_rejected', 'escalated'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const result = await dueService.updateDueExtensionStatusByTeamLeader(id, status, tlId);
    if (!result) {
      return res.status(404).json({ error: 'Due extension not found' });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 