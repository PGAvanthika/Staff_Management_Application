import React, { useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./DueExtensionForm.css";
import DueIllstration from "../Assets/deadline_img-removebg-preview.png";

const DueExtensionForm = ({ onClose }) => {
  const modalRef = useRef();

  // Close modal if clicked outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  return (
    <div className="overlay">
      <div
        ref={modalRef}
        className="overlay-content due-extension-container d-flex flex-lg-row flex-column align-items-center gap-4 p-4 position-relative"
      >
        {/* Close Icon */}
        <div className="close-icon" onClick={onClose}>
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
            DUE EXTENSION
          </h3>

          <div className="form-group mb-3">
            <input className="form-control" placeholder="Employee ID" />
          </div>

          <div className="form-group mb-3">
            <input className="form-control" placeholder="TL ID" />
          </div>

          <div className="form-group mb-3">
            <input className="form-control" placeholder="PRJ3124" />
          </div>

          <div className="form-group mb-3">
            <input className="form-control" placeholder="TSK4608" />
          </div>

          <div className="form-group mb-3">
            <input className="form-control" placeholder="To Manager" />
          </div>

          <div className="form-group mb-3">
            <input
              type="number"
              className="form-control"
              placeholder="No. of Days"
            />
          </div>

          <div className="form-group mb-3">
            <input className="form-control" placeholder="Due Date" />
          </div>

          <div className="form-group mb-4">
            <textarea
              className="form-control"
              placeholder="REASON"
              rows={3}
            ></textarea>
          </div>

          <div className="d-flex justify-content-around">
            <button
              className="btn btn-success px-4"
              onClick={() => alert("✅ Request Approved")}
            >
              Approve
            </button>
            <button
              className="btn btn-danger px-4"
              onClick={() => alert("❌ Due Request Disapproved")}
            >
              Disapprove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DueExtensionForm;
