// ✅ DeadlineExtensions.js
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import TaskDetailsCard from "./TaskDetails";
import { useNavigate } from "react-router-dom";

const DeadlineExtensions = ({
  customHeading = "DEADLINE EXTENSIONS",
  isToDo = false,
  onExtendNavigate,
}) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [showExtensionForm, setShowExtensionForm] = useState(false);
  const [deadlineData, setDeadlineData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3001/api/dues/teamleader/dues", { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch deadline extensions");
        return res.json();
      })
      .then((data) => {
        setDeadlineData(data);
        setError("");
      })
      .catch((err) => {
        setError("Failed to fetch deadline extensions");
        setDeadlineData([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleExtendClick = (task) => {
    setShowExtensionForm(true);
  };

  const handleBack = () => {
    setSelectedTask(null);
    setShowExtensionForm(false);
  };

  return (
    <div
      className="min-vh-100 w-100 py-4 px-2"
      style={{ backgroundColor: "#7d98a5" }}
    >
      <h2 className="text-center fw-bold mb-4" style={{ color: "#1d2b53" }}>
        {customHeading}
      </h2>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : error ? (
        <div className="text-center text-danger">{error}</div>
      ) : !selectedTask ? (
        <div
          className="rounded shadow p-3 mx-auto"
          style={{
            backgroundColor: "#c7e8f3",
            width: "90%",
            maxWidth: "900px",
          }}
        >
          {deadlineData.length === 0 ? (
            <div className="text-center">No deadline extensions found.</div>
          ) : (
            deadlineData.map((item, index) => (
              <div
                key={item.due_id || index}
                className="d-flex justify-content-between align-items-center p-3 mb-3 rounded"
                style={{ backgroundColor: "#e5f4f9" }}
              >
                <div className="fw-bold">
                  {item.project_id || item.project}
                  <br />
                  {item.task_id || item.task}
                </div>
                <div className="fw-bold text-center">{item.label || item.reason || "-"}</div>
                <div className="text-end">
                  <button
                    className="btn me-2"
                    style={{
                      backgroundColor: "#93b6c3",
                      color: "#000",
                      fontWeight: "bold",
                    }}
                    onClick={() => setSelectedTask(item)}
                  >
                    View
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : showExtensionForm ? (
        <div
          className="d-flex justify-content-center align-items-center w-100"
          style={{ minHeight: "80vh" }}
        >
          <div
            className="bg-white p-5 rounded shadow-lg"
            style={{ width: "100%", maxWidth: "600px" }}
          >
            <h4 className="text-center mb-4 fw-bold text-primary">
              Deadline Extension Form
            </h4>

            <div className="mb-3">
              <label className="form-label">Task</label>
              <input
                type="text"
                className="form-control"
                value={selectedTask.task}
                disabled
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Project</label>
              <input
                type="text"
                className="form-control"
                value={selectedTask.project}
                disabled
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Reason for Extension</label>
              <textarea
                className="form-control"
                rows="4"
                placeholder="e.g. Task dependencies delayed, resource unavailable..."
              ></textarea>
            </div>

            <div className="d-flex justify-content-between">
              <button
                className="btn btn-success px-4"
                onClick={() => {
                  alert("Extension Request Submitted");
                  handleBack();
                }}
              >
                Submit Request
              </button>
              <button
                className="btn btn-outline-secondary px-4"
                onClick={handleBack}
              >
                Back
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-100 d-flex flex-column align-items-center">
          <TaskDetailsCard
            task={selectedTask}
            showSubmit={isToDo}
            showExtend={isToDo}
            showApprove={!isToDo}
            showDecline={!isToDo}
            onExtendClick={() => handleExtendClick(selectedTask)}
            onAction={handleBack}
          />
          <button className="btn btn-outline-dark mt-3" onClick={handleBack}>
            Back
          </button>
        </div>
      )}
    </div>
  );
};

export default DeadlineExtensions;
