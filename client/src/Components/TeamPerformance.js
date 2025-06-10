import React, { useState } from "react";
import DashboardUI from "../Components/DashboardUI";
import "./TeamPerformance.css";

const projectData = {
  "STAFF MANAGEMENT": [
    { name: "Yuthish", role: "cybersecurity enthusiast", image: null },
    { name: "Yuthish", role: "cybersecurity enthusiast", image: null },
  ],
  "CHAT BOT": [
    { name: "Priya", role: "AI engineer", image: null },
    { name: "Kumar", role: "NLP expert", image: null },
  ],
  "ATTENDANCE APP": [
    { name: "Arun", role: "Frontend Dev", image: null },
    { name: "Sneha", role: "Backend Dev", image: null },
  ],
  CLRA: [{ name: "Deepak", role: "Data Analyst", image: null }],
  "IT TICKETING": [
    { name: "Meera", role: "Support Lead", image: null },
    { name: "Vikram", role: "System Admin", image: null },
    { name: "John", role: "Ticketing Expert", image: null },
  ],
};

const TeamPerformance = () => {
  const projectNames = Object.keys(projectData);
  const [selectedProject, setSelectedProject] = useState(projectNames[0]);
  const [showDashboardUI, setShowDashboardUI] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null); // New state

  return (
    <div className="container-fluid vh-100 d-flex p-0">
      {/* Sidebar */}
      <div className="sidebar bg-white border-end p-3 d-flex flex-column">
        {projectNames.map((name) => (
          <div
            key={name}
            className={`menu-item px-3 py-2 fw-bold text-start ${
              selectedProject === name ? "active" : ""
            }`}
            onClick={() => {
              setSelectedProject(name);
              setShowDashboardUI(false);
              setSelectedStaff(null);
            }}
          >
            {name}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="main-content flex-grow-1 bg-custom p-4 overflow-auto">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold m-0 d-flex align-items-center gap-2">
            {showDashboardUI && (
              <span
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setShowDashboardUI(false);
                  setSelectedStaff(null);
                }}
              >
                <ion-icon name="chevron-back-outline"></ion-icon>
              </span>
            )}
            {showDashboardUI && selectedStaff
              ? selectedStaff.name
              : selectedProject}
          </h2>
          <div className="badge rounded-pill bg-white shadow-sm px-3 py-2 text-primary">
            PRJ{1000 + projectNames.indexOf(selectedProject)}
          </div>
        </div>

        {/* Conditional Content */}
        {showDashboardUI && selectedStaff ? (
          <DashboardUI staff={selectedStaff} />
        ) : (
          <div className="row g-4">
            {projectData[selectedProject].map((staff, idx) => (
              <div key={idx} className="col-6 col-md-4 col-lg-3">
                <div
                  className="card text-center p-3 staff-card shadow-sm"
                  onClick={() => {
                    setSelectedStaff(staff);
                    setShowDashboardUI(true);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  {staff.image ? (
                    <img
                      src={staff.image}
                      alt={staff.name}
                      className="rounded-circle mx-auto staff-img"
                    />
                  ) : (
                    <div className="rounded-circle mx-auto staff-img bg-secondary d-flex align-items-center justify-content-center text-white">
                      <span style={{ fontSize: "1.5rem" }}>Img</span>
                    </div>
                  )}
                  <h5 className="mt-3 mb-1 fw-bold">{staff.name}</h5>
                  <p className="text-muted small">{staff.role}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamPerformance;
