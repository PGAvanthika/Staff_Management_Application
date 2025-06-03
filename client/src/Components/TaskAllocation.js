import React, { useState } from "react";
import "./TaskAllocation.css";
import taskIllustration from "../Assets/Taskallocation.png";

function TaskAllocation() {
  const [showOverlay, setShowOverlay] = useState(false);

  return (
    <div className="container-fluid task-page overflow-hidden position-relative">
      {/* Overlay */}
      {showOverlay && (
        <div className="overlay d-flex justify-content-center align-items-center">
          <div className="overlay-box p-4 shadow">
            <h4 className="mb-4 text-center">New Project</h4>
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Project ID"
            />
            <input
              type="text"
              className="form-control mb-4"
              placeholder="Project Name"
            />
            <button
              className="custom-button w-100"
              onClick={() => setShowOverlay(false)}
            >
              Create
            </button>
          </div>
        </div>
      )}

      {/* Add New Project Button */}
      <div className="position-absolute top-0 start-0 p-3">
        <button className="custom-button" onClick={() => setShowOverlay(true)}>
          + Add New Project
        </button>
      </div>

      {/* Main Content */}
      <div className="row w-100 h-100">
        {/* LEFT - ILLUSTRATION */}
        <div className="col-lg-6 col-md-6 col-12 d-flex justify-content-center align-items-center image-section">
          <div className="placeholder-image">
            <img
              src={taskIllustration}
              alt="Task Illustration"
              className="img-fluid object-fit-cover rounded"
            />
          </div>
        </div>

        {/* RIGHT - FORM */}
        <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-center">
          <div className="form-box shadow p-5 mx-3">
            <h4 className="form-title mb-4">TASK ALLOCATION</h4>
            {[
              { icon: "document-text-outline", placeholder: "Task ID" },
              { icon: "document-outline", placeholder: "Project ID" },
              {
                icon: "person-outline",
                placeholder: "Assigned To (Employee ID)",
              },
              {
                icon: "newspaper-outline",
                placeholder: "Staff Management - Prototype",
              },
              {
                icon: "list-outline",
                isTextarea: true,
                placeholder: "Task Description",
              },
              {
                icon: "hourglass-outline",
                placeholder: "Due Date (26-05-2025)",
              },
            ].map(({ icon, placeholder, isTextarea }, i) => (
              <div
                className="form-group mb-3 d-flex align-items-center"
                key={i}
              >
                <ion-icon name={icon}></ion-icon>
                {isTextarea ? (
                  <textarea
                    className="form-control"
                    rows="2"
                    placeholder={placeholder}
                  ></textarea>
                ) : (
                  <input
                    type="text"
                    className="form-control"
                    placeholder={placeholder}
                  />
                )}
              </div>
            ))}

            <div className="d-flex justify-content-between mt-4">
              <button className="custom-button w-50 me-2">Schedule</button>
              <button className="custom-button w-50">Send</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskAllocation;
