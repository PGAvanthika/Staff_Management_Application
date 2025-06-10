import React, { useState } from "react";
import "./TaskAllocation.css";
import taskIllustration from "../Assets/Taskallocation.png";
import axios from "axios";

function TaskAllocation() {
  const [showOverlay, setShowOverlay] = useState(false);
  const [projectId, setProjectId] = useState("");
  const [projectName, setProjectName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    task_id: "",
    project_id: "",
    assigned_to: "",
    assigned_by: "",
    description: "",
    deadline: "",
  });

  const handleProjectSubmit = async () => {
    try {
      await axios.post("http://localhost:3001/api/projects", {
        project_id: projectId,
        project_name: projectName,
      });
      alert("Project added successfully!");
      setShowOverlay(false);
      setProjectId("");
      setProjectName("");
    } catch (error) {
      console.error("Failed to create project:", error.response?.data || error);
      alert(
        error.response?.data?.message || "Failed to create project. Try again."
      );
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Function to check if project exists
  const checkProjectExists = async (projectId) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/projects/${projectId}`);
      return response.data.exists; // Assuming the API returns { exists: true/false }
    } catch (error) {
      console.error("Error checking project:", error);
      return false;
    }
  };

  const handleTaskSubmit = async () => {
    // Validate required fields
    if (!formData.task_id || !formData.project_id || !formData.assigned_to || 
        !formData.assigned_by || !formData.description || !formData.deadline) {
      alert("Please fill in all required fields");
      return;
    }

    // Validate deadline format (basic check for YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(formData.deadline)) {
      alert("Please enter deadline in YYYY-MM-DD format");
      return;
    }

    setIsSubmitting(true);

    try {
      // First check if project exists
      const projectExists = await checkProjectExists(formData.project_id);
      
      if (!projectExists) {
        alert(`Error: Project with ID '${formData.project_id}' does not exist. Please check the project ID or create the project first.`);
        setIsSubmitting(false);
        return;
      }

      // If project exists, create the task
      console.log("Form Data Submitted:", formData);
      await axios.post("http://localhost:3001/api/tasks", {
        task_id: formData.task_id,
        project_id: formData.project_id,
        assigned_to: formData.assigned_to,
        assigned_by: formData.assigned_by,
        description: formData.description,
        deadline: formData.deadline,
        task_status: "assigned", // Default status as per your schema
      });
      
      alert("Task created successfully!");
      
      // Reset form after successful submission
      setFormData({
        task_id: "",
        project_id: "",
        assigned_to: "",
        assigned_by: "",
        description: "",
        deadline: "",
      });
      
    } catch (error) {
      console.error("Task creation failed:", error.response?.data || error);
      
      // Handle specific error messages
      if (error.response?.status === 409) {
        alert("Error: Task ID already exists. Please use a different Task ID.");
      } else if (error.response?.status === 400) {
        alert(error.response?.data?.message || "Invalid data provided. Please check your inputs.");
      } else {
        alert(error.response?.data?.message || "Task creation failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-fluid task-page overflow-hidden position-relative">
      {/* Overlay */}
      {showOverlay && (
        <div className="overlay d-flex justify-content-center align-items-center">
          <div className="overlay-box p-4 shadow position-relative">
            {/* Close Icon */}
            <ion-icon
              name="close-outline"
              style={{
                position: "absolute",
                top: "15px",
                right: "15px",
                fontSize: "1.5rem",
                cursor: "pointer",
              }}
              onClick={() => setShowOverlay(false)}
            ></ion-icon>

            <h4 className="mb-4 text-center">New Project</h4>
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Project ID"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
            />
            <input
              type="text"
              className="form-control mb-4"
              placeholder="Project Name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
            <button
              className="custom-button w-100"
              onClick={handleProjectSubmit}
            >
              Create
            </button>
          </div>
        </div>
      )}

      {/* Add New Project Button */}
      <div className="position-absolute top-0 start-0 p-3">
        <button className="custom-button" onClick={() => setShowOverlay(true)}>
          Add New Project
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
              {
                icon: "document-text-outline",
                name: "task_id",
                placeholder: "Task ID *",
              },
              {
                icon: "document-outline",
                name: "project_id",
                placeholder: "Project ID *",
              },
              {
                icon: "person-outline",
                name: "assigned_to",
                placeholder: "Assigned To (ID) *",
              },
              {
                icon: "newspaper-outline",
                name: "assigned_by",
                placeholder: "Assigned By (ID) *",
              },
              {
                icon: "list-outline",
                name: "description",
                placeholder: "Description *",
                isTextarea: true,
              },
              {
                icon: "hourglass-outline",
                name: "deadline",
                placeholder: "Deadline (YYYY-MM-DD) *",
              },
            ].map(({ icon, name, placeholder, isTextarea }, i) => (
              <div
                className="form-group mb-3 d-flex align-items-center"
                key={i}
              >
                <ion-icon name={icon}></ion-icon>
                {isTextarea ? (
                  <textarea
                    name={name}
                    className="form-control"
                    rows="2"
                    placeholder={placeholder}
                    value={formData[name]}
                    onChange={handleChange}
                    required
                  ></textarea>
                ) : (
                  <input
                    type={name === "deadline" ? "date" : "text"}
                    name={name}
                    className="form-control"
                    placeholder={placeholder}
                    value={formData[name]}
                    onChange={handleChange}
                    required
                  />
                )}
              </div>
            ))}

            <div className="d-flex justify-content-between mt-4">
              <button className="custom-button w-50 me-2">Schedule</button>
              <button
                className="custom-button w-50"
                onClick={handleTaskSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskAllocation;