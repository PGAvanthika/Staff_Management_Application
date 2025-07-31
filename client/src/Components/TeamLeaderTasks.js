import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

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

const TeamLeaderTasks = ({ onRequestDueExtension }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [completingTask, setCompletingTask] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3001/api/tasks/teamleader", { credentials: "include" })
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
  }, []);

  const handleCompleteTask = async () => {
    if (!window.confirm('Are you sure you want to mark this task as completed?')) {
      return;
    }

    setCompletingTask(true);
    try {
      const response = await fetch(`http://localhost:3001/api/tasks/${selectedTask.task_id}/complete`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ employeeId: selectedTask.assigned_to }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message || 'Task completed successfully!');
        setSelectedTask(null);
        // Refresh tasks
        window.location.reload();
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to complete task');
      }
    } catch (error) {
      console.error('Error completing task:', error);
      alert('Failed to complete task');
    } finally {
      setCompletingTask(false);
    }
  };

  if (selectedTask) {
    const showExtend = true; // Always allow extension request
    const hasPendingDue = selectedTask.has_pending_due_extension;
    const hasApprovedDue = selectedTask.has_approved_due_extension;
    const hasRejectedDue = selectedTask.has_rejected_due_extension;
    const overdue = isOverdue(selectedTask.effective_deadline || selectedTask.deadline);
    const isCompleted = selectedTask.task_status === 'completed' || selectedTask.task_status === 'completed_overdue';
    
    // Check if task can be completed
    const canComplete = selectedTask.can_be_completed && !isCompleted;
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 w-100" style={{ backgroundColor: "#7d98a5" }}>
        <div className="bg-white p-5 rounded shadow-lg" style={{ width: "100%", maxWidth: "600px" }}>
          <h4 className="text-center mb-4 fw-bold text-primary">Task Details</h4>
          <div className="mb-2"><b>Project:</b> {selectedTask.project_name} ({selectedTask.project_id})</div>
          <div className="mb-2"><b>Description:</b> {selectedTask.description}</div>
          <div className="mb-2"><b>Original Deadline:</b> {selectedTask.deadline}</div>
          {selectedTask.effective_deadline && selectedTask.effective_deadline !== selectedTask.deadline && (
            <div className="mb-2"><b>Extended Deadline:</b> {new Date(selectedTask.effective_deadline).toLocaleDateString()}</div>
          )}
          <div className="mb-2"><b>Status:</b> {selectedTask.task_status}</div>
          <div className="mb-2"><b>Assigned By:</b> {selectedTask.assigned_by_email}</div>
          
          {overdue && !isCompleted && (
            <div className="alert alert-danger mt-2">This task is <b>overdue</b>!</div>
          )}
          
          {isCompleted && (
            <div className="alert alert-success mt-2">
              This task is <b>completed</b>!
              {selectedTask.task_status === 'completed_overdue' && (
                <span className="text-warning"> (Completed with penalty)</span>
              )}
            </div>
          )}
          
          {hasApprovedDue && (
            <div className="alert alert-success mt-2">Your due extension request has been <b>approved</b>!</div>
          )}
          
          {hasRejectedDue && (
            <div className="alert alert-danger mt-2">Your due extension request has been <b>rejected</b>. No further extensions allowed.</div>
          )}
          
          {selectedTask.has_escalated_due_extension && (
            <div className="alert alert-info mt-2">Your due extension request has been <b>escalated to manager</b> for approval.</div>
          )}
          
          {/* Complete Task Button - Only show if can be completed */}
          {canComplete && (
            <button
              className={`btn mt-3 me-2 ${selectedTask.is_overdue ? 'btn-warning' : 'btn-success'}`}
              onClick={handleCompleteTask}
              disabled={completingTask}
            >
              {completingTask ? 'Completing...' : (selectedTask.is_overdue ? 'Complete (With Penalty)' : 'Mark as Completed')}
            </button>
          )}
          
          {/* Show message when task cannot be completed */}
          {!canComplete && !isCompleted && (
            <div className="alert alert-warning mt-3">
              This task cannot be completed at this time. 
              {overdue && !hasApprovedDue && ' It is overdue and requires a due extension approval.'}
            </div>
          )}
          
          {/* Due Extension Button - Only show if conditions are met */}
          {showExtend && !hasPendingDue && !hasRejectedDue && !selectedTask.has_escalated_due_extension && (
            <button
              className="btn btn-warning mt-3 me-2"
              onClick={() => onRequestDueExtension && onRequestDueExtension(selectedTask)}
            >
              Request Due Extension
            </button>
          )}
          
          {/* Show appropriate messages for due extension status */}
          {hasPendingDue && (
            <div className="alert alert-info mt-3">Awaiting manager response for your due extension request.</div>
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
                <div>Status: {task.task_status}</div>
                {task.has_pending_due_extension && (
                  <small className="text-warning">Due extension pending</small>
                )}
                {task.has_escalated_due_extension && (
                  <small className="text-info">Due extension escalated to manager</small>
                )}
                {task.has_approved_due_extension && (
                  <small className="text-success">Due extension approved</small>
                )}
                {task.has_rejected_due_extension && (
                  <small className="text-danger">Due extension rejected</small>
                )}
                {task.is_overdue && task.task_status !== 'completed' && task.task_status !== 'completed_overdue' && (
                  <small className="text-danger">Overdue</small>
                )}
                {task.task_status === 'completed_overdue' && (
                  <small className="text-warning">Completed with penalty</small>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamLeaderTasks; 