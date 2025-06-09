import React, { useState } from "react";

function ToDo() {
  const [activeView, setActiveView] = useState("sticky-wall");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [stickyNotes, setStickyNotes] = useState([
    {
      id: 1,
      title: "Social Media",
      content: [
        "- Plan social content",
        "- Build content calendar",
        "- Plan promotion and distribution",
      ],
      color: "warning",
      list: "Work",
      dueDate: "2025-06-08",
    },
    {
      id: 2,
      title: "Content Strategy",
      content: [
        "Would need time to get insights (goals, personas, budget, audits), but after, it would be good to focus on assembling my team (start with SEO specialist, then perhaps an email marketer?). Also need to brainstorm on tooling.",
      ],
      color: "info",
      list: "Work",
      dueDate: "2025-06-10",
    },
    {
      id: 3,
      title: "Email A/B Tests",
      content: ["- Subject lines", "- Sender", "- CTA", "- Sending times"],
      color: "danger",
      list: "Personal",
      dueDate: "2025-06-07",
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
      list: "Work",
      dueDate: "2025-06-09",
    },
  ]);

  const [tasks, setTasks] = useState([
    { id: 1, title: "Research content ideas", list: "Work", dueDate: "2025-06-06", completed: false },
    { id: 2, title: "Create a database of guest authors", list: "Work", dueDate: "2025-06-06", completed: false },
    { id: 3, title: "Renew driver's license", list: "Personal", dueDate: "2025-06-06", completed: false },
    { id: 4, title: "Consult accountant", list: "Personal", dueDate: "2025-06-06", completed: false },
    { id: 5, title: "Print business card", list: "Work", dueDate: "2025-06-06", completed: false },
    { id: 6, title: "Create job posting for SEO specialist", list: "Work", dueDate: "2025-06-07", completed: false },
    { id: 7, title: "Request design assets for landing page", list: "Work", dueDate: "2025-06-07", completed: false },
  ]);

  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    color: "info",
    list: "Personal",
    dueDate: "",
  });

  const lists = [
    { name: "Personal", color: "danger", count: 3 },
    { name: "Work", color: "info", count: 6 },
    { name: "List 1", color: "success", count: 3 },
  ];

  const getTasksForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return [...tasks, ...stickyNotes.map(note => ({ ...note, title: note.title, list: note.list }))]
      .filter(task => task.dueDate === dateStr);
  };

  const getTasksForView = (view) => {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const thisWeekEnd = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];

    switch (view) {
      case "today":
        return tasks.filter(task => task.dueDate === today);
      case "tomorrow":
        return tasks.filter(task => task.dueDate === tomorrow);
      case "thisweek":
        return tasks.filter(task => task.dueDate > today && task.dueDate <= thisWeekEnd);
      case "upcoming":
        return tasks.filter(task => task.dueDate >= today);
      default:
        return tasks;
    }
  };

  const handleAddNote = () => {
    if (newNote.title.trim()) {
      const note = {
        ...newNote,
        id: Date.now(),
        content: newNote.content.split('\n').filter(line => line.trim()),
      };
      setStickyNotes([...stickyNotes, note]);
      setNewNote({ title: "", content: "", color: "info", list: "Personal", dueDate: "" });
      setShowAddModal(false);
    }
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setNewNote({
      title: note.title,
      content: note.content.join('\n'),
      color: note.color,
      list: note.list,
      dueDate: note.dueDate,
    });
    setShowAddModal(true);
  };

  const handleUpdateNote = () => {
    if (editingNote && newNote.title.trim()) {
      setStickyNotes(stickyNotes.map(note => 
        note.id === editingNote.id 
          ? { ...note, ...newNote, content: newNote.content.split('\n').filter(line => line.trim()) }
          : note
      ));
      setEditingNote(null);
      setNewNote({ title: "", content: "", color: "info", list: "Personal", dueDate: "" });
      setShowAddModal(false);
    }
  };

  const renderCalendar = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const current = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      const tasksForDay = getTasksForDate(current);
      const isCurrentMonth = current.getMonth() === month;
      const isToday = current.toDateString() === new Date().toDateString();
      
      days.push(
        <div
          key={i}
          className={`calendar-day ${isCurrentMonth ? '' : 'other-month'} ${isToday ? 'today' : ''}`}
          style={{ minHeight: '80px' }}
        >
          <div className="day-number">{current.getDate()}</div>
          {tasksForDay.length > 0 && (
            <div className="task-indicators">
              {tasksForDay.slice(0, 3).map((task, idx) => {
                const listColor = lists.find(l => l.name === task.list)?.color || 'secondary';
                return (
                  <div
                    key={idx}
                    className={`task-indicator bg-${listColor}`}
                    title={task.title}
                  ></div>
                );
              })}
              {tasksForDay.length > 3 && (
                <div className="task-indicator-more">+{tasksForDay.length - 3}</div>
              )}
            </div>
          )}
        </div>
      );
      current.setDate(current.getDate() + 1);
    }

    return (
      <div className="calendar-container">
        <div className="calendar-header d-flex justify-content-between align-items-center mb-4">
          <button 
            className="btn btn-outline-primary"
            onClick={() => setSelectedDate(new Date(year, month - 1, 1))}
          >
            &lt;
          </button>
          <h3 className="mb-0">
            {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h3>
          <button 
            className="btn btn-outline-primary"
            onClick={() => setSelectedDate(new Date(year, month + 1, 1))}
          >
            &gt;
          </button>
        </div>
        <div className="calendar-grid">
          <div className="calendar-weekdays">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="weekday-header">{day}</div>
            ))}
          </div>
          <div className="calendar-days">
            {days}
          </div>
        </div>
      </div>
    );
  };

  const renderUpcomingTasks = () => {
    const upcomingTasks = getTasksForView("upcoming");
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const thisWeekEnd = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];

    const tasksByDate = {
      today: upcomingTasks.filter(task => task.dueDate === today),
      tomorrow: upcomingTasks.filter(task => task.dueDate === tomorrow),
      thisWeek: upcomingTasks.filter(task => task.dueDate > tomorrow && task.dueDate <= thisWeekEnd),
      later: upcomingTasks.filter(task => task.dueDate > thisWeekEnd),
    };

    const renderTaskSection = (title, tasks) => (
      <div className="mb-4">
        <h4 className="section-title mb-3">{title} ({tasks.length})</h4>
        {tasks.map(task => {
          const listColor = lists.find(l => l.name === task.list)?.color || 'secondary';
          return (
            <div key={task.id} className="task-item d-flex align-items-center mb-2 p-3 bg-light rounded">
              <input type="checkbox" className="form-check-input me-3" />
              <div className="flex-grow-1">
                <div className="task-title">{task.title}</div>
                <small className="text-muted">{task.dueDate}</small>
              </div>
              <span className={`badge bg-${listColor} ms-2`}>{task.list}</span>
            </div>
          );
        })}
        {tasks.length === 0 && (
          <div className="text-muted text-center py-4">No tasks scheduled</div>
        )}
      </div>
    );

    return (
      <div className="upcoming-tasks">
        {renderTaskSection("Today", tasksByDate.today)}
        {renderTaskSection("Tomorrow", tasksByDate.tomorrow)}
        {renderTaskSection("This Week", tasksByDate.thisWeek)}
        {renderTaskSection("Later", tasksByDate.later)}
      </div>
    );
  };

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
          height: 100vh;
          position: fixed;
          top: 0;
          left: 0;
          width: 250px;
          box-shadow: 2px 0 15px rgba(0, 71, 171, 0.15);
          overflow-y: auto;
          z-index: 1000;
        }
        
        .nav-link {
          color: rgba(255, 255, 255, 0.8) !important;
          border-radius: 8px;
          margin-bottom: 4px;
          transition: all 0.3s ease;
          border: none;
          background: none;
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
        
        .main-content {
          margin-left: 250px;
          background-color: white;
          min-height: 100vh;
          padding: 2rem;
        }
        
        .sticky-note {
          border-radius: 12px;
          border: none;
          box-shadow: 0 4px 12px rgba(0, 71, 171, 0.1);
          transition: all 0.3s ease;
          height: 280px;
          cursor: pointer;
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

        .calendar-container {
          max-width: 800px;
        }
        
        .calendar-grid {
          border: 1px solid #dee2e6;
          border-radius: 8px;
          overflow: hidden;
        }
        
        .calendar-weekdays {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          background-color: var(--cobalt-blue);
        }
        
        .weekday-header {
          padding: 1rem;
          text-align: center;
          font-weight: 600;
          color: white;
          border-right: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .calendar-days {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
        }
        
        .calendar-day {
          border: 1px solid #dee2e6;
          padding: 0.5rem;
          min-height: 80px;
          position: relative;
          background-color: white;
        }
        
        .calendar-day.other-month {
          background-color: #f8f9fa;
          color: #adb5bd;
        }
        
        .calendar-day.today {
          background-color: rgba(137, 207, 240, 0.1);
          font-weight: 600;
        }
        
        .day-number {
          font-weight: 500;
          margin-bottom: 0.25rem;
        }
        
        .task-indicators {
          display: flex;
          flex-wrap: wrap;
          gap: 2px;
        }
        
        .task-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin: 1px;
        }
        
        .task-indicator-more {
          font-size: 0.6rem;
          color: #6c757d;
          margin-left: 2px;
        }
        
        .task-item {
          transition: all 0.2s ease;
        }
        
        .task-item:hover {
          background-color: #e9ecef !important;
          transform: translateX(2px);
        }
        
        .modal-backdrop {
          background-color: rgba(0, 0, 0, 0.5);
        }
      `}</style>

      <div className="container-fluid p-0">
        <div className="row g-0">
          {/* Fixed Sidebar */}
          <div className="sidebar d-flex flex-column">
            <div className="p-3 flex-grow-1">
              <div className="mb-4">
                <h6 className="section-title mb-3">TASKS</h6>
                <ul className="nav nav-pills flex-column">
                  <li className="nav-item">
                    <button 
                      className={`nav-link w-100 text-start d-flex justify-content-between align-items-center ${activeView === 'upcoming' ? 'active' : ''}`}
                      onClick={() => setActiveView('upcoming')}
                    >
                      <span>
                        <i className="bi bi-list-task me-2"></i>Upcoming
                      </span>
                      <span className="badge-custom">12</span>
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link w-100 text-start d-flex justify-content-between align-items-center ${activeView === 'today' ? 'active' : ''}`}
                      onClick={() => setActiveView('today')}
                    >
                      <span>
                        <i className="bi bi-calendar-day me-2"></i>Today
                      </span>
                      <span className="badge-custom">5</span>
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link w-100 text-start ${activeView === 'calendar' ? 'active' : ''}`}
                      onClick={() => setActiveView('calendar')}
                    >
                      <i className="bi bi-calendar me-2"></i>Calendar
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link w-100 text-start ${activeView === 'sticky-wall' ? 'active' : ''}`}
                      onClick={() => setActiveView('sticky-wall')}
                    >
                      <i className="bi bi-sticky me-2"></i>Sticky Wall
                    </button>
                  </li>
                </ul>
              </div>

              <div className="mb-4">
                <h6 className="section-title mb-3">LISTS</h6>
                <ul className="nav nav-pills flex-column">
                  {lists.map((list, index) => (
                    <li key={index} className="nav-item">
                      <button className="nav-link w-100 text-start d-flex justify-content-between align-items-center">
                        <span>
                          <span className={`list-indicator bg-${list.color} me-2`}></span>
                          {list.name}
                        </span>
                        <span className="badge-custom">{list.count}</span>
                      </button>
                    </li>
                  ))}
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
          </div>

          {/* Main Content */}
          <div className="main-content">
            {activeView === 'sticky-wall' && (
              <>
                <h1 className="page-title">Sticky Wall</h1>
                <div className="row g-4">
                  {stickyNotes.map((note) => (
                    <div key={note.id} className="col-lg-6">
                      <div
                        className={`card sticky-note bg-${note.color} bg-opacity-25 border-0`}
                        onClick={() => handleEditNote(note)}
                      >
                        <div className="card-body d-flex flex-column">
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <h5 className="card-title fw-bold mb-0">
                              {note.title}
                            </h5>
                            <small className="text-muted">{note.list}</small>
                          </div>
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
                          {note.dueDate && (
                            <small className="text-muted mt-2">
                              <i className="bi bi-calendar me-1"></i>
                              {new Date(note.dueDate).toLocaleDateString()}
                            </small>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="col-lg-6">
                    <div 
                      className="add-note-card d-flex align-items-center justify-content-center"
                      onClick={() => setShowAddModal(true)}
                    >
                      <i
                        className="bi bi-plus"
                        style={{ fontSize: "3rem", color: "var(--dark-grey)" }}
                      ></i>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeView === 'upcoming' && (
              <>
                <h1 className="page-title">Upcoming Tasks</h1>
                {renderUpcomingTasks()}
              </>
            )}

            {activeView === 'calendar' && (
              <>
                <h1 className="page-title">Calendar</h1>
                {renderCalendar()}
              </>
            )}

            {activeView === 'today' && (
              <>
                <h1 className="page-title">Today's Tasks</h1>
                <div className="task-list">
                  {getTasksForView('today').map(task => {
                    const listColor = lists.find(l => l.name === task.list)?.color || 'secondary';
                    return (
                      <div key={task.id} className="task-item d-flex align-items-center mb-3 p-3 bg-light rounded">
                        <input type="checkbox" className="form-check-input me-3" />
                        <div className="flex-grow-1">
                          <div className="task-title fw-semibold">{task.title}</div>
                          <small className="text-muted">{task.dueDate}</small>
                        </div>
                        <span className={`badge bg-${listColor} ms-2`}>{task.list}</span>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingNote ? 'Edit Sticky Note' : 'Add New Sticky Note'}
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingNote(null);
                    setNewNote({ title: "", content: "", color: "info", list: "Personal", dueDate: "" });
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newNote.title}
                    onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                    placeholder="Enter note title"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Content</label>
                  <textarea
                    className="form-control"
                    rows="6"
                    value={newNote.content}
                    onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                    placeholder="Enter note content (one item per line)"
                  />
                </div>
                <div className="row">
                  <div className="col-md-4">
                    <label className="form-label">Color</label>
                    <select
                      className="form-select"
                      value={newNote.color}
                      onChange={(e) => setNewNote({ ...newNote, color: e.target.value })}
                    >
                      <option value="info">Blue</option>
                      <option value="warning">Yellow</option>
                      <option value="danger">Red</option>
                      <option value="success">Green</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">List</label>
                    <select
                      className="form-select"
                      value={newNote.list}
                      onChange={(e) => setNewNote({ ...newNote, list: e.target.value })}
                    >
                      {lists.map(list => (
                        <option key={list.name} value={list.name}>{list.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Due Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={newNote.dueDate}
                      onChange={(e) => setNewNote({ ...newNote, dueDate: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingNote(null);
                    setNewNote({ title: "", content: "", color: "info", list: "Personal", dueDate: "" });
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={editingNote ? handleUpdateNote : handleAddNote}
                >
                  {editingNote ? 'Update Note' : 'Add Note'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ToDo;