// src/pages/Logs.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const getRecentDates = (days = 4) => {
  const result = [];
  const today = new Date();

  for (let i = 0; i < days; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    result.push(d.toISOString().split("T")[0]);
  }

  return result;
};

const Logs = () => {
  const navigate = useNavigate();
  const [dates] = useState(getRecentDates());
  const [selectedDate, setSelectedDate] = useState(dates[0]);
  const [selectedTab, setSelectedTab] = useState("login");

  const [loginLogs, setLoginLogs] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const endpoint =
        selectedTab === "login"
          ? `http://13.49.158.152:3001/api/logs/login-logs/${selectedDate}`
          : `http://13.49.158.152:3001/api/logs/activity-logs/${selectedDate}`;

      try {
        const res = await axios.get(endpoint);
        if (selectedTab === "login") {
          setLoginLogs(res.data);
        } else {
          setActivityLogs(res.data);
        }
      } catch (err) {
        console.error(`Failed to fetch ${selectedTab} logs:`, err);
        if (selectedTab === "login") setLoginLogs([]);
        else setActivityLogs([]);
      }
    };

    fetchLogs();
  }, [selectedDate, selectedTab]);

  const displayedLogs = selectedTab === "login" ? loginLogs : activityLogs;

  return (
    <div className="container-fluid p-0">
      <nav className="navbar navbar-dark bg-dark d-flex align-items-center px-3">
        <ion-icon
          name="chevron-back-outline"
          style={{ cursor: "pointer", fontSize: "24px", color: "white" }}
          onClick={() => navigate(-1)}
          aria-label="Go back"
        ></ion-icon>

        <div className="btn-group mx-auto">
          <button
            className={`btn btn-outline-info ${selectedTab === "login" ? "active" : ""}`}
            onClick={() => setSelectedTab("login")}
          >
            Login Logs
          </button>
          <button
            className={`btn btn-outline-info ${selectedTab === "activity" ? "active" : ""}`}
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
                className={`list-group-item list-group-item-action ${selectedDate === date ? "active" : ""}`}
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
              {displayedLogs.length > 0 ? (
                displayedLogs.map((log, index) => (
                  <tr key={index}>
                    <td>{log.time}</td>
                    <td>{log.emp_id}</td>
                    <td>
                      {selectedTab === "login"
                        ? `${log.log_type.toUpperCase()} - ${log.status}`
                        : log.activity}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center">
                    No logs found for this date.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Logs;
