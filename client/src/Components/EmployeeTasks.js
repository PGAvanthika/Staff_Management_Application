import React, { useEffect, useState } from "react";
import DueExtensionForm from "./DueExtensionForm";

function isOneDayBefore(dateStr) {
  const today = new Date();
  const due = new Date(dateStr);
  const diff = (due - today) / (1000 * 60 * 60 * 24);
  return diff > 0 && diff < 2;
}

// Helper to check if task can have due extension
function canRequestDueExtension(task) {
  // Don't allow if task is already completed
  if (task.task_status === 'completed' || task.task_status === 'completed_overdue') return false;
  
  // Don't allow if there's already an approved due extension
  if (task.has_approved_due_extension) return false;
  
  // Don't allow if there's already a pending due extension
  if (task.has_pending_due_extension) return false;
  
  // Only allow if deadline is within 1 day or overdue
  const today = new Date();
  const effectiveDeadline = new Date(task.effective_deadline || task.deadline);
  const diff = (effectiveDeadline - today) / (1000 * 60 * 60 * 24);
  
  return diff <= 1; // Allow if due today, tomorrow, or overdue
}

// Helper to check if deadline is exceeded
function isOverdue(dateStr) {
  const now = new Date();
  const due = new Date(dateStr);
  return now > due;
}

// Helper to get the correct team leader ID for a task
function getTeamLeaderId(task) {
  console.log('Getting team leader ID for task:', task);
  
  // If the task object has a team_leader_id, use it
  if (task.team_leader_id) {
    console.log('Using team_leader_id:', task.team_leader_id);
    return task.team_leader_id;
  }
  
  // If assigned_by_role is available and is 'team_leader', use assigned_by
  if (task.assigned_by_role && task.assigned_by_role === 'team_leader') {
    console.log('Using assigned_by as team leader:', task.assigned_by);
    return task.assigned_by;
  }
  
  // If assigned_by_email contains 'tl' or similar, you can add more logic here
  if (task.assigned_by_email && task.assigned_by_email.toLowerCase().includes('tl')) {
    console.log('Using assigned_by_email as team leader:', task.assigned_by);
    return task.assigned_by;
  }
  
  // For now, use the assigned_by as fallback (assuming it's the team leader)
  // This is a temporary fix - ideally we should have proper team leader assignment
  console.log('Using assigned_by as fallback team leader:', task.assigned_by);
  return task.assigned_by || '';
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
    console.log('DueExtensionTask data:', dueExtensionTask);
    console.log('Correct TL ID:', correctTlId);
    
    const dueData = {
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
    };
    
    console.log('Due data being passed to form:', dueData);
    
    return (
      <DueExtensionForm
        due={dueData}
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
    const overdue = selectedTask.is_overdue;
    const canExtend = canRequestDueExtension(selectedTask);
    const hasPendingDue = selectedTask.has_pending_due_extension;
    const hasApprovedDue = selectedTask.has_approved_due_extension;
    const isCompleted = selectedTask.task_status === 'completed' || selectedTask.task_status === 'completed_overdue';
    const canComplete = selectedTask.can_be_completed;
    
    const handleCompleteTask = async () => {
      const confirmMessage = selectedTask.is_overdue 
        ? 'This task is overdue. Completing it now will affect your KPI score. Are you sure you want to continue?'
        : 'Are you sure you want to mark this task as completed? This action cannot be undone.';
      
      if (window.confirm(confirmMessage)) {
        try {
          const response = await fetch(`http://localhost:3001/api/tasks/${selectedTask.task_id}/complete`, {
            method: 'PUT',
            credentials: 'include',
          });
          
          if (response.ok) {
            const result = await response.json();
            if (result.penaltyApplied) {
              alert('Task completed but with penalty due to overdue completion. This will affect your KPI score.');
            } else {
              alert('Task completed successfully!');
            }
            fetchTasks(); // Refresh the task list
            setSelectedTask(null); // Close the task details
          } else {
            const data = await response.json();
            alert(data.message || 'Failed to complete task');
          }
        } catch (error) {
          console.error('Error completing task:', error);
          alert('Failed to complete task');
        }
      }
    };
    
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
            <div className="alert alert-info mt-2">Your due extension request has been <b>approved</b>!</div>
          )}
          
          {/* Complete Task Button - Only show if can be completed */}
          {canComplete && (
            <button
              className={`btn mt-3 me-2 ${selectedTask.is_overdue ? 'btn-warning' : 'btn-success'}`}
              onClick={handleCompleteTask}
            >
              {selectedTask.is_overdue ? 'Complete (With Penalty)' : 'Mark as Completed'}
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
          {canExtend && (
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
          
          {/* Show appropriate messages for due extension status */}
          {hasPendingDue && (
            <div className="alert alert-info mt-3">Awaiting manager response for your due extension request.</div>
          )}
          
          {!canExtend && !hasPendingDue && !hasApprovedDue && !isCompleted && (
            <div className="alert alert-info mt-3">Due extension can only be requested 1 day before deadline or when overdue.</div>
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
                {task.has_approved_due_extension && (
                  <small className="text-success">Due extension approved</small>
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

export default EmployeeTasks; 