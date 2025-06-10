import React, { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./DueExtensionForm.css";
import DueIllstration from "../Assets/deadline_img-removebg-preview.png";

const DueExtensionForm = ({ onClose }) => {
  const modalRef = useRef();
  const [form, setForm] = useState({
    emp_id: "",
    tl_id: "",
    project_id: "",
    task_id: "",
    to_manager: "",
    no_of_days: "",
    reason: ""
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const res = await fetch("http://localhost:3001/api/dues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include"
      });
      if (res.ok) {
        setMessage("Due extension request submitted successfully!");
        setForm({ emp_id: "", tl_id: "", project_id: "", task_id: "", to_manager: "", no_of_days: "", reason: "" });
      } else {
        const data = await res.json();
        setError(data.error || "Failed to submit request");
      }
    } catch (err) {
      setError("Server error");
    }
  };

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
          {message && <div className="alert alert-success">{message}</div>}
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <input className="form-control" name="emp_id" value={form.emp_id} onChange={handleChange} placeholder="Employee ID" required />
            </div>
            <div className="form-group mb-3">
              <input className="form-control" name="tl_id" value={form.tl_id} onChange={handleChange} placeholder="TL ID" required />
            </div>
            <div className="form-group mb-3">
              <input className="form-control" name="project_id" value={form.project_id} onChange={handleChange} placeholder="Project ID" required />
            </div>
            <div className="form-group mb-3">
              <input className="form-control" name="task_id" value={form.task_id} onChange={handleChange} placeholder="Task ID" required />
            </div>
            <div className="form-group mb-3">
              <input className="form-control" name="to_manager" value={form.to_manager} onChange={handleChange} placeholder="To Manager" required />
            </div>
            <div className="form-group mb-3">
              <input type="number" className="form-control" name="no_of_days" value={form.no_of_days} onChange={handleChange} placeholder="No. of Days" required />
            </div>
            <div className="form-group mb-4">
              <textarea className="form-control" name="reason" value={form.reason} onChange={handleChange} placeholder="REASON" rows={3} required></textarea>
            </div>
            <div className="d-flex justify-content-center">
              <button className="btn btn-primary px-4" type="submit">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DueExtensionForm;
