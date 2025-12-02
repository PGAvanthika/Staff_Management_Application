import React, { useState, useEffect } from "react";
import "./ReviewTasks.css";

const statusColors = {
  assigned: "#e5e7eb",
  completed: "#bbf7d0",
  overdue: "#fecaca",
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
    fetch("http://13.49.158.152:3001/api/reviews/projects", {
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
    fetch(`http://13.49.158.152:3001/api/reviews/projects/${selectedProject.id}/tasks`, {
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
    const normalized = (status || "").toLowerCase();
    if (
      normalized === "completed" ||
      normalized === "submit_successful" ||
      normalized === "submit-successful"
    ) {
      return "completed";
    }
    // Everything else is treated as "assigned" (or "overdue" based on deadline)
    return "assigned";
  };

  const getStatusLabel = (normalizedStatus, deadline) => {
    if (normalizedStatus === "completed") return "Completed";
    // Derive overdue based on deadline if not completed
    if (deadline) {
      const now = new Date();
      const due = new Date(deadline);
      if (!isNaN(due.getTime()) && now > due) {
        return "Overdue";
      }
    }

    return "Assigned";
  };

  return (
    <div className="container-fluid review-container d-flex flex-column flex-md-row">
      <div className="review-sidebar bg-white border-end p-3 d-flex flex-column">
        <h5 className="mb-1 text-primary fw-bold">Projects</h5>
        <p className="text-muted small mb-3">
          Select a project to see all related tasks and their current status.
        </p>

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
              <div>{project.title}</div>
              <div style={{ fontWeight: "normal", fontSize: "0.85em", color: "#888" }}>
                {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : ""}
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted small">No projects available.</p>
        )}
      </div>

      <div className="flex-fill p-3 overflow-auto review-main">
        <div className="review-header d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <div className="review-title-block">
            <h5 className="text-primary mb-1 fw-bold">
              {selectedProject ? `Tasks for ${selectedProject.title}` : "Select a project to review tasks"}
            </h5>
            {selectedProject && (
              <p className="text-muted small mb-0">
                Quickly scan task status: overdue, in progress, completed, and more.
              </p>
            )}
          </div>
          <div className="review-legend d-flex flex-wrap gap-2 align-items-center">
            <span className="legend-label small text-muted me-1">Legend:</span>
            {[
              { key: "assigned", label: "assigned", color: statusColors.assigned },
              { key: "completed", label: "completed", color: statusColors.completed },
              { key: "overdue", label: "overdue", color: statusColors.overdue },
            ].map((item) => (
              <span key={item.key} className="legend-item d-inline-flex align-items-center small">
                <span
                  className="legend-dot me-1"
                  style={{ backgroundColor: item.color }}
                />
                {item.label}
              </span>
            ))}
          </div>
        </div>

        {loadingTasks ? (
          <div className="text-center text-muted py-4">
            <div className="spinner-border spinner-border-sm me-2" role="status"></div>
            Loading tasks...
          </div>
        ) : tasksError ? (
          <p className="text-danger">{tasksError}</p>
        ) : tasks.length > 0 ? (
          <div className="row g-3">
            {tasks.map((task) => {
              const normalizedStatus = getTaskStatus(task.task_status);
              const label = getStatusLabel(normalizedStatus, task.deadline);
              const color =
                label === "Overdue"
                  ? statusColors.overdue
                  : normalizedStatus === "completed"
                  ? statusColors.completed
                  : statusColors.assigned;
              return (
                <div key={task.task_id} className="col-12 col-md-6 col-xl-4">
                  <div className="task-card border rounded-3 h-100 d-flex flex-column">
                    <div
                      className="task-card-header d-flex justify-content-between align-items-center px-3 py-2"
                      style={{ borderBottom: "1px solid #e5e7eb" }}
                    >
                      <span className="fw-semibold small text-muted">
                        Task ID: {task.task_id}
                      </span>
                      <span
                        className="status-pill small fw-semibold text-capitalize"
                        style={{ backgroundColor: color }}
                      >
                        {label}
                      </span>
                    </div>
                    <div className="task-card-body px-3 py-2">
                      <p className="mb-2 task-description">{task.description}</p>
                      <div className="d-flex justify-content-between align-items-center small text-muted">
                        <span>Deadline:</span>
                        <span className="fw-semibold">
                          {task.deadline
                            ? new Date(task.deadline).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : selectedProject ? (
          <p className="text-muted small">No tasks available for this project.</p>
        ) : null}
      </div>
    </div>
  );
};

export default ReviewTasks;
