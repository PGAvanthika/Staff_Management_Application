import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Card } from "react-bootstrap";
import { Doughnut, Bar, Line } from "react-chartjs-2";
import Profile from "../Components/Profile";
import TaskAllocation from "../Components/TaskAllocation";

import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

const ManagerHome = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");

  const handleLogOut = () => {
    window.location.href = "/";
  };

  const handleProfile = () => {
    setShowProfile(true);
  };

  const handleCloseProfile = () => {
    setShowProfile(false);
  };

  const doughnutData = {
    labels: ["Completed", "Remaining"],
    datasets: [
      {
        data: [78, 22],
        backgroundColor: ["#007bff", "#e9ecef"],
        borderWidth: 1,
      },
    ],
  };

  const barData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Daily Performance",
        data: [20, 35, 45, 60, 80, 65, 50],
        backgroundColor: "#6c757d",
      },
    ],
  };

  const lineData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Tasks Completed",
        data: [10, 20, 30, 40, 50, 60, 70, 85, 75, 80, 70, 65],
        fill: false,
        borderColor: "#007bff",
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="container-fluid p-0 m-0">
      <div className="d-flex">
        {/* Fixed Sidebar */}
        <div
          className="p-3 border-end"
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
          <ul className="nav flex-column mt-4">
            <li className="mb-3 text-center">
              <button
                className="btn btn-outline-primary"
                onClick={handleProfile}
              >
                <ion-icon
                  name="person-circle-outline"
                  style={{ fontSize: "1.8rem" }}
                ></ion-icon>
              </button>
            </li>
            {[
              { label: "HOME", key :"dashboard" },
              { label: "TASK ALLOCATION", key: "taskAllocation" },
              { label: "REVIEW" },
              { label: "TEAM PERFORMANCE" },
              { label: "PAY ROLL SLIP" },
              { label: "DUE EXTENSIONS" },
              { label: "YOUR TASKS" },
            ].map((item, index) => (
              <li
                className="nav-item py-2 border-bottom"
                key={index}
                style={{
                  fontWeight: "bold",
                  cursor: item.key ? "pointer" : "default",
                }}
                onClick={() => item.key && setCurrentPage(item.key)}
              >
                {item.label}
              </li>
            ))}
          </ul>
        </div>

        {/* Scrollable Main Content */}
        <div
          className="p-4"
          style={{
            marginLeft: "220px",
            height: "100vh",
            overflowY: "auto",
            width: "100%",
            backgroundColor: "#f8f9fa",
          }}
        >
          {/* Logout Button */}
          <div className="d-flex justify-content-end mb-4">
            <button className="btn btn-light shadow-sm" onClick={handleLogOut}>
              <ion-icon
                name="power-outline"
                style={{ fontSize: "1.8rem", color: "#dc3545" }}
              ></ion-icon>
            </button>
          </div>

          {/* Content Switcher */}
          {currentPage === "dashboard" && (
            <>
              {/* Weekly Summary */}
              <div className="row g-3 mb-4">
                <div className="col-md-3">
                  <Card className="p-3 text-center shadow-sm">
                    <div>
                      <strong>28</strong>
                      <br />
                      Tasks Completed
                    </div>
                  </Card>
                </div>
                <div className="col-md-3">
                  <Card className="p-3 text-center shadow-sm">
                    <div>
                      <strong>5</strong>
                      <br />
                      Tasks Overdue
                    </div>
                  </Card>
                </div>
                <div className="col-md-3">
                  <Card className="p-3 text-center shadow-sm">
                    <div>
                      <strong>$12.5k</strong>
                      <br />
                      Sales
                    </div>
                  </Card>
                </div>
                <div className="col-md-3">
                  <Card className="p-3 text-center shadow-sm">
                    <div>
                      <strong>15</strong>
                      <br />
                      Meetings
                    </div>
                  </Card>
                </div>
              </div>

              {/* Performance Charts */}
              <div className="row g-3 mb-4">
                <div className="col-md-4">
                  <Card className="text-center shadow-sm p-3">
                    <h5>OVERALL PERFORMANCE</h5>
                    <div className="my-3">
                      <Doughnut data={doughnutData} />
                    </div>
                  </Card>
                </div>
                <div className="col-md-8">
                  <Card className="shadow-sm p-3">
                    <h5 className="text-center">DAILY PERFORMANCE</h5>
                    <Bar data={barData} />
                  </Card>
                </div>
              </div>

              {/* Monthly Graph */}
              <Card className="shadow-sm p-3">
                <h5 className="text-center mb-3">Monthly Task Trends</h5>
                <Line data={lineData} />
              </Card>
            </>
          )}

          {currentPage === "taskAllocation" && <TaskAllocation />}
          {/* Future routes like Review can go here */}
        </div>
      </div>

      {/* Profile Overlay */}
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

export default ManagerHome;
