const reviewService = require('./review.service');

exports.getProjectsForManager = async (req, res) => {
  try {
    const managerId = req.user.userId;

    const projects = await reviewService.fetchProjectsByManager(managerId);
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch projects" });
  }
};

exports.getTasksByProjectForManager = async (req, res) => {
  const { projectId } = req.params;
  const managerId = req.user.userId;

  try {
    const tasks = await reviewService.fetchTasksByProjectAndManager(projectId, managerId);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};
