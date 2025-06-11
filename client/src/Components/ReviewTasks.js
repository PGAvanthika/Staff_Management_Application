import React, { useState, useEffect } from "react";
import "./ReviewTasks.css";

const statusColors = {
  assigned: "#ffffff",
  "in-progress": "#87CEFA",
  completed: "#FFFF99",
  "submit-successful": "#32CD32",
  overdue: "#FF6347",
  unapproved: "#FFA500",
};

const ReviewTasks = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [tasksError, setTasksError] = useState(null);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(true);

  const token = localStorage.getItem("token");

  // Fetch projects once
  useEffect(() => {
    setLoadingProjects(true);
    fetch("http://localhost:3001/api/reviews/projects", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setProjects(data);
          setError(null);
        } else {
          throw new Error("Unexpected response format");
        }
      })
      .catch((err) => {
        console.error("Failed to fetch projects:", err);
        setError("Failed to load projects.");
        setProjects([]);
      })
      .finally(() => setLoadingProjects(false));
  }, [token]);

  // Fetch tasks whenever selectedProject changes
  useEffect(() => {
    if (!selectedProject) {
      setTasks([]);
      return;
    }

    setLoadingTasks(true);
    fetch(`http://localhost:3001/api/reviews/projects/${selectedProject.id}/tasks`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setTasks(data);
          setTasksError(null);
        } else {
          throw new Error("Unexpected tasks response format");
        }
      })
      .catch((err) => {
        console.error("Failed to fetch tasks:", err);
        setTasksError("Failed to load tasks.");
        setTasks([]);
      })
      .finally(() => setLoadingTasks(false));
  }, [selectedProject, token]);

  const getTaskStatus = (status) => {
    const statusMap = {
      assigned: "assigned",
      "in_progress": "in-progress",
      "in-progress": "in-progress",
      completed: "completed",
      "submit_successful": "submit-successful",
      "submit-successful": "submit-successful",
      overdue: "overdue",
      unapproved: "unapproved",
    };
    return statusMap[status] || "assigned";
  };

  return (
    <div className="container-fluid review-container d-flex flex-column flex-md-row vh-100">
      <div className="sidebar bg-white border-end p-3 d-flex flex-column">
        <h5 className="mb-3 text-primary">Projects</h5>

        {loadingProjects ? (
          <div className="text-center text-muted">
            <div className="spinner-border spinner-border-sm me-2" role="status"></div>
            Loading projects...
          </div>
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : projects.length > 0 ? (
          projects.map((project) => (
            <div
              key={project.id}
              className={`menu-item px-3 py-2 fw-bold text-start ${
                selectedProject?.id === project.id ? "active" : ""
              }`}
              style={{ cursor: "pointer" }}
              onClick={() => setSelectedProject(project)}
            >
              {project.title}
            </div>
          ))
        ) : (
          <p className="text-muted">No projects available.</p>
        )}
      </div>

      <div className="flex-fill p-3 overflow-auto">
        <h5 className="text-primary mb-3">
          {selectedProject ? `Tasks for ${selectedProject.title}` : "Select a project"}
        </h5>

        {loadingTasks ? (
          <div className="text-center text-muted">
            <div className="spinner-border spinner-border-sm me-2" role="status"></div>
            Loading tasks...
          </div>
        ) : tasksError ? (
          <p className="text-danger">{tasksError}</p>
        ) : tasks.length > 0 ? (
          <div className="list-group">
            {tasks.map((task) => (
              <div
                key={task.task_id}
                className="list-group-item mb-2 border rounded"
                style={{
                  backgroundColor: statusColors[getTaskStatus(task.task_status)],
                }}
              >
                <h6 className="fw-bold">Task ID: {task.task_id}</h6>
                <p className="mb-1">{task.description}</p>
                <small className="text-muted">Deadline: {task.deadline}</small>
              </div>
            ))}
          </div>
        ) : selectedProject ? (
          <p className="text-muted">No tasks available for this project.</p>
        ) : null}
      </div>
    </div>
  );
};

export default ReviewTasks;
