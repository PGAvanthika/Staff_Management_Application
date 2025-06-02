import React from "react";

const TaskAllocation = () => {
  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-pink position-relative">
      {/* Back Icon (Replace src with your own icon) */}
      <div className="position-absolute top-0 start-0 m-3">
        <img
          src="/icons/back-icon.png"
          alt="Back"
          style={{ width: "30px", cursor: "pointer" }}
        />
      </div>

      <div className="row w-100 max-w-1000 bg-white rounded-4 shadow-lg overflow-hidden border border-light">
        {/* Left Illustration (Replace src with your own illustration) */}
        <div className="col-md-6 d-flex align-items-center justify-content-center bg-light">
          <img
            src="/images/illustration.png"
            alt="Illustration"
            className="img-fluid rounded"
            style={{ maxHeight: "90%", maxWidth: "90%" }}
          />
        </div>

        {/* Right Form Section */}
        <div className="col-md-6 p-4">
          <h3 className="text-center fw-bold text-primary mb-4">
            TASK ALLOCATION
          </h3>

          <form>
            <div className="mb-3 d-flex align-items-center border p-2 rounded">
              <img
                src="/icons/task-icon.png"
                className="me-2"
                alt="task"
                width="20"
              />
              <input
                type="text"
                className="form-control border-0"
                placeholder="TSK4606"
              />
            </div>

            <div className="mb-3 d-flex align-items-center border p-2 rounded">
              <img
                src="/icons/project-icon.png"
                className="me-2"
                alt="project"
                width="20"
              />
              <input
                type="text"
                className="form-control border-0"
                placeholder="PRJ3124"
              />
            </div>

            <div className="mb-3 d-flex align-items-center border p-2 rounded">
              <img
                src="/icons/emp-icon.png"
                className="me-2"
                alt="emp"
                width="20"
              />
              <input
                type="text"
                className="form-control border-0"
                placeholder="Emp1234"
              />
            </div>

            <div className="mb-3 d-flex align-items-center border p-2 rounded">
              <img
                src="/icons/topic-icon.png"
                className="me-2"
                alt="topic"
                width="20"
              />
              <input
                type="text"
                className="form-control border-0 text-primary fw-medium"
                placeholder="STAFF MANAGEMENT - PROTOTYPE"
              />
            </div>

            <div className="mb-3 d-flex align-items-center border p-2 rounded">
              <img
                src="/icons/desc-icon.png"
                className="me-2"
                alt="desc"
                width="20"
              />
              <input
                type="text"
                className="form-control border-0 text-secondary"
                placeholder="Develop the prototype for the staff management project"
              />
            </div>

            <div className="mb-4 d-flex align-items-center border p-2 rounded">
              <img
                src="/icons/calendar-icon.png"
                className="me-2"
                alt="calendar"
                width="20"
              />
              <input
                type="date"
                className="form-control border-0"
                defaultValue="2025-05-26"
              />
            </div>

            <div className="d-flex justify-content-center">
              <button
                type="submit"
                className="btn btn-gradient d-flex align-items-center gap-2 px-4 py-2 rounded-pill shadow"
              >
                <img src="/icons/send-icon.png" alt="send" width="20" />
                Schedule Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskAllocation;
