import React, { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./DueExtensionForm.css";
import DueIllstration from "../Assets/deadline_img-removebg-preview.png";
import { useAuth } from '../context/AuthContext';

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
  const [tlId, setTlId] = useState(user?.id || due.tl_id || "");
  const [projectId, setProjectId] = useState(due.project_id || "");
  const [taskId, setTaskId] = useState(due.task_id || "");
  const [toManager, setToManager] = useState(due.to_manager || "");

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

  const handleAction = async (status) => {
    setMessage("");
    setError("");
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:3001/api/dues/${due.due_id}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ status }),
        }
      );
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
    const today = new Date();
    const dueDate = new Date(today.getTime() + Number(noOfDays) * 24 * 60 * 60 * 1000);
    const dueDateStr = dueDate.toISOString().split('T')[0];
    const payload = {
      emp_id: onlyEditFields ? tlId : empId,
      tl_id: tlId,
      project_id: projectId,
      task_id: taskId,
      to_manager: toManager,
      no_of_days: Number(noOfDays),
      reason,
      due_date: dueDateStr,
    };
    try {
      const res = await fetch('http://localhost:3001/api/dues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        alert('Submitted successfully!');
        if (onAction) onAction();
      } else {
        alert(data.error || 'Failed to submit due extension');
      }
    } catch (err) {
      alert('Server error');
    }
  };

  const handleSchedule = () => {
    alert("Scheduled successfully!");
    if (onAction) onAction();
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

  const isProcessed = due.status !== "pending";

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
            {(!onlyEditFields) && (
              <div className="form-group mb-3">
                <input
                  className="form-control"
                  value={empId}
                  onChange={(e) => setEmpId(e.target.value)}
                  readOnly={!isFieldEditable("emp_id")}
                  placeholder="Employee ID"
                />
              </div>
            )}
            <div className="form-group mb-3">
              <input
                className="form-control"
                value={tlId}
                onChange={(e) => setTlId(e.target.value)}
                readOnly={!isFieldEditable("tl_id")}
                placeholder="TL ID"
              />
            </div>
            <div className="form-group mb-3">
              <input
                className="form-control"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                readOnly={!isFieldEditable("project_id")}
                placeholder="Project ID"
              />
            </div>
            <div className="form-group mb-3">
              <input
                className="form-control"
                value={taskId}
                onChange={(e) => setTaskId(e.target.value)}
                readOnly={!isFieldEditable("task_id")}
                placeholder="Task ID"
              />
            </div>
            <div className="form-group mb-3">
              <input
                className="form-control"
                value={toManager}
                onChange={(e) => setToManager(e.target.value)}
                readOnly={!isFieldEditable("to_manager")}
                placeholder="To Manager"
              />
            </div>
            <div className="form-group mb-3">
              <input
                type="number"
                className="form-control"
                value={noOfDays}
                onChange={(e) => setNoOfDays(e.target.value)}
                readOnly={!isFieldEditable("no_of_days")}
                placeholder="No. of Days"
              />
            </div>
            <div className="form-group mb-3">
              <textarea
                className="form-control"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                readOnly={!isFieldEditable("reason")}
                placeholder="Reason for Extension"
                rows={3}
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
              {showSchedule && (
                <button
                  type="button"
                  className="btn btn-info px-4"
                  disabled={loading}
                  onClick={handleSchedule}
                >
                  Schedule
                </button>
              )}
              {!showSubmit && !showSchedule && (
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
