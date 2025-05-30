import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Add this import
import "bootstrap/dist/css/bootstrap.min.css";

const Logs = () => {
  const navigate = useNavigate(); // ✅ For back button functionality

  const [selectedTab, setSelectedTab] = useState("login");
  const [selectedDate, setSelectedDate] = useState("2025-05-30");

  const dates = ["2025-05-30", "2025-05-29", "2025-05-28", "2025-05-27"];

  const loginLogs = [
    { time: "10:17:12 AM", empId: "E123", log: "Login Successful" },
    { time: "10:20:01 AM", empId: "E124", log: "Login Failed" },
  ];

  const activityLogs = [
    { time: "10:25:45 AM", empId: "E123", activity: "Accessed dashboard" },
    { time: "10:30:00 AM", empId: "E125", activity: "Viewed reports" },
  ];

  return (
    <div className="container-fluid p-0">
      {/* Top navbar with back button and tab selector */}
      <nav className="navbar navbar-dark bg-dark d-flex align-items-center px-3">
        <ion-icon
          name="chevron-back-outline"
          style={{ cursor: "pointer", fontSize: "24px", color: "white" }}
          onClick={() => navigate(-1)}
          aria-label="Go back"
        ></ion-icon>

        <div className="btn-group mx-auto">
          <button
            className={`btn btn-outline-info ${
              selectedTab === "login" ? "active" : ""
            }`}
            onClick={() => setSelectedTab("login")}
          >
            Login Logs
          </button>
          <button
            className={`btn btn-outline-info ${
              selectedTab === "activity" ? "active" : ""
            }`}
            onClick={() => setSelectedTab("activity")}
          >
            Activity Logs
          </button>
        </div>
      </nav>

      <div className="row mt-4">
        <div className="col-md-3 border-end">
          <div className="list-group">
            {dates.map((date) => (
              <button
                key={date}
                className={`list-group-item list-group-item-action ${
                  selectedDate === date ? "active" : ""
                }`}
                onClick={() => setSelectedDate(date)}
              >
                {date}
              </button>
            ))}
          </div>
        </div>

        <div className="col-md-9 p-3">
          <table className="table table-hover table-bordered">
            <thead className="table-light">
              <tr>
                <th>Time</th>
                <th>Employee ID</th>
                <th>{selectedTab === "login" ? "Login Info" : "Activity"}</th>
              </tr>
            </thead>
            <tbody>
              {(selectedTab === "login" ? loginLogs : activityLogs).map(
                (log, index) => (
                  <tr key={index}>
                    <td>{log.time}</td>
                    <td>{log.empId}</td>
                    <td>{selectedTab === "login" ? log.log : log.activity}</td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Logs;
