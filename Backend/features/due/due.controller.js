const dueService = require('./due.service');

exports.createDueExtension = async (req, res) => {
  try {
    console.log('Due Extension Data:', req.body); // Log incoming data for debugging
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
    console.error('Due Extension Error:', err); // Log the error for debugging
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

exports.updateDueExtension = async (req, res) => {
  try {
    const updated = await dueService.updateDueExtension(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Due extension not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 