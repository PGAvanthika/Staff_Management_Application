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

  // Fetch projects once
  useEffect(() => {
    setLoadingProjects(true);
    fetch("http://localhost:3001/api/review/projects")
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
  }, []);

  // Fetch tasks whenever selectedProject changes
  useEffect(() => {
    if (!selectedProject) {
      setTasks([]);
      return;
    }

    setLoadingTasks(true);
    fetch(`http://localhost:3001/api/review/projects/${selectedProject.id}/tasks`)
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
  }, [selectedProject]);

  // Transform task status to match your statusColors mapping
  const getTaskStatus = (status) => {
    // Map database status values to your UI status keys
    const statusMap = {
      'assigned': 'assigned',
      'in_progress': 'in-progress',
      'in-progress': 'in-progress',
      'completed': 'completed',
      'submit_successful': 'submit-successful',
      'submit-successful': 'submit-successful',
      'overdue': 'overdue',
      'unapproved': 'unapproved'
    };
    return statusMap[status] || 'assigned';
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

      <div className="main flex-grow-1 d-flex flex-column p-0 bg-white">
        {!selectedProject ? (
          <div className="d-flex justify-content-center align-items-center flex-grow-1 text-center text-primary">
            <div>
              <div className="review-icon display-3 mb-3">💬</div>
              <h2>It's Review Time</h2>
              <p>Let's Optimize Your Vision.</p>
            </div>
          </div>
        ) : (
          <div
            className="project-view p-4 w-100 h-100 flex-grow-1"
            style={{ backgroundColor: "#d4dfff", minHeight: "100%" }}
          >
            <h1 className="fw-bold">{selectedProject.title}</h1>
            <div className="project-id badge bg-secondary mb-3">
              {selectedProject.id}
            </div>

            {loadingTasks ? (
              <div className="text-center text-muted">
                <div className="spinner-border me-2" role="status"></div>
                Loading tasks...
              </div>
            ) : tasksError ? (
              <div className="alert alert-danger" role="alert">
                {tasksError}
              </div>
            ) : tasks.length > 0 ? (
              tasks.map((task) => (
                <div key={task.task_id} className="task-card card mb-3 shadow-sm">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div className="d-flex align-items-center">
                        <div className="task-icon me-3 fs-4">📋</div>
                        <div>
                          <strong>{task.task_id}</strong>
                          <p className="mb-1">{task.description}</p>
                        </div>
                      </div>
                      <div
                        className="task-status rounded-circle border"
                        style={{
                          backgroundColor: statusColors[getTaskStatus(task.task_status)],
                          width: "20px",
                          height: "20px",
                        }}
                        title={`Status: ${task.task_status}`}
                      ></div>
                    </div>
                    
                    {/* Additional task details */}
                    <div className="task-details mt-2 text-muted small">
                      <div className="row">
                        <div className="col-md-6">
                          <strong>Status:</strong> {task.task_status}
                        </div>
                        <div className="col-md-6">
                          <strong>Deadline:</strong>{" "}
                          {task.deadline ? new Date(task.deadline).toLocaleDateString() : "N/A"}
                        </div>
                      </div>
                      <div className="row mt-1">
                        <div className="col-md-6">
                          <strong>Assigned To:</strong> {task.assigned_to || "N/A"}
                        </div>
                        <div className="col-md-6">
                          <strong>Assigned By:</strong> {task.assigned_by || "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted">
                <div className="display-4 mb-3">📝</div>
                <h4>No tasks found</h4>
                <p>This project doesn't have any tasks yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewTasks;