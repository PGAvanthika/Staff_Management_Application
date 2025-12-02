import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

function ToDo() {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState("sticky-wall");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddListModal, setShowAddListModal] = useState(false);
  const [showEditListModal, setShowEditListModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [editingList, setEditingList] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedList, setSelectedList] = useState(null);
  const [selectedTodayDate, setSelectedTodayDate] = useState(new Date()); // NEW

  // Fetch lists and notes from backend
  const [userLists, setUserLists] = useState([]);
  const [stickyNotes, setStickyNotes] = useState([]);

  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    list_id: "",
    due_date: "",
    due_time: "09:00",
    duration_minutes: 30,
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

  // Fetch lists and notes on mount
  useEffect(() => {
    if (!user) return;
    fetchLists();
    fetchNotes();
  }, [user]);

  const fetchLists = async () => {
    try {
      const res = await axios.get("http://13.49.158.152:3001/api/lists", { withCredentials: true });
      setUserLists(res.data);
    } catch (err) {
      setUserLists([]);
    }
  };

  const fetchNotes = async () => {
    try {
      const res = await axios.get("http://13.49.158.152:3001/api/notes", { withCredentials: true });
      // Normalize due_date to yyyy-mm-dd for all notes
      const normalizedNotes = res.data.map(note => {
        let due_date = note.due_date;
        if (!due_date) {
          due_date = "";
        } else if (/^\d{2}-\d{2}-\d{4}$/.test(due_date)) {
          const [dd, mm, yyyy] = due_date.split('-');
          due_date = `${yyyy}-${mm}-${dd}`;
        } else if (due_date.length > 10) {
          due_date = due_date.split('T')[0];
        } else if (/^\d{4}-\d{2}-\d{2}$/.test(due_date)) {
          // already normalized
        } else {
          const d = new Date(due_date);
          if (!isNaN(d)) {
            due_date = d.toISOString().split('T')[0];
          }
        }
        return { ...note, due_date: due_date.toString() };
      });
      setStickyNotes(normalizedNotes);
      console.log('Fetched stickyNotes:', normalizedNotes);
    } catch (err) {
      setStickyNotes([]);
    }
  };

  // Add, edit, delete list
  const handleAddList = async () => {
    if (newList.name.trim()) {
      await axios.post("http://13.49.158.152:3001/api/lists", newList, { withCredentials: true });
      setNewList({ name: "", color: "secondary" });
      setShowAddListModal(false);
      fetchLists();
    }
  };

  const handleEditList = (list) => {
    setEditingList(list);
    setEditList({ name: list.name, color: list.color });
    setShowEditListModal(true);
  };

  const handleUpdateList = async () => {
    if (editingList && editList.name.trim()) {
      await axios.put(`http://13.49.158.152:3001/api/lists/${editingList.id}`, editList, { withCredentials: true });
      setEditingList(null);
      setEditList({ name: "", color: "secondary" });
      setShowEditListModal(false);
      fetchLists();
    }
  };

  const handleDeleteList = async (id) => {
    await axios.delete(`http://13.49.158.152:3001/api/lists/${id}`, { withCredentials: true });
    fetchLists();
  };

  // Add, edit, delete note
  const handleAddNote = async () => {
    if (newNote.title.trim() && newNote.list_id) {
      // Convert dd-mm-yyyy to yyyy-mm-dd if needed
      let due_date = newNote.due_date;
      if (due_date && /^\d{2}-\d{2}-\d{4}$/.test(due_date)) {
        const [dd, mm, yyyy] = due_date.split('-');
        due_date = `${yyyy}-${mm}-${dd}`;
      } else if (due_date && due_date.length > 10) {
        // If due_date is in ISO format, extract the date part
        due_date = due_date.split('T')[0];
      }
      // Ensure content is an array
      let contentArr = newNote.content;
      if (typeof contentArr === "string") {
        contentArr = contentArr.split('\n').map(line => line.trim()).filter(Boolean);
      }
      if (!Array.isArray(contentArr)) contentArr = [String(contentArr)];
      const payload = {
        ...newNote,
        due_date,
        content: contentArr,
        user_id: user?.id,
      };
      try {
        const response = await axios.post("http://13.49.158.152:3001/api/notes", payload, { withCredentials: true });
        setNewNote({ title: "", content: "", list_id: "", due_date: "", due_time: "09:00", duration_minutes: 30, completed: false });
        setShowAddModal(false);
        fetchNotes();
      } catch (error) {
        if (error.response) {
          if (error.response.status === 400) {
        alert('Failed to create note. Please try again.');
      }
        }
      }
    }
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setNewNote({
      title: note.title,
      content: Array.isArray(note.content) ? note.content.join("\n") : note.content,
      list_id: note.list_id,
      due_date: note.due_date,
      due_time: note.due_time,
      duration_minutes: note.duration_minutes,
      completed: note.completed,
    });
    setShowAddModal(true);
  };

  const handleUpdateNote = async () => {
    if (editingNote && newNote.title.trim() && newNote.list_id) {
      // Convert dd-mm-yyyy to yyyy-mm-dd if needed
      let due_date = newNote.due_date;
      if (due_date && /^\d{2}-\d{2}-\d{4}$/.test(due_date)) {
        const [dd, mm, yyyy] = due_date.split('-');
        due_date = `${yyyy}-${mm}-${dd}`;
      } else if (due_date && due_date.length > 10) {
        // If due_date is in ISO format, extract the date part
        due_date = due_date.split('T')[0];
      }
      // Convert content to array if it's a string
      const payload = {
        ...newNote,
        due_date,
        content: Array.isArray(newNote.content)
          ? newNote.content
          : newNote.content.split('\n').map(line => line.trim()).filter(Boolean),
        user_id: user?.id || editingNote.user_id, // ensure user_id is present
      };
      await axios.put(`http://13.49.158.152:3001/api/notes/${editingNote.id}`, payload, { withCredentials: true });
      setEditingNote(null);
      setNewNote({ title: "", content: "", list_id: "", due_date: "", due_time: "09:00", duration_minutes: 30, completed: false });
      setShowAddModal(false);
      fetchNotes();
    }
  };

  const handleDeleteNote = async (id) => {
    await axios.delete(`http://13.49.158.152:3001/api/notes/${id}`, { withCredentials: true });
    fetchNotes();
  };

  const handleToggleComplete = (id) => {
    setStickyNotes(
      stickyNotes.map((note) =>
        note.id === id ? { ...note, completed: !note.completed } : note
      )
    );
  };

  const getTasksForDate = (date) => {
    const dateStr = date.toISOString().split("T")[0];
    return stickyNotes.filter((note) => {
      if (!note.due_date) return false;
      let noteDate = note.due_date;
      // If due_date is a string with time, extract only the date part
      if (typeof noteDate === "string" && noteDate.includes("T")) {
        noteDate = noteDate.split("T")[0];
      }
      // If due_date is a Date object
      if (noteDate instanceof Date) {
        noteDate = noteDate.toISOString().split("T")[0];
      }
      return noteDate === dateStr;
    });
  };

  // Helper to format date as YYYY-MM-DD
  const formatDate = (date) => {
    if (!date) return "";
    if (typeof date === "string" && date.length === 10 && date.includes("-")) {
      // If DD-MM-YYYY, convert to YYYY-MM-DD
      if (/^\d{2}-\d{2}-\d{4}$/.test(date)) {
        const [dd, mm, yyyy] = date.split('-');
        return `${yyyy}-${mm}-${dd}`;
      }
      // If already YYYY-MM-DD
      if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
    }
    const d = new Date(date);
    if (!isNaN(d)) return d.toISOString().split("T")[0];
    return "";
  };

  // When user picks a date, always store as YYYY-MM-DD string
  const handleTodayDateChange = (e) => {
    setSelectedTodayDate(formatDate(e.target.value));
  };

  // Update getTasksForView to use robust date comparison
  const getTasksForView = (view) => {
    const today = formatDate(selectedTodayDate); // For 'today' view
    const todayDateObj = new Date(today);
    const systemToday = formatDate(new Date()); // For 'upcoming' view
    const systemTodayObj = new Date(systemToday);
    const normalizeDate = (date) => {
      if (!date) return "";
      if (/^\d{2}-\d{2}-\d{4}$/.test(date)) {
        const [dd, mm, yyyy] = date.split('-');
        return `${yyyy}-${mm}-${dd}`;
      } else if (date.length > 10) {
        return date.split('T')[0];
      } else if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return date;
      } else {
        const d = new Date(date);
        if (!isNaN(d)) {
          return d.toISOString().split('T')[0];
        }
        return date;
      }
    };
    let result;
    switch (view) {
      case "today":
        result = stickyNotes.filter((note) => {
          const normalized = normalizeDate(note.due_date);
          return normalized === today;
        });
        return result;
      case "upcoming":
        result = stickyNotes.filter((note) => {
          const normalized = normalizeDate(note.due_date);
          if (!normalized) return false;
          // Compare as Date objects for robustness
          const noteDateObj = new Date(normalized);
          return noteDateObj >= systemTodayObj;
        });
        return result;
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
    console.log('Upcoming tasks:', upcomingTasks);
    const groupedTasks = upcomingTasks.reduce((groups, task) => {
      const date = task.due_date;
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
    return (
      <div className="today-tasks">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="mb-0">
            Today - {new Date(formatDate(selectedTodayDate)).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </h3>
          <input
            type="date"
            className="form-control ms-3"
            style={{ maxWidth: 200 }}
            value={formatDate(selectedTodayDate)}
            onChange={handleTodayDateChange}
          />
        </div>
        {todayTasks.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <p>No tasks for today. Enjoy your free time!</p>
          </div>
        ) : (
          <div className="row g-4">
            {todayTasks.map((note, idx) => {
              const list = userLists.find((l) => l.id === note.list_id);
              const listColor = (list && list.color) ? list.color : "secondary";
              let contentArr = note.content;
              if (typeof contentArr === "string") {
                try {
                  contentArr = JSON.parse(contentArr);
                } catch {
                  contentArr = [contentArr];
                }
              }
              if (!Array.isArray(contentArr)) contentArr = [String(contentArr)];
              const cardBgColor = listColor === 'blue' ? '#e3f0ff' : undefined;
              return (
                <div key={note.id || note.note_id || idx} className="col-12 col-md-6 col-lg-4 d-flex">
                  <div
                    className={`card sticky-note bg-${listColor} bg-opacity-10 border-${listColor}`}
                    onClick={() => handleEditNote(note)}
                    style={{
                      height: "260px",
                      minWidth: "100%",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                      borderRadius: "12px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      padding: "18px",
                      background: cardBgColor,
                    }}
                  >
                    <div className="d-flex align-items-start justify-content-between mb-2">
                      <h5
                        className="card-title mb-0 text-truncate"
                        style={{
                          textDecoration: note.completed ? "line-through" : "none",
                          maxWidth: "70%",
                          fontWeight: 600,
                          fontSize: "1.15rem"
                        }}
                        title={note.title}
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
                    <div
                      className="card-text mb-3 flex-grow-1 text-truncate"
                      style={{ overflowY: "auto", fontSize: "0.98rem", color: "#444" }}
                      title={Array.isArray(contentArr) ? contentArr.join("\n") : contentArr}
                    >
                      {contentArr.map((c, idx) => (
                        <div key={idx} className="small text-muted text-truncate" style={{ maxWidth: "100%" }}>
                          {c}
                        </div>
                      ))}
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-auto">
                      <small className="text-muted">
                        {note.due_date && ` ${note.due_date}`}
                        {note.due_time && ` at ${note.due_time}`}
                        {note.duration_minutes && ` • ${note.duration_minutes} min`}
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
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // 1. Define a palette of mild, unique pastel colors for calendar highlights
  const pastelColors = [
    '#ffe4e1', // light pink
    '#e1f7d5', // light green
    '#e1ecf7', // light blue
    '#fff7e1', // light yellow
    '#f7e1f7', // light purple
    '#e1f7f2', // light teal
    '#f7f3e1', // light beige
    '#f7e9e1', // light peach
  ];

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
            const dateClone = new Date(current); // Create a true copy
            const tasksForDay = getTasksForDate(dateClone);
            const isCurrentMonth = dateClone.getMonth() === month;
            const isToday =
              dateClone.toDateString() === new Date().toDateString();
            const isSelected =
              dateClone.toDateString() === selectedDate.toDateString();

            const hasNotes = tasksForDay.length > 0;
            const colorIdx = i % pastelColors.length;
            const dayBg = hasNotes ? pastelColors[colorIdx] : undefined;
            days.push(
              <div
                key={i}
                className={`calendar-day ${
                  isCurrentMonth ? "current-month" : "other-month"
                } ${isToday ? "today" : ""} ${isSelected ? "selected" : ""}`}
                onClick={() => setSelectedDate(dateClone)}
                style={{ backgroundColor: dayBg, cursor: hasNotes ? 'pointer' : undefined }}
              >
                <div className="day-number">{dateClone.getDate()}</div>
              </div>
            );

          current.setDate(current.getDate() + 1); // advance the original date
}

    const tasksForSelectedDate = getTasksForDate(selectedDate);

    return (
      <div className="calendar-container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center gap-3">
            <button
              className="btn btn-outline-primary"
              onClick={() => {
                const newDate = new Date(year, month - 1, 1);
                setSelectedDate(newDate);
              }}
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
              onClick={() => {
                const newDate = new Date(year, month + 1, 1);
                setSelectedDate(newDate);
              }}
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
              onClick={handleShowAddModal}
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
            Tasks for {selectedDate.toLocaleDateString("en-US", {
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
            <div className="list-group">
              {tasksForSelectedDate.map((note) => (
                <div key={note.id} className="list-group-item mb-3" style={{borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', background: '#fff'}}>
                  <h5 className="mb-1" style={{fontWeight: 600}}>{note.title}</h5>
                  <div style={{color: '#555'}}>
                    {Array.isArray(note.content)
                      ? note.content.map((c, idx) => <div key={idx}>{c}</div>)
                      : note.content}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderStickyWall = () => {
    const allTasks = getTasksForView(activeView);
    if (allTasks.length === 0) {
      return (
        <div className="text-center py-5 text-muted">
          <p>No tasks for now.</p>
        </div>
      );
    }
    return (
      <div
        className="container-fluid"
        style={{ overflowY: "auto", height: "calc(100vh - 60px)" }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3>Sticky Wall</h3>
          <button
            className="btn btn-primary"
            onClick={handleShowAddModal}
          >
            + Add Note
          </button>
        </div>

        <div className="row g-4">
          {stickyNotes.length === 0 ? (
            <div className="col-12 text-center text-muted py-5">
              <h5>No tasks or notes yet. Click "+ Add Note" to get started!</h5>
            </div>
          ) : (
            stickyNotes
            .filter((note) => !selectedList || note.list_id === selectedList)
            .map((note) => {
              const list = userLists.find((l) => l.id === note.list_id);
                const listColor = (list && list.color) ? list.color : "secondary";
              const listName = list?.name || "No List";
              let contentArr = note.content;
              if (typeof contentArr === "string") {
                try {
                  contentArr = JSON.parse(contentArr);
                } catch {
                  contentArr = [contentArr];
                }
              }
              if (!Array.isArray(contentArr)) contentArr = [String(contentArr)];
                const cardBgColor = listColor === 'blue' ? '#e3f0ff' : undefined;
              return (
                  <div key={note.id} className="col-12 col-md-6 col-lg-4 d-flex">
                  <div
                    className={`card sticky-note bg-${listColor} bg-opacity-10 border-${listColor}`}
                    onClick={() => handleEditNote(note)}
                      style={{
                        height: "260px",
                        minWidth: "100%",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                        borderRadius: "12px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        padding: "18px",
                        background: cardBgColor,
                      }}
                    >
                      <div className="d-flex align-items-start justify-content-between mb-2">
                        <h5
                          className="card-title mb-0 text-truncate"
                          style={{
                            textDecoration: note.completed ? "line-through" : "none",
                            maxWidth: "70%",
                            fontWeight: 600,
                            fontSize: "1.15rem"
                          }}
                          title={note.title}
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
                      <div
                        className="card-text mb-3 flex-grow-1 text-truncate"
                        style={{ overflowY: "auto", fontSize: "0.98rem", color: "#444" }}
                        title={Array.isArray(contentArr) ? contentArr.join("\n") : contentArr}
                      >
                        {contentArr.map((c, idx) => (
                          <div key={idx} className="small text-muted text-truncate" style={{ maxWidth: "100%" }}>
                            {c}
                          </div>
                        ))}
                      </div>
                      <div className="d-flex justify-content-between align-items-center mt-auto">
                        <small className="text-muted">
                          {note.due_date && ` ${note.due_date}`}
                          {note.due_time && ` at ${note.due_time}`}
                          {note.duration_minutes && ` • ${note.duration_minutes} min`}
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
              );
              })
          )}
        </div>
      </div>
    );
  };

  // Find the Personal list ID helper
  const getPersonalListId = () => {
    const personal = userLists.find((l) => l.name.toLowerCase() === "personal");
    return personal ? personal.id : (userLists[0]?.id || "");
  };

  const handleShowAddModal = () => {
    setNewNote({
      title: "",
      content: "",
      list_id: getPersonalListId(),
      due_date: formatDate(selectedTodayDate),
      due_time: "09:00",
      duration_minutes: 30,
      completed: false,
    });
    setShowAddModal(true);
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <div
        className="text-white p-3"
        style={{
          width: "250px",
          minHeight: "100vh",
          height: "100vh",
          backgroundColor: "#007bff",
          position: "sticky",
          top: 0,
          flex: '0 0 250px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
        }}
      >
        <h5 className="mb-4">YOUR TASKS</h5>

        <h6 className="mb-3">Views</h6>
        <ul className="nav flex-column mb-4">
          {[
            { key: "calendar", label: "Calendar" },
            { key: "today", label: "Today" },
            { key: "upcoming", label: "Upcoming" },
            { key: "sticky-wall", label: "Sticky Wall" },
          ].map(({ key, icon, label }) => (
            <li key={key} className="nav-item">
              <button
                className={`nav-link text-white border-0 bg-transparent w-100 text-start ${
                  activeView === key ? "bg-primary bg-opacity-75 rounded" : ""
                }`}
                onClick={() => {
                  setActiveView(key);
                  if (key === 'sticky-wall') setSelectedList(null);
                }}
              >
                {icon} {label}
              </button>
            </li>
          ))}
        </ul>

        <h6 className="mb-3">Lists</h6>
        <ul className="nav flex-column">
          {userLists.map((list, index) => (
            <li key={index} className="nav-item d-flex align-items-center mb-2" style={{gap: '8px'}}>
              <button
                className={`nav-link text-white border-0 bg-transparent flex-grow-1 text-start d-flex align-items-center ${
                  selectedList === list.id
                    ? "bg-info bg-opacity-25 text-primary fw-bold border border-primary rounded"
                    : ""
                }`}
                style={{gap: '8px', minHeight: '36px', flex: 1, paddingRight: '0'}}
                onClick={() => {
                  if (selectedList !== list.id) {
                    setSelectedList(list.id);
                    setActiveView('sticky-wall');
                }
                }}
              >
                <span className={`color-tag bg-${(list && list.color) ? list.color : "secondary"} me-2`}
                  style={{
                    display: 'inline-block',
                    width: '16px',
                    height: '16px',
                    borderRadius: '4px',
                    border: '2px solid black',
                    verticalAlign: 'middle',
                    marginRight: '8px',
                  }}
                ></span>
                <span style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '90px',
                  display: 'inline-block',
                  flexShrink: 1,
                }}>{list.name}</span>
              </button>
              <button
                className="btn btn-sm btn-outline-light ms-2"
                style={{minWidth: '38px', flexShrink: 0, flexGrow: 0, padding: '0 8px'}}
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
                      setNewNote({ ...newNote, content: e.target.value })
                    }
                  ></textarea>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Due Date</label>
                    <input
                      className="form-control"
                      type="date"
                      value={newNote.due_date}
                      onChange={(e) =>
                        setNewNote({ ...newNote, due_date: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Time</label>
                    <input
                      className="form-control"
                      type="time"
                      value={newNote.due_time}
                      onChange={(e) =>
                        setNewNote({ ...newNote, due_time: e.target.value })
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
                      value={newNote.duration_minutes}
                      onChange={(e) =>
                        setNewNote({
                          ...newNote,
                          duration_minutes: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">List</label>
                    <select
                      className="form-select"
                      value={newNote.list_id}
                      onChange={(e) =>
                        setNewNote({ ...newNote, list_id: e.target.value })
                      }
                    >
                      {userLists.map((list) => (
                        <option key={list.id} value={list.id}>
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
                  onClick={e => {
                    if (editingNote) {
                      handleUpdateNote();
                    } else {
                      handleAddNote();
                    }
                  }}
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
                    <option value="blue">Blue</option>
                    <option value="red">Red</option>
                    <option value="green">Green</option>
                    <option value="yellow">Yellow</option>
                    <option value="gray">Gray</option>
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
                  className="btn btn-outline-danger me-auto"
                  onClick={() => {
                    if (editingList) {
                      handleDeleteList(editingList.id);
                      setShowEditListModal(false);
                      setEditingList(null);
                    }
                  }}
                  title="Delete List"
                >
                  <span role="img" aria-label="delete">🗑️</span> Delete
                </button>
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
