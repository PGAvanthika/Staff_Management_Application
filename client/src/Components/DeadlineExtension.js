// ✅ DeadlineExtensions.js
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import TaskDetailsCard from "./TaskDetails";
import { useNavigate } from "react-router-dom";

const deadlineData = [
  {
    project: "prj123",
    task: "Tsk113",
    label: "prototype",
    dueDate: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
    assignedBy: "ManagerA",
    description: "Complete prototype integration.",
  },
  {
    project: "prj123",
    task: "Tsk116",
    label: "prototype",
    dueDate: new Date(Date.now() + 30 * 60 * 60 * 1000).toISOString(),
    assignedBy: "ManagerB",
    description: "Design UI for prototype module.",
  },
  {
    project: "prj121",
    task: "Tsk118",
    label: "prototype",
    dueDate: new Date(Date.now() + 10 * 60 * 60 * 1000).toISOString(),
    assignedBy: "ManagerC",
    description: "Build API for prototype data.",
  },
  {
    project: "prj124",
    task: "Tsk173",
    label: "prototype",
    dueDate: new Date(Date.now() + 26 * 60 * 60 * 1000).toISOString(),
    assignedBy: "ManagerD",
    description: "Test prototype flow.",
  },
];

const DeadlineExtensions = ({
  customHeading = "DEADLINE EXTENSIONS",
  isToDo = false,
  onExtendNavigate,
}) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [showExtensionForm, setShowExtensionForm] = useState(false);
  const navigate = useNavigate();

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

      {!selectedTask ? (
        <div
          className="rounded shadow p-3 mx-auto"
          style={{
            backgroundColor: "#c7e8f3",
            width: "90%",
            maxWidth: "900px",
          }}
        >
          {deadlineData.map((item, index) => (
            <div
              key={index}
              className="d-flex justify-content-between align-items-center p-3 mb-3 rounded"
              style={{ backgroundColor: "#e5f4f9" }}
            >
              <div className="fw-bold">
                {item.project}
                <br />
                {item.task}
              </div>
              <div className="fw-bold text-center">{item.label}</div>
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
                  view
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : showExtensionForm ? (
        <div className="w-100 d-flex flex-column align-items-center">
          <div
            className="bg-white p-4 rounded shadow"
            style={{ maxWidth: "600px" }}
          >
            <h4 className="text-center mb-3">Deadline Extension Form</h4>
            <p>
              Task: <strong>{selectedTask.task}</strong>
            </p>
            <p>
              Project: <strong>{selectedTask.project}</strong>
            </p>
            <label>Reason for Extension:</label>
            <textarea className="form-control mb-3" rows="3" />
            <button
              className="btn btn-success me-2"
              onClick={() => {
                alert("Extension Request Submitted");
                handleBack();
              }}
            >
              Submit Request
            </button>
            <button className="btn btn-secondary" onClick={handleBack}>
              Back
            </button>
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
