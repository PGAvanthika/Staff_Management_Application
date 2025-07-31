import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Profile from "../Components/Profile";
import TaskAllocation from "../Components/TaskAllocation";
import ReviewTasks from "../Components/ReviewTasks";
import TeamPerformance from "../Components/TeamPerformance";
import DashboardUI from "../Components/DashboardUI";
import ManagerDueExtensions from "../Components/ManagerDueExtensions.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DeadlineExtensions from "../Components/DeadlineExtension.js";
import DueExtensionForm from "../Components/DueExtensionForm.js";
import TeamLeaderTasks from "../Components/TeamLeaderTasks";
import TaskHistory from "../Components/TaskHistory";
import TeamLeaderDueHistory from "../Components/TeamLeaderDueHistory";
import { useAuth } from "../context/AuthContext";

const Tlhome = () => {
  const { user } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const [currentPage, setCurrentPage] = useState("DashboardUI");
  const [selectedDue, setSelectedDue] = useState(null); // NEW STATE
  const [dueExtensionTask, setDueExtensionTask] = useState(null);
  const [showDueExtensionForm, setShowDueExtensionForm] = useState(false);
  const navigate = useNavigate();

  // Role-based access control
  useEffect(() => {
    axios
      .get("http://localhost:3001/api/auth/validate", { withCredentials: true })
      .then((res) => {
        if (!res.data.user || res.data.user.role !== "team_leader") {
          alert("Access denied. Please log in with a Team Leader account.");
          navigate("/");
        }
      })
      .catch(() => {
        alert("Please log in to continue.");
        navigate("/");
      });
  }, [navigate]);

  const handleLogOut = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok || response.status === 401) {
        window.location.href = "/";
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      window.location.href = "/";
    }
  };

  const handleProfile = () => setShowProfile(true);
  const handleCloseProfile = () => setShowProfile(false);

  const navItems = [
    { label: "HOME", key: "DashboardUI", icon: "home-outline" },
    {
      label: "TASK ALLOCATION",
      key: "taskAllocation",
      icon: "clipboard-outline",
    },
    { label: "REVIEW", key: "ReviewTasks", icon: "eye-outline" },
    {
      label: "TEAM PERFORMANCE",
      key: "TeamPerformance",
      icon: "people-outline",
    },
    {
      label: "DUE EXTENSIONS REQUEST",
      key: "DeadlineExtensions",
      icon: "alarm-outline",
    },
    {
      label: "DUE EXTENSION FORM",
      key: "ManagerDueExtension",
      icon: "time-outline",
    },
    { label: "YOUR TASKS", key: "ToDo", icon: "list-outline" },
    { label: "TASK HISTORY", key: "TaskHistory", icon: "time-outline" },
    { label: "DUE EXTENSION HISTORY", key: "TeamLeaderDueHistory", icon: "time-outline" },
  ];

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
            <ul className="nav flex-column">
              {navItems.map((item, index) => (
                <li className="nav-item border-bottom" key={index}>
                  <button
                    className="btn btn-link w-100 text-start d-flex align-items-center px-2 py-2"
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      fontWeight: "bold",
                      cursor: item.key ? "pointer" : "default",
                    }}
                    onClick={() => item.key && setCurrentPage(item.key)}
                  >
                    <ion-icon
                      name={item.icon}
                      style={{ fontSize: "1.5rem", marginRight: "10px" }}
                    ></ion-icon>
                    {item.label}
                  </button>
                </li>
              ))}
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
          {currentPage === "DashboardUI" && <DashboardUI />}
          {currentPage === "taskAllocation" && <TaskAllocation />}
          {currentPage === "ReviewTasks" && <ReviewTasks />}
          {currentPage === "TeamPerformance" && <TeamPerformance />}
          {currentPage === "ToDo" && (
            showDueExtensionForm && dueExtensionTask ? (
              <DueExtensionForm
                due={{
                  ...dueExtensionTask,
                  emp_id: dueExtensionTask.assigned_to,
                  tl_id: user?.id || '',
                  project_id: dueExtensionTask.project_id,
                  task_id: dueExtensionTask.task_id,
                  to_manager: 'E01', // Send to manager E01 (avanthikapg22@gmail.com)
                  no_of_days: '',
                  reason: '',
                  status: 'pending',
                  due_date: dueExtensionTask.deadline,
                }}
                onClose={() => {
                  setShowDueExtensionForm(false);
                  setDueExtensionTask(null);
                }}
                onAction={() => {
                  setShowDueExtensionForm(false);
                  setDueExtensionTask(null);
                }}
                showSubmit={true}
                showSchedule={false}
                readOnly={false}
                onlyEditFields={["no_of_days", "reason"]}
              />
            ) : (
              <TeamLeaderTasks
                onRequestDueExtension={(task) => {
                  setDueExtensionTask(task);
                  setShowDueExtensionForm(true);
                }}
              />
            )
          )}

          {currentPage === "DeadlineExtensions" && (
            <DeadlineExtensions
              customHeading="DEADLINE EXTENSIONS"
              onNavigate={(dueItem) => {
                setSelectedDue(dueItem);
                setCurrentPage("ManagerDueExtension");
              }}
            />
          )}

          {currentPage === "ManagerDueExtension" && (
            <DueExtensionForm
              due={selectedDue || {
                due_id: "NEW",
                emp_id: "",
                tl_id: "",
                project_id: "",
                task_id: "",
                no_of_days: "",
                reason: "",
                status: "pending",
                to_manager: ""
              }}
              onClose={() => setCurrentPage("DashboardUI")}
              onAction={() => {
                setCurrentPage("DashboardUI");
                setSelectedDue(null);
              }}
              showSubmit={true}
              showSchedule={true}
              readOnly={false}
            />
          )}

          {currentPage === "DueExtensionForm" && (
            <DueExtensionForm
              due={selectedDue || {
                due_id: "NEW",
                emp_id: "",
                tl_id: "",
                project_id: "",
                task_id: "",
                no_of_days: "",
                reason: "",
                status: "pending",
                to_manager: ""
              }}
              onClose={() => setCurrentPage("DashboardUI")}
              onAction={() => {
                setCurrentPage("DashboardUI");
                setSelectedDue(null);
              }}
              showSubmit={true}
              showSchedule={true}
              readOnly={false}
            />
          )}

          {currentPage === "TaskHistory" && <TaskHistory />}
          
          {currentPage === "TeamLeaderDueHistory" && <TeamLeaderDueHistory />}
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

export default Tlhome;
