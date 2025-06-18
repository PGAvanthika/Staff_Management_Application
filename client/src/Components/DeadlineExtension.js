import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import TaskDetailsCard from "./TaskDetails";

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

const DeadlineExtensions = () => {
  const [selectedTask, setSelectedTask] = useState(null);

  return (
    <div
      className="min-vh-100 d-flex flex-column align-items-center py-4"
      style={{ backgroundColor: "#7d98a5" }}
    >
      <h2 className="text-center fw-bold mb-4" style={{ color: "#1d2b53" }}>
        DEADLINE EXTENSIONS
      </h2>

      {!selectedTask ? (
        <div
          className="rounded shadow p-3"
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
                  className="btn"
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
      ) : (
        <div className="w-100 d-flex flex-column align-items-center">
          <TaskDetailsCard
            task={selectedTask}
            showSubmit={false}
            showExtend={true}
            showApprove={true}
            showDecline={true}
          />
          <button
            className="btn btn-outline-dark mt-3"
            onClick={() => setSelectedTask(null)}
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
};

export default DeadlineExtensions;
