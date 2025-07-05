import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Profile from "../../Components/Profile.js";
import DashboardUI from "../../Components/DashboardUI.js";
import DeadlineExtensions from "../../Components/DeadlineExtension.js";

import { useNavigate, Routes, Route, Navigate } from "react-router-dom";

const EmployeeHome = () => {
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();

  const handleLogOut = () => {
    // Just redirect to login page
    navigate("/");
  };

  const handleProfile = () => setShowProfile(true);
  const handleCloseProfile = () => setShowProfile(false);

  return (
    <div className="container-fluid p-0 m-0">
      <div className="d-flex">
        {/* Sidebar */}
        <div
          className="p-3 border-end d-flex flex-column justify-content-between"
          style={{
            width: "220px",
            backgroundColor: "#abcef5",
            position: "fixed",
            top: 0,
            bottom: 0,
            left: 0,
            overflowY: "auto",
            zIndex: 1000,
          }}
        >
          <div>
            {/* Profile Button */}
            <div className="text-center mb-4">
              <button
                className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center"
                onClick={handleProfile}
                style={{ height: "50px" }}
              >
                <ion-icon
                  name="person-circle-outline"
                  style={{ fontSize: "1.8rem" }}
                ></ion-icon>
              </button>
            </div>

            {/* Navigation */}
            <ul className="nav flex-column">
              <li className="nav-item border-bottom">
                <button
                  className="btn btn-link w-100 text-start d-flex align-items-center px-2 py-2"
                  onClick={() => navigate("/employeehome/dashboard")}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    fontWeight: "bold",
                  }}
                >
                  <ion-icon
                    name="home-outline"
                    style={{ fontSize: "1.5rem", marginRight: "10px" }}
                  ></ion-icon>
                  HOME
                </button>
              </li>
              <li className="nav-item border-bottom">
                <button
                  className="btn btn-link w-100 text-start d-flex align-items-center px-2 py-2"
                  onClick={() => navigate("/employeehome/tasks")}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    fontWeight: "bold",
                  }}
                >
                  <ion-icon
                    name="list-outline"
                    style={{ fontSize: "1.5rem", marginRight: "10px" }}
                  ></ion-icon>
                  YOUR TASKS
                </button>
              </li>
            </ul>
          </div>

          {/* Logout Button */}
          <div className="text-center mt-4">
            <button
              className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center"
              onClick={handleLogOut}
              style={{ height: "45px" }}
            >
              <ion-icon
                name="power-outline"
                style={{ fontSize: "1.5rem", color: "#dc3545" }}
              ></ion-icon>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div
          className="main-content-wrapper p-4"
          style={{
            marginLeft: "220px",
            height: "100vh",
            overflowY: "auto",
            overflowX: "hidden",
            backgroundColor: "#f8f9fa",
            flex: 1,
          }}
        >
          <Routes>
            <Route path="/" element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={<DashboardUI />} />
            <Route
              path="tasks"
              element={
                <DeadlineExtensions
                  isToDo={true}
                  customHeading="YOUR TASKS"
                  onExtendNavigate={(task) => {
                    console.log("Extend clicked for task", task);
                  }}
                />
              }
            />
          </Routes>
        </div>
      </div>

      {/* Profile Modal */}
      {showProfile && (
        <div
          onClick={handleCloseProfile}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1050,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Profile onClose={handleCloseProfile} />
        </div>
      )}
    </div>
  );
};

export default EmployeeHome;
