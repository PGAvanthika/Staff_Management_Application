import React, { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./DueExtensionForm.css";
import DueIllstration from "../Assets/deadline_img-removebg-preview.png";

const DueExtensionForm = ({ due, onClose, onAction, onNavigateBack }) => {
  const modalRef = useRef();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

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

  if (!due) return null;
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
            DUE EXTENSION DETAILS
          </h3>
          {message && <div className="alert alert-success">{message}</div>}
          {error && <div className="alert alert-danger">{error}</div>}
          <form>
            <div className="form-group mb-3">
              <input
                className="form-control"
                value={due.emp_id}
                readOnly
                placeholder="Employee ID"
              />
            </div>
            <div className="form-group mb-3">
              <input
                className="form-control"
                value={due.tl_id}
                readOnly
                placeholder="TL ID"
              />
            </div>
            <div className="form-group mb-3">
              <input
                className="form-control"
                value={due.project_id}
                readOnly
                placeholder="Project ID"
              />
            </div>
            <div className="form-group mb-3">
              <input
                className="form-control"
                value={due.task_id}
                readOnly
                placeholder="Task ID"
              />
            </div>
            <div className="form-group mb-3">
              <input
                className="form-control"
                value={due.to_manager}
                readOnly
                placeholder="To Manager"
              />
            </div>
            <div className="form-group mb-3">
              <input
                type="number"
                className="form-control"
                value={due.no_of_days}
                readOnly
                placeholder="No. of Days"
              />
            </div>
            <div className="form-group mb-3">
              <input
                className="form-control"
                value={due.status}
                readOnly
                placeholder="Status"
              />
            </div>
            <div className="form-group mb-3">
              <input
                className="form-control"
                value={
                  due.current_deadline
                    ? new Date(due.current_deadline).toLocaleDateString()
                    : ""
                }
                readOnly
                placeholder="Current Deadline"
              />
            </div>
            <div className="form-group mb-4">
              <textarea
                className="form-control"
                value={due.reason}
                readOnly
                placeholder="REASON"
                rows={3}
              ></textarea>
            </div>
            <div className="d-flex justify-content-center gap-3">
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
