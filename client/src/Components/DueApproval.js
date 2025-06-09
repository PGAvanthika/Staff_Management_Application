import React, { useState } from "react";
import "./DueApproval.css";
import DueExtensionForm from "./DueExtensionForm";
import "./DueExtensionForm.css";

const dummyTasks = [
  { id: "TSK4608", desc: "Develop the prototype for the chatbot" },
  { id: "TSK4609", desc: "Fix bug in login functionality" },
  { id: "TSK4611", desc: "Optimize database queries" },
];

const DueApproval = () => {
  const [showOverlay, setShowOverlay] = useState(false);

  const handleOpen = () => setShowOverlay(true);
  const handleClose = () => setShowOverlay(false);

  return (
    <>
      <div className="card-container">
        {dummyTasks.map((task, index) => (
          <div
            className="task-wrapper"
            key={index}
            onClick={handleOpen} // Click anywhere on this wrapper to open overlay
            style={{ cursor: "pointer" }} // Visual cue it's clickable
          >
            <div className="task-card">
              <span className="task-id">{task.id}</span>
              <div className="task-content">
                <div className="task-desc-box">
                  <span className="task-desc">{task.desc}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showOverlay && <DueExtensionForm onClose={handleClose} />}
    </>
  );
};

export default DueApproval;
