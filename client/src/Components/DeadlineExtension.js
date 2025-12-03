// ✅ DeadlineExtensions.js
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import TaskDetailsCard from "./TaskDetails";
import { useNavigate } from "react-router-dom";
import DueExtensionForm from "./DueExtensionForm";
import "./TasksPage.css";

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
    fetch("/api/dues/teamleader/dues", { credentials: "include" })
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
    <div className="tasks-page">
      <div className="tasks-page-inner">
        <div className="tasks-page-header">
          <h2 className="tasks-page-title">{customHeading}</h2>
          <p className="tasks-page-subtitle">
            Review and act on deadline extension requests from your team.
          </p>
        </div>

        {loading ? (
          <div className="text-center text-muted">Loading...</div>
        ) : error ? (
          <div className="text-center text-danger">{error}</div>
        ) : !selectedTask ? (
          deadlineData.length === 0 ? (
            <div className="tasks-empty-card text-center">
              No deadline extensions found.
            </div>
          ) : (
            <div className="tasks-card-list">
              {deadlineData.map((item, index) => (
                <div
                  key={item.due_id || index}
                  className="tasks-card mb-3"
                >
                  <div className="tasks-card-main">
                    <div className="tasks-card-project">
                      {item.project_id || item.project} – {item.task_id || item.task}
                    </div>
                    <div className="tasks-card-desc">
                      Reason: {item.reason || item.label || "-"}
                    </div>
                    <div className="tasks-card-deadline">
                      Current deadline:{" "}
                      {item.current_deadline
                        ? new Date(item.current_deadline).toLocaleDateString()
                        : "N/A"}
                    </div>
                  </div>
                  <div className="tasks-card-right">
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => setSelectedTask(item)}
                    >
                      View details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
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
          <DueExtensionForm
            due={selectedTask}
            onClose={handleBack}
            onAction={handleBack}
            readOnly={false}
            showSubmit={false}
            showSchedule={false}
          />
          <button className="btn btn-outline-dark mt-3" onClick={handleBack}>
            Back
          </button>
        </div>
        )}
      </div>
    </div>
  );
};

export default DeadlineExtensions;
