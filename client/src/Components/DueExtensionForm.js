import React, { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./DueExtensionForm.css";
import DueIllstration from "../Assets/deadline_img-removebg-preview.png";
import { useAuth } from '../context/AuthContext';
import axios from "axios";

// Helper to check if a date string is valid
function isValidDateString(dateStr) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  return d instanceof Date && !isNaN(d);
}

// Helper to get display value for a field
function getDisplayValue(value, readOnly) {
  if (readOnly) return value || 'N/A';
  return value || '';
}

const DueExtensionForm = ({
  due,
  onClose,
  onAction,
  onNavigateBack,
  showSubmit,
  showSchedule,
  readOnly = false,
  onlyEditFields = null,
}) => {
  const modalRef = useRef();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [reason, setReason] = useState(due.reason || "");
  const [noOfDays, setNoOfDays] = useState(due.no_of_days || "");
  const [empId, setEmpId] = useState(due.emp_id || "");
  const { user } = useAuth();
  const [tlId, setTlId] = useState(due.tl_id || "");
  const [projectId, setProjectId] = useState(due.project_id || "");
  const [taskId, setTaskId] = useState(due.task_id || "");
  const [toManager, setToManager] = useState(due.to_manager || "");
  const [dueDate, setDueDate] = useState(
    isValidDateString(due.due_date) ? new Date(due.due_date).toISOString().split('T')[0] : ""
  );
  const [scheduledTime, setScheduledTime] = useState("");
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [teamLeaders, setTeamLeaders] = useState([]);

  console.log('Raw due.due_date:', due.due_date, '| Computed dueDate:', dueDate);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        if (onNavigateBack) onNavigateBack();
        else onClose();
      }
    };
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        if (onNavigateBack) onNavigateBack();
        else onClose();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [onClose, onNavigateBack]);

  useEffect(() => {
    // Fetch all team leaders for dropdown
    axios.get("/api/users/all", { withCredentials: true })
      .then(res => {
        const tls = res.data.filter(u => u.role === "team_leader");
        console.log('Fetched team leaders:', tls); // Debug log
        setTeamLeaders(tls);
      })
      .catch(() => setTeamLeaders([]));
  }, [onClose, onNavigateBack]);

  const handleAction = async (status) => {
    setMessage("");
    setError("");
    setLoading(true);
    try {
      let endpoint = "";
      let statusPayload = status;
      if (user?.role === "team_leader") {
        endpoint = `/api/dues/teamleader/dues/${due.due_id}/status`;
        statusPayload = status === "approved" ? "tl_approved" : (status === "rejected" ? "tl_rejected" : status);
      } else {
        endpoint = `/api/dues/${due.due_id}/status`;
        statusPayload = status;
      }
      const res = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: statusPayload }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(
          `Request ${
            status === "approved" ? "approved" : "rejected"
          } successfully!`
        );
        if (onAction) onAction();
      } else {
        setError(data.error || `Failed to ${status}`);
      }
    } catch (err) {
      setError("Server error");
    } finally {
      setLoading(false);
      setConfirmAction(null);
    }
  };

  const handleSubmit = async () => {
    setError("");
    setMessage("");
    if (!noOfDays || isNaN(Number(noOfDays)) || Number(noOfDays) <= 0) {
      setError("Please enter a valid number of days");
      return;
    }
    const today = new Date();
    const dueDateObj = new Date(today.getTime() + Number(noOfDays) * 24 * 60 * 60 * 1000);
    const dueDateStr = dueDateObj.toISOString().split('T')[0];
    const payload = {
      emp_id: onlyEditFields ? tlId : empId,
      tl_id: tlId,
      project_id: projectId,
      task_id: taskId,
      to_manager: toManager,
      no_of_days: Number(noOfDays),
      reason: reason || "No reason provided",
      due_date: dueDateStr,
    };
    try {
      const res = await fetch('/api/dues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        alert('Submitted successfully!');
        window.location.reload();
      } else {
        setError(data.error || 'Failed to submit due extension');
      }
    } catch (err) {
      setError('Server error');
    }
  };

  const handleSchedule = () => {
    setShowTimePicker(true);
  };

  const handleScheduleSubmit = async () => {
    setError("");
    setMessage("");
    if (!scheduledTime) {
      setError("Please select a time to schedule the request.");
      return;
    }
    // Prepare payload with scheduled time
    const today = new Date();
    const dueDateObj = new Date(today.getTime() + Number(noOfDays) * 24 * 60 * 60 * 1000);
    const dueDateStr = dueDateObj.toISOString().split('T')[0];
    const payload = {
      emp_id: onlyEditFields ? tlId : empId,
      tl_id: tlId,
      project_id: projectId,
      task_id: taskId,
      to_manager: toManager,
      no_of_days: Number(noOfDays),
      reason: reason || "No reason provided",
      due_date: dueDateStr,
      scheduled_time: scheduledTime,
    };
    try {
      const res = await fetch('/api/dues/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        alert('Scheduled successfully!');
        if (onAction) onAction();
      } else {
        setError(data.error || 'Failed to schedule due extension');
      }
    } catch (err) {
      setError('Server error');
    }
  };

  const isFieldEditable = (field) => {
    if (readOnly) return false;
    if (!onlyEditFields) return true;
    return onlyEditFields.includes(field);
  };

  if (!due) {
    return (
      <div className="text-center p-4">
        <h5>No Due Data Found</h5>
        <button className="btn btn-secondary mt-3" onClick={onClose}>
          Close
        </button>
      </div>
    );
  }

  const isProcessed = (due.status ?? "pending") !== "pending";

  return (
    <div className="overlay">
      <div
        ref={modalRef}
        className="overlay-content due-extension-container d-flex flex-lg-row flex-column align-items-center gap-4 p-4 position-relative"
      >
        {/* Close Icon */}
        <div
          className="close-icon"
          onClick={() => {
            if (onNavigateBack) onNavigateBack();
            else onClose();
          }}
        >
          <ion-icon name="close-outline" size="large"></ion-icon>
        </div>

        {/* Left Illustration */}
        <div className="left-illustration text-center">
          <img
            src={DueIllstration}
            alt="Due Illustration"
            className="img-fluid rounded"
            style={{ maxWidth: "400px" }}
          />
        </div>

        {/* Right Form */}
        <div className="right-form shadow p-5 flex-grow-1 w-100">
          <h3 className="form-title text-primary text-center mb-4">
            {due.due_id === "NEW" ? "CREATE DUE EXTENSION" : "DUE EXTENSION DETAILS"}
          </h3>
          {message && <div className="alert alert-success">{message}</div>}
          {error && <div className="alert alert-danger">{error}</div>}
          <form>
            {/* Team Leader ID field removed as per user request */}
            <div className="form-group mb-3">
              <input
                className="form-control"
                value={getDisplayValue(projectId, !isFieldEditable("project_id"))}
                onChange={(e) => setProjectId(e.target.value)}
                readOnly={!isFieldEditable("project_id")}
                placeholder="Project ID"
              />
            </div>
            <div className="form-group mb-3">
              <input
                className="form-control"
                value={getDisplayValue(taskId, !isFieldEditable("task_id"))}
                onChange={(e) => setTaskId(e.target.value)}
                readOnly={!isFieldEditable("task_id")}
                placeholder="Task ID"
              />
            </div>
            <div className="form-group mb-3">
              <input
                className="form-control"
                value={getDisplayValue(toManager, !isFieldEditable("to_manager"))}
                onChange={(e) => setToManager(e.target.value)}
                readOnly={!isFieldEditable("to_manager")}
                placeholder="To Manager"
              />
            </div>
            <div className="form-group mb-3">
              <input
                type="number"
                className="form-control"
                value={getDisplayValue(noOfDays, !isFieldEditable("no_of_days"))}
                onChange={(e) => setNoOfDays(e.target.value)}
                readOnly={!isFieldEditable("no_of_days")}
                placeholder="No. of Days"
              />
            </div>
            <div className="form-group mb-3">
              <textarea
                className="form-control"
                value={getDisplayValue(reason, !isFieldEditable("reason"))}
                onChange={(e) => setReason(e.target.value)}
                readOnly={!isFieldEditable("reason")}
                placeholder="Reason for Extension"
                rows={3}
              />
            </div>
            <div className="form-group mb-3">
              <input
                type="text"
                className="form-control"
                value={isValidDateString(dueDate) ? dueDate : (readOnly ? "N/A" : "")}
                readOnly
                placeholder="Due Date"
              />
            </div>
            {(!onlyEditFields && due.due_id !== "NEW") && (
              <div className="form-group mb-3">
                <input
                  className="form-control"
                  value={due.status}
                  readOnly
                  placeholder="Status"
                />
              </div>
            )}
            {/* Action buttons based on props */}
            <div className="d-flex justify-content-center gap-3">
              {showSubmit && (
                <button
                  type="button"
                  className="btn btn-primary px-4"
                  disabled={loading}
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              )}
              {showSchedule && !showTimePicker && (
                <button
                  type="button"
                  className="btn btn-info px-4"
                  disabled={loading}
                  onClick={handleSchedule}
                >
                  Schedule
                </button>
              )}
              {showTimePicker && (
                <div className="d-flex flex-column align-items-center w-100">
                  <input
                    type="datetime-local"
                    className="form-control mb-2"
                    value={scheduledTime}
                    onChange={e => setScheduledTime(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn btn-success px-4"
                    disabled={loading}
                    onClick={handleScheduleSubmit}
                  >
                    Confirm Schedule
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary px-4 mt-2"
                    disabled={loading}
                    onClick={() => setShowTimePicker(false)}
                  >
                    Cancel
                  </button>
                </div>
              )}
              {!showSubmit && !showSchedule && !showTimePicker && (
                <>
                  <button
                    type="button"
                    className="btn btn-success px-4"
                    disabled={loading || isProcessed}
                    onClick={() => setConfirmAction("approved")}
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger px-4"
                    disabled={loading || isProcessed}
                    onClick={() => setConfirmAction("rejected")}
                  >
                    Disapprove
                  </button>
                </>
              )}
            </div>
          </form>
        </div>

        {/* Confirmation Dialog */}
        {confirmAction && (
          <div className="confirmation-dialog">
            <div className="confirmation-content">
              <p>
                Are you sure you want to <b>{confirmAction}</b> this due
                extension?
              </p>
              <div className="d-flex justify-content-center gap-3 mt-3">
                <button
                  className="btn btn-primary"
                  onClick={() => handleAction(confirmAction)}
                  disabled={loading}
                >
                  Yes
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setConfirmAction(null)}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DueExtensionForm;
