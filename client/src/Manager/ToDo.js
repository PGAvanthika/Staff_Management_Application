import React, { useState } from "react";

function ToDo() {
  const [activeView, setActiveView] = useState("sticky-wall");

  const stickyNotes = [
    {
      id: 1,
      title: "Social Media",
      content: [
        "- Plan social content",
        "- Build content calendar",
        "- Plan promotion and distribution",
      ],
      color: "warning",
    },
    {
      id: 2,
      title: "Content Strategy",
      content: [
        "Would need time to get insights (goals, personas, budget, audits), but after, it would be good to focus on assembling my team (start with SEO specialist, then perhaps an email marketer?). Also need to brainstorm on tooling.",
      ],
      color: "info",
    },
    {
      id: 3,
      title: "Email A/B Tests",
      content: ["- Subject lines", "- Sender", "- CTA", "- Sending times"],
      color: "danger",
    },
    {
      id: 4,
      title: "Banner Ads",
      content: [
        "Notes from the workshop:",
        "- Sizing matters",
        "- Choose distinctive imagery",
        "- The landing page must match the display ad",
      ],
      color: "warning",
    },
  ];

  return (
    <>
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
        rel="stylesheet"
      />
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css"
        rel="stylesheet"
      />

      <style>{`
        :root {
          --cobalt-blue: #0047AB;
          --baby-blue: #89CFF0;
          --egyptian-blue: #1434A4;
          --sapphire-blue: #0F52BA;
          --grey-bg: #f5f5f5;
          --light-grey: #e8e8e8;
          --dark-grey: #6c757d;
        }
        
        body {
          background-color: var(--grey-bg);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .sidebar {
          background: linear-gradient(135deg, var(--cobalt-blue) 0%, var(--egyptian-blue) 50%, var(--sapphire-blue) 100%);
          min-height: 100vh;
          box-shadow: 2px 0 15px rgba(0, 71, 171, 0.15);
        }
        
        .nav-link {
          color: rgba(255, 255, 255, 0.8) !important;
          border-radius: 8px;
          margin-bottom: 4px;
          transition: all 0.3s ease;
        }
        
        .nav-link:hover {
          color: white !important;
          background-color: rgba(137, 207, 240, 0.2);
          transform: translateX(4px);
        }
        
        .nav-link.active {
          background: linear-gradient(90deg, var(--baby-blue), var(--sapphire-blue));
          color: white !important;
          box-shadow: 0 3px 12px rgba(15, 82, 186, 0.3);
        }
        
        .search-input {
          background-color: rgba(137, 207, 240, 0.15);
          border: 1px solid rgba(137, 207, 240, 0.3);
          color: white;
          border-radius: 8px;
        }
        
        .search-input::placeholder {
          color: rgba(137, 207, 240, 0.8);
        }
        
        .search-input:focus {
          background-color: rgba(137, 207, 240, 0.2);
          border-color: var(--baby-blue);
          color: white;
          box-shadow: 0 0 0 0.2rem rgba(137, 207, 240, 0.2);
        }
        
        .section-title {
          color: var(--baby-blue);
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        
        .badge-custom {
          background: linear-gradient(45deg, var(--baby-blue), var(--sapphire-blue));
          color: white;
          font-size: 0.7rem;
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
        }
        
        .list-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          display: inline-block;
        }
        
        .tag-badge {
          background: linear-gradient(45deg, var(--sapphire-blue), var(--cobalt-blue));
          border: none;
          border-radius: 15px;
          padding: 0.25rem 0.75rem;
          font-size: 0.75rem;
          margin-right: 0.5rem;
          margin-bottom: 0.5rem;
          color: white;
        }
        
        .main-content {
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 71, 171, 0.08);
          margin: 1rem;
          padding: 2rem;
        }
        
        .sticky-note {
          border-radius: 12px;
          border: none;
          box-shadow: 0 4px 12px rgba(0, 71, 171, 0.1);
          transition: all 0.3s ease;
          height: 280px;
        }
        
        .sticky-note:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 71, 171, 0.2);
        }
        
        .add-note-card {
          border: 2px dashed var(--dark-grey);
          background-color: var(--light-grey);
          border-radius: 12px;
          height: 280px;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .add-note-card:hover {
          border-color: var(--cobalt-blue);
          background: linear-gradient(135deg, rgba(137, 207, 240, 0.1), rgba(15, 82, 186, 0.1));
          transform: translateY(-2px);
        }
        
        .page-title {
          color: var(--egyptian-blue);
          font-weight: 700;
          font-size: 2rem;
          margin-bottom: 2rem;
        }
        
        .bottom-nav {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 1rem;
          margin-top: auto;
        }
        
        .btn-bottom {
          background: linear-gradient(45deg, rgba(137, 207, 240, 0.2), rgba(15, 82, 186, 0.2));
          border: 1px solid rgba(137, 207, 240, 0.3);
          color: rgba(255, 255, 255, 0.9);
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        
        .btn-bottom:hover {
          background: linear-gradient(45deg, var(--baby-blue), var(--sapphire-blue));
          color: white;
          border-color: var(--baby-blue);
          transform: translateY(-1px);
        }
      `}</style>

      <div
        className="container-fluid p-0"
        style={{ backgroundColor: "var(--grey-bg)", minHeight: "100vh" }}
      >
        <div className="row g-0">
          {/* Sidebar */}
          <div className="col-md-3 col-lg-2">
            <div className="sidebar d-flex flex-column">
              <div className="p-3">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="text-white mb-0 fw-bold">Menu</h5>
                  <button className="btn btn-sm text-white">
                    <i className="bi bi-list fs-5"></i>
                  </button>
                </div>

                <div className="mb-4">
                  <div className="input-group">
                    <span className="input-group-text bg-transparent border-0 text-white">
                      <i className="bi bi-search"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control search-input border-0"
                      placeholder="Search"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <h6 className="section-title mb-3">TASKS</h6>
                  <ul className="nav nav-pills flex-column">
                    <li className="nav-item">
                      <button className="nav-link w-100 text-start d-flex justify-content-between align-items-center">
                        <span>
                          <i className="bi bi-list-task me-2"></i>Upcoming
                        </span>
                        <span className="badge-custom">12</span>
                      </button>
                    </li>
                    <li className="nav-item">
                      <button className="nav-link w-100 text-start d-flex justify-content-between align-items-center">
                        <span>
                          <i className="bi bi-calendar-day me-2"></i>Today
                        </span>
                        <span className="badge-custom">5</span>
                      </button>
                    </li>
                    <li className="nav-item">
                      <button className="nav-link w-100 text-start">
                        <i className="bi bi-calendar me-2"></i>Calendar
                      </button>
                    </li>
                    <li className="nav-item">
                      <button className="nav-link active w-100 text-start">
                        <i className="bi bi-sticky me-2"></i>Sticky Wall
                      </button>
                    </li>
                  </ul>
                </div>

                <div className="mb-4">
                  <h6 className="section-title mb-3">LISTS</h6>
                  <ul className="nav nav-pills flex-column">
                    <li className="nav-item">
                      <button className="nav-link w-100 text-start d-flex justify-content-between align-items-center">
                        <span>
                          <span className="list-indicator bg-warning me-2"></span>
                          Personal
                        </span>
                        <span className="badge-custom">3</span>
                      </button>
                    </li>
                    <li className="nav-item">
                      <button className="nav-link w-100 text-start d-flex justify-content-between align-items-center">
                        <span>
                          <span className="list-indicator bg-info me-2"></span>
                          Work
                        </span>
                        <span className="badge-custom">3</span>
                      </button>
                    </li>
                    <li className="nav-item">
                      <button className="nav-link w-100 text-start d-flex justify-content-between align-items-center">
                        <span>
                          <span className="list-indicator bg-success me-2"></span>
                          List 1
                        </span>
                        <span className="badge-custom">3</span>
                      </button>
                    </li>
                    <li className="nav-item mt-2">
                      <button className="nav-link w-100 text-start">
                        <i className="bi bi-plus me-2"></i>Add New List
                      </button>
                    </li>
                  </ul>
                </div>

                <div className="mb-4">
                  <h6 className="section-title mb-3">TAGS</h6>
                  <div>
                    <span className="badge tag-badge">Tag 1</span>
                    <span className="badge tag-badge">Tag 2</span>
                    <button className="btn btn-link text-white text-decoration-none p-0 small">
                      + Add Tag
                    </button>
                  </div>
                </div>
              </div>

              <div className="bottom-nav p-3">
                <div className="d-grid gap-2">
                  <button className="btn btn-bottom btn-sm">
                    <i className="bi bi-gear me-2"></i>Settings
                  </button>
                  <button className="btn btn-bottom btn-sm">
                    <i className="bi bi-box-arrow-right me-2"></i>Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-md-9 col-lg-10">
            <div className="main-content">
              <h1 className="page-title">Sticky Wall</h1>

              <div className="row g-4">
                {stickyNotes.map((note) => (
                  <div key={note.id} className="col-lg-6">
                    <div
                      className={`card sticky-note bg-${note.color} bg-opacity-25 border-0`}
                    >
                      <div className="card-body d-flex flex-column">
                        <h5 className="card-title fw-bold mb-3">
                          {note.title}
                        </h5>
                        <div className="card-text flex-grow-1">
                          {note.content.map((item, index) => (
                            <div
                              key={index}
                              className="mb-2"
                              style={{ fontSize: "0.9rem", lineHeight: "1.4" }}
                            >
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="col-lg-6">
                  <div className="add-note-card d-flex align-items-center justify-content-center">
                    <i
                      className="bi bi-plus"
                      style={{ fontSize: "3rem", color: "var(--dark-grey)" }}
                    ></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ToDo;
