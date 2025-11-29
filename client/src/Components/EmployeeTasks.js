import React, { useEffect, useState } from "react";
import DueExtensionForm from "./DueExtensionForm";
import "./TasksPage.css";

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

// Helper to get the correct team leader ID for a task
function getTeamLeaderId(task) {
  // If the task object has a team_leader_id, use it
  if (task.team_leader_id) return task.team_leader_id;
  // If assigned_by_role is available and is 'team_leader', use assigned_by
  if (task.assigned_by_role && task.assigned_by_role === 'team_leader') return task.assigned_by;
  // If assigned_by_email contains 'tl' or similar, you can add more logic here
  // Fallback: return empty string (should not default to employee's own ID)
  return '';
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
    const correctTlId = getTeamLeaderId(dueExtensionTask);
    return (
      <DueExtensionForm
        due={{
          ...dueExtensionTask,
          emp_id: dueExtensionTask.assigned_to,
          tl_id: correctTlId,
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

  const isOverdue = (dateStr, status) => {
    if (status && status.toLowerCase() === 'completed') return false;
    const due = new Date(dateStr);
    const now = new Date();
    return now > due;
  };

  const markCompleted = async (task) => {
    try {
      const url = `http://localhost:3001/api/tasks/${task.task_id}`;
      const res = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ task_status: 'completed' }),
      });
      if (!res.ok) throw new Error('Failed to update task');
      fetchTasks();
    } catch (e) {
      alert('Failed to mark task as completed');
    }
  };

  return (
    <div className="tasks-page">
      <div className="tasks-page-inner">
        <div className="tasks-page-header">
          <h2 className="tasks-page-title">Your Tasks</h2>
          <p className="tasks-page-subtitle">
            View all tasks assigned to you, mark them as completed, or request a due extension.
          </p>
          <div className="tasks-legend">
            <span className="tasks-legend-label">Legend:</span>
            <span className="tasks-legend-item">
              <span className="tasks-legend-dot" style={{ backgroundColor: "#e5e7eb" }} />
              assigned
            </span>
            <span className="tasks-legend-item">
              <span className="tasks-legend-dot" style={{ backgroundColor: "#bbf7d0" }} />
              completed
            </span>
            <span className="tasks-legend-item">
              <span className="tasks-legend-dot" style={{ backgroundColor: "#fecaca" }} />
              overdue
            </span>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-muted">Loading...</div>
        ) : error ? (
          <div className="text-center text-danger">{error}</div>
        ) : tasks.length === 0 ? (
          <div className="tasks-empty-card text-center">
            No tasks assigned to you.
          </div>
        ) : (
          <div className="tasks-card-list">
            {tasks.map((task, idx) => {
              const overdue = isOverdue(task.deadline, task.task_status);
              const isCompleted = (task.task_status || "").toLowerCase() === "completed";
              const statusLabel = overdue ? "Overdue" : isCompleted ? "Completed" : "Assigned";
              const statusClass = overdue
                ? "tasks-status-overdue"
                : isCompleted
                ? "tasks-status-completed"
                : "tasks-status-assigned";
              return (
                <div
                  key={task.task_id || idx}
                  className="tasks-card mb-3"
                  onClick={() => setSelectedTask(task)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="tasks-card-main">
                    <div className="tasks-card-project">
                      {task.project_name} ({task.project_id})
                    </div>
                    <div className="tasks-card-desc">Task: {task.description}</div>
                    <div className="tasks-card-deadline">
                      Deadline:{" "}
                      {task.deadline
                        ? new Date(task.deadline).toLocaleDateString()
                        : "N/A"}
                    </div>
                  </div>
                  <div className="tasks-card-right">
                    <span className={`tasks-status-pill ${statusClass}`}>
                      {statusLabel}
                    </span>
                    <button
                      className="btn btn-sm btn-success"
                      disabled={isCompleted}
                      onClick={(e) => {
                        e.stopPropagation();
                        markCompleted(task);
                      }}
                    >
                      Completed
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeTasks; 