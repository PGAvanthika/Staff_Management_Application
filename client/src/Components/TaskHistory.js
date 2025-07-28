import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const TaskHistory = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  useEffect(() => {
    fetchHistory();
  }, [year, month]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const endpoint = user.role === 'manager' 
        ? `http://localhost:3001/api/tasks/manager/history?year=${year}&month=${month}`
        : `http://localhost:3001/api/tasks/history?year=${year}&month=${month}`;
      
      const response = await fetch(endpoint, {
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to fetch history");
      const data = await response.json();
      setHistory(data);
      setError("");
    } catch (err) {
      setError("Failed to fetch task history");
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const handleYearChange = (e) => {
    setYear(parseInt(e.target.value));
  };

  const handleMonthChange = (e) => {
    setMonth(parseInt(e.target.value));
  };

  const getMonthName = (month) => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return months[month - 1];
  };

  const getStatusBadge = (task) => {
    if (task.task_status === 'completed') {
      return <span className="badge bg-success">Completed On Time</span>;
    } else if (task.task_status === 'completed_overdue') {
      return <span className="badge bg-warning text-dark">Completed Overdue</span>;
    }
    return <span className="badge bg-secondary">{task.task_status}</span>;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return "Invalid Date";
    }
  };

  if (!user) {
    return (
      <div className="min-vh-100 w-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: "#7d98a5" }}>
        <div className="text-center">
          <h3>Please log in to view task history</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 w-100 py-4 px-2" style={{ backgroundColor: "#7d98a5" }}>
      <div className="rounded shadow p-4 mx-auto" style={{ backgroundColor: "#c7e8f3", width: "90%", maxWidth: "1200px" }}>
        <h2 className="text-center fw-bold mb-4" style={{ color: "#1d2b53" }}>
          TASK HISTORY
        </h2>

        {/* Filter Controls */}
        <div className="row mb-4">
          <div className="col-md-6">
            <label className="form-label fw-bold">Year:</label>
            <select 
              className="form-select" 
              value={year} 
              onChange={handleYearChange}
            >
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label fw-bold">Month:</label>
            <select 
              className="form-select" 
              value={month} 
              onChange={handleMonthChange}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                <option key={m} value={m}>{getMonthName(m)}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading task history...</p>
          </div>
        )}

        {/* History Display */}
        {!loading && (
          <div>
            <h4 className="mb-3">
              Completed Tasks for {getMonthName(month)} {year}
            </h4>

            {history.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-muted">No completed tasks found for this month.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead className="table-dark">
                    <tr>
                      <th>Task ID</th>
                      <th>Project</th>
                      <th>Description</th>
                      {user.role === 'manager' && <th>Employee</th>}
                      <th>Original Deadline</th>
                      <th>Extended Deadline</th>
                      <th>Status</th>
                      <th>Assigned By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((task) => (
                      <tr key={task.task_id}>
                        <td className="fw-bold">{task.task_id}</td>
                        <td>
                          <span className="badge bg-info text-dark">
                            {task.project_name} ({task.project_id})
                          </span>
                        </td>
                        <td>{task.description}</td>
                        {user.role === 'manager' && (
                          <td>
                            <span className="text-primary fw-bold">
                              {task.assigned_to_email}
                            </span>
                          </td>
                        )}
                        <td>{formatDate(task.deadline)}</td>
                        <td>
                          {task.effective_deadline && task.effective_deadline !== task.deadline 
                            ? formatDate(task.effective_deadline)
                            : "N/A"
                          }
                        </td>
                        <td>{getStatusBadge(task)}</td>
                        <td>
                          <small className="text-muted">{task.assigned_by_email}</small>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Summary Statistics */}
            {history.length > 0 && (
              <div className="row mt-4">
                <div className="col-md-4">
                  <div className="card bg-success text-white">
                    <div className="card-body text-center">
                      <h5 className="card-title">On Time</h5>
                      <h3 className="mb-0">
                        {history.filter(t => t.task_status === 'completed').length}
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card bg-warning text-dark">
                    <div className="card-body text-center">
                      <h5 className="card-title">Overdue</h5>
                      <h3 className="mb-0">
                        {history.filter(t => t.task_status === 'completed_overdue').length}
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card bg-info text-white">
                    <div className="card-body text-center">
                      <h5 className="card-title">Total</h5>
                      <h3 className="mb-0">{history.length}</h3>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskHistory; 