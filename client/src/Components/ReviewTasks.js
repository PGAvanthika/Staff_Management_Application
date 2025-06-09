import React, { useState, useEffect } from "react";
import "./ReviewTasks.css";

const ReviewTasks = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [tasksError, setTasksError] = useState(null);
  const [loadingTasks, setLoadingTasks] = useState(false);

  // Fetch projects once
  useEffect(() => {
    fetch("http://localhost:3001/api/review/projects")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setProjects(data);
          setSelectedProject(data[0] || null);
          setError(null);
        } else {
          throw new Error("Unexpected response format");
        }
      })
      .catch((err) => {
        console.error("Failed to fetch projects:", err);
        setError("Failed to load projects.");
        setProjects([]);
        setSelectedProject(null);
      });
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

  return (
    <div className="container-fluid d-flex vh-100">
      {/* Sidebar */}
      <div
        className="sidebar bg-light border-end p-3"
        style={{ width: "250px", overflowY: "auto" }}
      >
        <h5 className="mb-3 text-primary">Projects</h5>
        {error && <p className="text-danger">{error}</p>}
        {projects.length > 0 ? (
          projects.map((project) => (
            <div
              key={project.id}
              className={`menu-item px-3 py-2 fw-bold text-start ${
                selectedProject?.id === project.id
                  ? "active bg-white border rounded"
                  : ""
              }`}
              style={{ cursor: "pointer" }}
              onClick={() => setSelectedProject(project)}
            >
              {project.title}
            </div>
          ))
        ) : (
          !error && <p className="text-muted">No projects available.</p>
        )}
      </div>

      {/* Main content */}
      <div className="main flex-grow-1 p-4 bg-white d-flex flex-column">
        {selectedProject ? (
          <>
            <div className="text-center mb-4">
              <h2 className="fw-bold">{selectedProject.title}</h2>
              <p className="badge bg-secondary">{selectedProject.id}</p>
            </div>

            {loadingTasks ? (
              <p className="text-center">Loading tasks...</p>
            ) : tasksError ? (
              <p className="text-danger text-center">{tasksError}</p>
            ) : tasks.length > 0 ? (
              <div className="tasks-list">
                {tasks.map((task) => (
                  <div
                    key={task.task_id}
                    className="task-item border rounded p-3 mb-3"
                  >
                    <h5>{task.task_id}</h5> {/* Using task_id as title */}
                    <p>{task.description}</p>
                    <p>
                      <strong>Status:</strong> {task.task_status}
                    </p>
                    <p>
                      <strong>Deadline:</strong>{" "}
                      {task.deadline ? new Date(task.deadline).toLocaleDateString() : "N/A"}
                    </p>
                    <p>
                      <strong>Assigned To:</strong> {task.assigned_to || "N/A"}
                    </p>
                    <p>
                      <strong>Assigned By:</strong> {task.assigned_by || "N/A"}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted">No tasks available.</p>
            )}
          </>
        ) : (
          !error && (
            <div className="text-center text-muted">Select a project to review</div>
          )
        )}
      </div>
    </div>
  );
};

export default ReviewTasks;
