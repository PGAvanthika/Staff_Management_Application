import React, { useState } from "react";
import "./ReviewTasks.css"; // Updated Bootstrap-based CSS

const projectsData = [
  {
    id: "PRJ3124",
    title: "STAFF MANAGEMENT",
    status: "in-progress",
    tasks: [
      {
        id: "TSK4606",
        title: "Develop the prototype for the staff management project",
        status: "submit-successful",
      },
      {
        id: "TSK4562",
        title: "Setup project repository",
        status: "in-progress",
      },
      { id: "TSK4555", title: "Finalize requirements", status: "completed" },
    ],
  },
  { id: "PRJ3221", title: "CHAT BOT", status: "assigned", tasks: [] },
  { id: "PRJ4002", title: "ATTENDANCE APP", status: "assigned", tasks: [] },
  { id: "PRJ2043", title: "CLRA", status: "overdue", tasks: [] },
  { id: "PRJ2020", title: "IT TICKETING", status: "unapproved", tasks: [] },
];

const statusColors = {
  assigned: "#ffffff",
  "in-progress": "#87CEFA",
  completed: "#FFFF99",
  "submit-successful": "#32CD32",
  overdue: "#FF6347",
  unapproved: "#FFA500",
};

const ReviewTasks = () => {
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <div className="container-fluid review-container d-flex flex-column flex-md-row vh-100">
      <div className="sidebar bg-white border-end p-3 d-flex flex-column">
        {projectsData.map((project) => (
          <div
            key={project.id}
            className={`menu-item px-3 py-2 fw-bold text-start ${
              selectedProject?.id === project.id ? "active" : ""
            }`}
            onClick={() => setSelectedProject(project)}
          >
            {project.title}
          </div>
        ))}
      </div>

      <div className="main flex-grow-1 d-flex justify-content-center align-items-center p-4 bg-white">
        {!selectedProject ? (
          <div className="text-center text-primary">
            <div className="review-icon display-3 mb-3">💬</div>
            <h2>It’s Review Time</h2>
            <p>Let’s Optimize Your Vision.</p>
          </div>
        ) : (
          <div
            className="project-view p-4 w-100"
            style={{ backgroundColor: "#d4dfff" }}
          >
            <h1 className="fw-bold">{selectedProject.title}</h1>
            <div className="project-id badge bg-secondary mb-3">
              {selectedProject.id}
            </div>
            {selectedProject.tasks.map((task) => (
              <div key={task.id} className="task-card card mb-3 shadow-sm">
                <div className="card-body d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <div className="task-icon me-3 fs-4">📋</div>
                    <div>
                      <strong>{task.id}</strong>
                      <p className="mb-0">{task.title}</p>
                    </div>
                  </div>
                  <div
                    className="task-status rounded-circle border"
                    style={{
                      backgroundColor: statusColors[task.status],
                      width: "20px",
                      height: "20px",
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewTasks;
