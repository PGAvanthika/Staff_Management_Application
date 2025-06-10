const logActivity = require('../../utils/activityLogger');
const sql = require('../../config/db');
const projectService = require('./project.service');

exports.createProject = async (req, res) => {
  const { project_id, project_name } = req.body;

  if (!project_id || !project_name) {
    return res.status(400).json({ message: "Both project_id and project_name are required" });
  }

  try {
    const project = await projectService.createProject(project_id, project_name);
    res.status(201).json({ message: "Project created successfully", project });
  } catch (error) {
    if (error.code === 'DUPLICATE') {
      return res.status(409).json({ message: "Project with this ID already exists" });
    }
    console.error("Error creating project:", error);
    res.status(500).json({ message: "Database error while creating project", error: error.message });
  }
};

exports.checkProjectExists = async (req, res) => {
  const { projectId } = req.params;

  try {
    const exists = await projectService.checkIfExists(projectId);
    res.json({ exists });
  } catch (error) {
    console.error("Project check error:", error);
    res.status(500).json({
      message: "Database error while checking project",
      error: error.message,
    });
  }
};
