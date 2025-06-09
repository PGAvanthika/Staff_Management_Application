const reviewService = require("../services/reviewService");

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await reviewService.fetchAllProjects();
    res.json(projects);
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
};

exports.getTasksByProject = async (req, res) => {
  const { projectId } = req.params;

  try {
    const tasks = await reviewService.fetchTasksByProject(projectId);
    res.json(tasks);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};
