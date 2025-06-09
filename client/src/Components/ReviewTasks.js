import React, { useState, useEffect } from "react";
import "./ReviewTasks.css";

const ReviewTasks = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/api/review/projects")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setProjects(data);
          setSelectedProject(data[0] || null); // Auto-select first project if any
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
      <div className="main flex-grow-1 p-4 bg-white d-flex flex-column align-items-center justify-content-center">
        {selectedProject ? (
          <div className="text-center">
            <h2 className="fw-bold">{selectedProject.title}</h2>
            <p className="badge bg-secondary">{selectedProject.id}</p>
            <p className="text-muted mt-3">Task details can be loaded here...</p>
          </div>
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
