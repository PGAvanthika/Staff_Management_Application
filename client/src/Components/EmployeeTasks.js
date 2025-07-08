import React, { useEffect, useState } from "react";
import DueExtensionForm from "./DueExtensionForm";

function isOneDayBefore(dateStr) {
  const today = new Date();
  const due = new Date(dateStr);
  const diff = (due - today) / (1000 * 60 * 60 * 24);
  return diff > 0 && diff < 2;
}

// Helper to check if deadline is exceeded
function isOverdue(dateStr) {
  const now = new Date();
  const due = new Date(dateStr);
  return now > due;
}

const EmployeeTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [showDueExtensionForm, setShowDueExtensionForm] = useState(false);
  const [dueExtensionTask, setDueExtensionTask] = useState(null);

  const fetchTasks = () => {
    setLoading(true);
    fetch("http://localhost:3001/api/tasks/employee", { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch tasks");
        return res.json();
      })
      .then((data) => {
        setTasks(data);
        setError("");
      })
      .catch((err) => {
        setError("Failed to fetch tasks");
        setTasks([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  if (showDueExtensionForm && dueExtensionTask) {
    return (
      <DueExtensionForm
        due={{
          ...dueExtensionTask,
          emp_id: dueExtensionTask.assigned_to,
          tl_id: dueExtensionTask.assigned_by,
          project_id: dueExtensionTask.project_id,
          task_id: dueExtensionTask.task_id,
          to_manager: dueExtensionTask.assigned_by,
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
          fetchTasks(); // Refetch tasks after submission
        }}
        showSubmit={true}
        showSchedule={false}
        readOnly={false}
        onlyEditFields={["no_of_days", "reason"]}
      />
    );
  }

  if (selectedTask) {
    const showExtend = true; // Always allow extension request
    const hasPendingDue = selectedTask.has_pending_due_extension;
    const overdue = isOverdue(selectedTask.deadline);
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 w-100" style={{ backgroundColor: "#7d98a5" }}>
        <div className="bg-white p-5 rounded shadow-lg" style={{ width: "100%", maxWidth: "600px" }}>
          <h4 className="text-center mb-4 fw-bold text-primary">Task Details</h4>
          <div className="mb-2"><b>Project:</b> {selectedTask.project_name} ({selectedTask.project_id})</div>
          <div className="mb-2"><b>Description:</b> {selectedTask.description}</div>
          <div className="mb-2"><b>Deadline:</b> {selectedTask.deadline}</div>
          <div className="mb-2"><b>Status:</b> {selectedTask.task_status}</div>
          <div className="mb-2"><b>Assigned By:</b> {selectedTask.assigned_by_email}</div>
          {overdue && (
            <div className="alert alert-danger mt-2">This task is <b>overdue</b>!</div>
          )}
          {showExtend && !hasPendingDue && (
            <button
              className="btn btn-warning mt-3 me-2"
              onClick={() => {
                setDueExtensionTask(selectedTask);
                setShowDueExtensionForm(true);
              }}
            >
              Request Due Extension
            </button>
          )}
          {showExtend && hasPendingDue && (
            <div className="alert alert-info mt-3">Awaiting manager response for your previous due extension request.</div>
          )}
          <button className="btn btn-outline-secondary mt-3" onClick={() => setSelectedTask(null)}>
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-vh-100 w-100 py-4 px-2"
      style={{ backgroundColor: "#7d98a5" }}
    >
      <h2 className="text-center fw-bold mb-4" style={{ color: "#1d2b53" }}>
        YOUR TASKS
      </h2>
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : error ? (
        <div className="text-center text-danger">{error}</div>
      ) : tasks.length === 0 ? (
        <div className="rounded shadow p-3 mx-auto" style={{ backgroundColor: "#c7e8f3", width: "90%", maxWidth: "900px" }}>
          <div className="text-center">No tasks assigned to you.</div>
        </div>
      ) : (
        <div className="rounded shadow p-3 mx-auto" style={{ backgroundColor: "#c7e8f3", width: "90%", maxWidth: "900px" }}>
          {tasks.map((task, idx) => (
            <div
              key={task.task_id || idx}
              className="d-flex justify-content-between align-items-center p-3 mb-3 rounded"
              style={{ backgroundColor: "#e5f4f9", cursor: "pointer" }}
              onClick={() => setSelectedTask(task)}
            >
              <div>
                <div className="fw-bold">{task.project_name} ({task.project_id})</div>
                <div>Task: {task.description}</div>
                <div>Deadline: {task.deadline}</div>
              </div>
              <div className="fw-bold text-center">
                Status: {task.task_status}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployeeTasks; 