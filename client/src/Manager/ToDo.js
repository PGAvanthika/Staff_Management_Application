import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function ToDo() {
  const [activeView, setActiveView] = useState("sticky-wall");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddListModal, setShowAddListModal] = useState(false);
  const [showEditListModal, setShowEditListModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [editingList, setEditingList] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedList, setSelectedList] = useState(null);

  const [userLists, setUserLists] = useState(() => {
    const savedLists = localStorage.getItem("userLists");
    return savedLists
      ? JSON.parse(savedLists)
      : [
          { name: "Personal", color: "danger" },
          { name: "Work", color: "info" },
        ];
  });

  const [stickyNotes, setStickyNotes] = useState(() => {
    const savedNotes = JSON.stringify([
      {
        id: 1,
        title: "Social Media",
        content: ["- Plan social content", "- Build content calendar"],
        list: "Work",
        dueDate: "2025-06-09",
        time: "09:00",
        duration: 60,
        completed: false,
      },
      {
        id: 2,
        title: "Email Tests",
        content: ["- Subject lines", "- Sender"],
        list: "Personal",
        dueDate: "2025-06-09",
        time: "12:00",
        duration: 30,
        completed: false,
      },
      {
        id: 3,
        title: "Team Meeting",
        content: ["- Review project status", "- Plan next sprint"],
        list: "Work",
        dueDate: "2025-06-10",
        time: "14:00",
        duration: 90,
        completed: false,
      },
    ]);
    return JSON.parse(savedNotes);
  });

  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    list: "Personal",
    dueDate: "",
    time: "09:00",
    duration: 30,
    completed: false,
  });

  const [newList, setNewList] = useState({
    name: "",
    color: "secondary",
  });

  const [editList, setEditList] = useState({
    name: "",
    color: "secondary",
  });

  // Persist userLists to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("userLists", JSON.stringify(userLists));
  }, [userLists]);

  const handleAddNote = () => {
    if (newNote.title.trim()) {
      const note = {
        ...newNote,
        id: Date.now(),
        content: newNote.content.split("\n").filter((line) => line.trim()),
        completed: false,
      };
      setStickyNotes([...stickyNotes, note]);
      setNewNote({
        title: "",
        content: "",
        list: "Personal",
        dueDate: "",
        time: "09:00",
        duration: 30,
        completed: false,
      });
      setShowAddModal(false);
    }
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setNewNote({
      title: note.title,
      content: note.content.join("\n"),
      list: note.list,
      dueDate: note.dueDate,
      time: note.time,
      duration: note.duration,
      completed: note.completed,
    });
    setShowAddModal(true);
  };

  const handleUpdateNote = () => {
    if (editingNote && newNote.title.trim()) {
      setStickyNotes(
        stickyNotes.map((note) =>
          note.id === editingNote.id
            ? {
                ...note,
                ...newNote,
                content: newNote.content
                  .split("\n")
                  .filter((line) => line.trim()),
              }
            : note
        )
      );
      setEditingNote(null);
      setNewNote({
        title: "",
        content: "",
        list: "Personal",
        dueDate: "",
        time: "09:00",
        duration: 30,
        completed: false,
      });
      setShowAddModal(false);
    }
  };

  const handleDeleteNote = (id) => {
    setStickyNotes(stickyNotes.filter((note) => note.id !== id));
  };

  const handleToggleComplete = (id) => {
    setStickyNotes(
      stickyNotes.map((note) =>
        note.id === id ? { ...note, completed: !note.completed } : note
      )
    );
  };

  const handleAddList = () => {
    if (newList.name.trim()) {
      setUserLists([
        ...userLists,
        { name: newList.name, color: newList.color },
      ]);
      setNewList({ name: "", color: "secondary" });
      setShowAddListModal(false);
    }
  };

  const handleEditList = (list) => {
    setEditingList(list);
    setEditList({
      name: list.name,
      color: list.color,
    });
    setShowEditListModal(true);
  };

  const handleUpdateList = () => {
    if (editingList && editList.name.trim()) {
      const oldName = editingList.name;
      const newName = editList.name;

      // Update the list name and color in userLists
      setUserLists(
        userLists.map((list) =>
          list.name === oldName
            ? { name: newName, color: editList.color }
            : list
        )
      );

      // Update all sticky notes with the old list name to the new list name
      setStickyNotes(
        stickyNotes.map((note) =>
          note.list === oldName ? { ...note, list: newName } : note
        )
      );

      setEditingList(null);
      setEditList({ name: "", color: "secondary" });
      setShowEditListModal(false);
    }
  };

  const getTasksForDate = (date) => {
    const dateStr = date.toISOString().split("T")[0];
    return stickyNotes.filter((note) => note.dueDate === dateStr);
  };

  const getTasksForView = (view) => {
    const today = new Date().toISOString().split("T")[0];
    const tomorrow = new Date(Date.now() + 86400000)
      .toISOString()
      .split("T")[0];
    const thisWeekEnd = new Date(Date.now() + 7 * 86400000)
      .toISOString()
      .split("T")[0];

    switch (view) {
      case "today":
        return stickyNotes.filter((note) => note.dueDate === today);
      case "tomorrow":
        return stickyNotes.filter((note) => note.dueDate === tomorrow);
      case "thisweek":
        return stickyNotes.filter(
          (note) => note.dueDate > today && note.dueDate <= thisWeekEnd
        );
      case "upcoming":
        return stickyNotes.filter((note) => note.dueDate >= today);
      default:
        return stickyNotes;
    }
  };

  const renderTimelineView = (tasks) => {
    const hours = Array.from(
      { length: 24 },
      (_, i) => `${i.toString().padStart(2, "0")}:00`
    );

    return (
      <div className="timeline-container">
        {hours.map((hour) => {
          const tasksAtHour = tasks.filter((task) =>
            task.time?.startsWith(hour.slice(0, 2))
          );
          return (
            <div key={hour} className="timeline-slot">
              <div className="timeline-hour">{hour}</div>
              <div className="timeline-events">
                {tasksAtHour.map((task) => {
                  const listColor =
                    userLists.find((l) => l.name === task.list)?.color ||
                    "secondary";
                  const height = Math.max((task.duration / 60) * 60, 40);
                  return (
                    <div
                      key={task.id}
                      className={`timeline-event bg-${listColor}`}
                      style={{ height: `${height}px` }}
                    >
                      <div className="event-content">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => handleToggleComplete(task.id)}
                          className="me-2"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div>
                          <div
                            className="event-title"
                            style={{
                              textDecoration: task.completed
                                ? "line-through"
                                : "none",
                            }}
                          >
                            {task.title}
                          </div>
                          <small className="text-muted">
                            {task.list} • {task.duration}min
                          </small>
                        </div>
                        <button
                          className="btn btn-sm btn-outline-danger ms-auto"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNote(task.id);
                          }}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderUpcomingTasks = () => {
    const upcomingTasks = getTasksForView("upcoming");
    const groupedTasks = upcomingTasks.reduce((groups, task) => {
      const date = task.dueDate;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(task);
      return groups;
    }, {});

    return (
      <div className="upcoming-tasks">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="mb-0">Upcoming Tasks</h3>
          <button
            className="btn btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            + Add Task
          </button>
        </div>
        {Object.entries(groupedTasks)
          .sort(([a], [b]) => new Date(a) - new Date(b))
          .map(([date, tasks]) => (
            <div key={date} className="mb-4">
              <h5 className="text-primary mb-3">
                {new Date(date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </h5>
              {renderTimelineView(tasks)}
            </div>
          ))}
      </div>
    );
  };

  const renderTodayTasks = () => {
    const todayTasks = getTasksForView("today");
    const today = new Date();

    return (
      <div className="today-tasks">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="mb-0">
            Today -{" "}
            {today.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </h3>
          <button
            className="btn btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            + Add Task
          </button>
        </div>
        {todayTasks.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <p>No tasks for today. Enjoy your free time!</p>
          </div>
        ) : (
          renderTimelineView(todayTasks)
        )}
      </div>
    );
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
      const isSelected = current.toDateString() === selectedDate.toDateString();

      days.push(
        <div
          key={i}
          className={`calendar-day ${
            isCurrentMonth ? "current-month" : "other-month"
          } ${isToday ? "today" : ""} ${isSelected ? "selected" : ""}`}
          onClick={() => setSelectedDate(new Date(current))}
        >
          <div className="day-number">{current.getDate()}</div>
          {tasksForDay.length > 0 && (
            <div className="task-indicators">
              {tasksForDay.slice(0, 4).map((task, idx) => {
                const listColor =
                  userLists.find((l) => l.name === task.list)?.color ||
                  "secondary";
                return (
                  <div
                    key={idx}
                    className={`task-indicator bg-${listColor}`}
                    title={`${task.title} - ${task.time}`}
                  ></div>
                );
              })}
              {tasksForDay.length > 4 && (
                <div className="task-indicator-more">
                  +{tasksForDay.length - 4}
                </div>
              )}
            </div>
          )}
          {tasksForDay.length > 0 && (
            <div className="task-preview">
              {tasksForDay.slice(0, 2).map((task, idx) => (
                <div key={idx} className="task-preview-item">
                  <span
                    className={`task-dot bg-${
                      userLists.find((l) => l.name === task.list)?.color ||
                      "secondary"
                    }`}
                  ></span>
                  <span className="task-text">{task.title}</span>
                </div>
              ))}
              {tasksForDay.length > 2 && (
                <div className="task-preview-more">
                  +{tasksForDay.length - 2} more
                </div>
              )}
            </div>
          )}
        </div>
      );
      current.setDate(current.getDate() + 1);
    }

    const tasksForSelectedDate = getTasksForDate(selectedDate);

    return (
      <div className="calendar-container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center gap-3">
            <button
              className="btn btn-outline-primary"
              onClick={() => setSelectedDate(new Date(year, month - 1, 1))}
            >
              ‹
            </button>
            <h3 className="mb-0">
              {selectedDate.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </h3>
            <button
              className="btn btn-outline-primary"
              onClick={() => setSelectedDate(new Date(year, month + 1, 1))}
            >
              ›
            </button>
          </div>
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-secondary"
              onClick={() => setSelectedDate(new Date())}
            >
              Today
            </button>
            <button
              className="btn btn-primary"
              onClick={() => setShowAddModal(true)}
            >
              + Add Task
            </button>
          </div>
        </div>

        <div className="calendar-grid">
          <div className="calendar-weekdays">
            {[
              "Sunday",
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ].map((day) => (
              <div key={day} className="weekday-header">
                {day}
              </div>
            ))}
          </div>
          <div className="calendar-body">{days}</div>
        </div>

        {/* Display tasks for the selected date */}
        <div className="mt-5">
          <h4>
            Tasks for{" "}
            {selectedDate.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </h4>
          {tasksForSelectedDate.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <p>No tasks scheduled for this day.</p>
            </div>
          ) : (
            renderTimelineView(tasksForSelectedDate)
          )}
        </div>
      </div>
    );
  };

  const renderStickyWall = () => (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Sticky Wall</h3>
        <button
          className="btn btn-primary"
          onClick={() => setShowAddModal(true)}
        >
          + Add Note
        </button>
      </div>

      <div className="row g-4">
        {stickyNotes
          .filter((note) => !selectedList || note.list === selectedList)
          .map((note) => {
            const listColor =
              userLists.find((l) => l.name === note.list)?.color || "secondary";
            return (
              <div key={note.id} className="col-lg-4 col-md-6">
                <div
                  className={`card sticky-note bg-${listColor} bg-opacity-10 border-${listColor}`}
                  onClick={() => handleEditNote(note)}
                >
                  <div className="card-body">
                    <div className="d-flex align-items-start justify-content-between mb-2">
                      <h5
                        className="card-title mb-0"
                        style={{
                          textDecoration: note.completed
                            ? "line-through"
                            : "none",
                        }}
                      >
                        {note.title}
                      </h5>
                      <input
                        type="checkbox"
                        checked={note.completed}
                        onChange={() => handleToggleComplete(note.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div className="card-text mb-3">
                      {note.content.map((c, idx) => (
                        <div key={idx} className="small text-muted">
                          {c}
                        </div>
                      ))}
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">
                        <span className={`badge bg-${listColor} me-2`}></span>
                        {note.list}
                        {note.dueDate && ` • ${note.dueDate} at ${note.time}`}
                      </small>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNote(note.id);
                        }}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <div
        className="text-white p-3"
        style={{
          width: "250px",
          minHeight: "100vh",
          backgroundColor: "#007bff",
        }}
      >
        <h5 className="mb-4">📋 Todo App</h5>

        <h6 className="mb-3">Views</h6>
        <ul className="nav flex-column mb-4">
          {[
            { key: "calendar", icon: "📅", label: "Calendar" },
            { key: "today", icon: "📆", label: "Today" },
            { key: "upcoming", icon: "🗓️", label: "Upcoming" },
            { key: "sticky-wall", icon: "🧷", label: "Sticky Wall" },
          ].map(({ key, icon, label }) => (
            <li key={key} className="nav-item">
              <button
                className={`nav-link text-white border-0 bg-transparent w-100 text-start ${
                  activeView === key ? "bg-primary bg-opacity-75 rounded" : ""
                }`}
                onClick={() => setActiveView(key)}
              >
                {icon} {label}
              </button>
            </li>
          ))}
        </ul>

        <h6 className="mb-3">Lists</h6>
        <ul className="nav flex-column">
          {userLists.map((list, index) => (
            <li key={index} className="nav-item d-flex align-items-center mb-2">
              <button
                className={`nav-link text-white border-0 bg-transparent flex-grow-1 text-start ${
                  selectedList === list.name
                    ? "bg-primary bg-opacity-50 rounded"
                    : ""
                }`}
                onClick={() =>
                  setSelectedList(selectedList === list.name ? null : list.name)
                }
              >
                <span className={`color-tag bg-${list.color} me-2`}></span>
                {list.name}
              </button>
              <button
                className="btn btn-sm btn-outline-light ms-2"
                onClick={() => handleEditList(list)}
              >
                Edit
              </button>
            </li>
          ))}
          <li className="mt-3">
            <button
              className="btn btn-outline-light btn-sm w-100"
              onClick={() => setShowAddListModal(true)}
            >
              + Add List
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-4" style={{ backgroundColor: "#f8f9fa" }}>
        {activeView === "sticky-wall" && renderStickyWall()}
        {activeView === "calendar" && renderCalendar()}
        {activeView === "today" && renderTodayTasks()}
        {activeView === "upcoming" && renderUpcomingTasks()}
      </div>

      {/* Add/Edit Task Modal */}
      {showAddModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAddModal(false);
          }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingNote ? "Edit Task" : "Add New Task"}
                </h5>
                <button
                  className="btn-close"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingNote(null);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Title *</label>
                  <input
                    className="form-control"
                    placeholder="Enter task title"
                    value={newNote.title}
                    onChange={(e) =>
                      setNewNote({ ...newNote, title: e.target.value })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Enter task description"
                    value={newNote.content}
                    onChange={(e) =>
                      setNewNote({ ...newNote, color: e.target.value })
                    }
                  ></textarea>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Due Date</label>
                    <input
                      className="form-control"
                      type="date"
                      value={newNote.dueDate}
                      onChange={(e) =>
                        setNewNote({ ...newNote, dueDate: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Time</label>
                    <input
                      className="form-control"
                      type="time"
                      value={newNote.time}
                      onChange={(e) =>
                        setNewNote({ ...newNote, time: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Duration (minutes)</label>
                    <input
                      className="form-control"
                      type="number"
                      placeholder="30"
                      value={newNote.duration}
                      onChange={(e) =>
                        setNewNote({
                          ...newNote,
                          duration: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">List</label>
                    <select
                      className="form-select"
                      value={newNote.list}
                      onChange={(e) =>
                        setNewNote({ ...newNote, list: e.target.value })
                      }
                    >
                      {userLists.map((list) => (
                        <option key={list.name} value={list.name}>
                          {list.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingNote(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={editingNote ? handleUpdateNote : handleAddNote}
                  disabled={!newNote.title.trim()}
                >
                  {editingNote ? "Update Task" : "Add Task"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add List Modal */}
      {showAddListModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAddListModal(false);
          }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New List</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowAddListModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">List Name *</label>
                  <input
                    className="form-control"
                    placeholder="Enter list name"
                    value={newList.name}
                    onChange={(e) =>
                      setNewList({ ...newList, name: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Color</label>
                  <select
                    className="form-select"
                    value={newList.color}
                    onChange={(e) =>
                      setNewList({ ...newList, color: e.target.value })
                    }
                  >
                    <option value="info">Blue</option>
                    <option value="danger">Red</option>
                    <option value="success">Green</option>
                    <option value="warning">Yellow</option>
                    <option value="secondary">Gray</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowAddListModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleAddList}
                  disabled={!newList.name.trim()}
                >
                  Add List
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit List Modal */}
      {showEditListModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowEditListModal(false);
          }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit List</h5>
                <button
                  className="btn-close"
                  onClick={() => {
                    setShowEditListModal(false);
                    setEditingList(null);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">List Name *</label>
                  <input
                    className="form-control"
                    placeholder="Enter list name"
                    value={editList.name}
                    onChange={(e) =>
                      setEditList({ ...editList, name: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Color</label>
                  <select
                    className="form-select"
                    value={editList.color}
                    onChange={(e) =>
                      setEditList({ ...editList, color: e.target.value })
                    }
                  >
                    <option value="info">Blue</option>
                    <option value="danger">Red</option>
                    <option value="success">Green</option>
                    <option value="warning">Yellow</option>
                    <option value="secondary">Gray</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowEditListModal(false);
                    setEditingList(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleUpdateList}
                  disabled={!editList.name.trim()}
                >
                  Update List
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .timeline-container {
          max-height: 600px;
          overflow-y: auto;
          border: 1px solid #dee2e6;
          border-radius: 0.375rem;
          background: white;
        }

        .timeline-slot {
          display: flex;
          min-height: 60px;
          border-bottom: 1px solid #f1f3f4;
        }

        .timeline-hour {
          width: 80px;
          padding: 10px;
          text-align: right;
          background: #f8f9fa;
          border-right: 1px solid #dee2e6;
          font-size: 0.875rem;
          font-weight: 500;
          color: #6c757d;
        }

        .timeline-events {
          flex: 1;
          padding: 5px;
        }

        .timeline-event {
          margin: 2px 0;
          border-radius: 0.375rem;
          border: 1px solid rgba(0, 0, 0, 0.1);
          background-opacity: 0.1 !important;
        }

        .event-content {
          display: flex;
          align-items: center;
          padding: 8px 12px;
          height: 100%;
        }

        .event-title {
          font-weight: 500;
          font-size: 0.875rem;
        }

        .calendar-grid {
          background: white;
          border-radius: 0.5rem;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .calendar-weekdays {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          background: #495057;
          color: white;
        }

        .weekday-header {
          padding: 12px 8px;
          text-align: center;
          font-weight: 600;
        }

        .calendar-body {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          grid-template-rows: repeat(6, 1fr);
        }

        .calendar-day {
          border: 1px solid #e9ecef;
          padding: 8px 6px;
          min-height: 100px;
          position: relative;
          cursor: pointer;
          transition: all 0.2s;
          background: white;
          display: flex;
          flex-direction: column;
        }

        .calendar-day:hover {
          background-color: #f8f9fa;
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .calendar-day.other-month {
          background-color: #f8f9fa;
          color: #adb5bd;
        }

        .calendar-day.current-month {
          background-color: white;
          color: #212529;
        }

        .calendar-day.today {
          background-color: #e3f2fd;
          border: 2px solid #2196f3;
          font-weight: bold;
        }

        .calendar-day.selected {
          background-color: #d1e7dd;
          border: 2px solid #28a745;
          font-weight: bold;
        }

        .day-number {
          font-weight: 600;
          margin-bottom: 4px;
          font-size: 0.9rem;
        }

        .task-indicators {
          display: flex;
          flex-wrap: wrap;
          gap: 2px;
          margin-top: 4px;
        }

        .task-indicator {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        .task-indicator-more {
          font-size: 0.65rem;
          color: #6c757d;
          font-weight: 600;
        }

        .task-preview {
          flex-grow: 1;
          margin-top: 4px;
          overflow: hidden;
        }

        .task-preview-item {
          display: flex;
          align-items: center;
          margin-bottom: 2px;
          font-size: 0.7rem;
          line-height: 1.2;
        }

        .task-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          margin-right: 4px;
          flex-shrink: 0;
        }

        .task-text {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: #495057;
        }

        .task-preview-more {
          font-size: 0.65rem;
          color: #6c757d;
          font-style: italic;
        }

        .sticky-note {
          cursor: pointer;
          transition: all 0.2s ease;
          border-left: 4px solid transparent;
        }

        .sticky-note:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .nav-link:hover {
          background-color: rgba(255, 255, 255, 0.1) !important;
        }

        .color-tag {
          width: 12px;
          height: 12px;
          border-radius: 3px;
          display: inline-block;
        }
      `}</style>
    </div>
  );
}

export default ToDo;
