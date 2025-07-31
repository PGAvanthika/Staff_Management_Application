import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const TeamLeaderDueHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  useEffect(() => {
    fetchHistory();
  }, [selectedYear, selectedMonth]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3001/api/dues/teamleader/history?year=${selectedYear}&month=${selectedMonth}`,
        { credentials: 'include' }
      );

      if (response.ok) {
        const data = await response.json();
        setHistory(data);
        setError('');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to fetch history');
        setHistory([]);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
      setError('Failed to fetch history');
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <span className="badge bg-success">Approved</span>;
      case 'rejected':
        return <span className="badge bg-danger">Rejected</span>;
      case 'pending':
        return <span className="badge bg-warning">Pending</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ];

  return (
    <div className="min-vh-100 w-100 py-4 px-2" style={{ backgroundColor: "#7d98a5" }}>
      <div className="container">
        <h2 className="text-center fw-bold mb-4" style={{ color: "#1d2b53" }}>
          DUE EXTENSION HISTORY
        </h2>

        {/* Filter Controls */}
        <div className="row mb-4">
          <div className="col-md-6">
            <label className="form-label fw-bold">Year:</label>
            <select
              className="form-select"
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label fw-bold">Month:</label>
            <select
              className="form-select"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            >
              {months.map(month => (
                <option key={month.value} value={month.value}>{month.label}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading history...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger text-center">{error}</div>
        ) : history.length === 0 ? (
          <div className="alert alert-info text-center">
            No due extension history found for {months[selectedMonth - 1]?.label} {selectedYear}
          </div>
        ) : (
          <div className="row">
            {history.map((due, index) => (
              <div key={due.due_id || index} className="col-md-6 col-lg-4 mb-3">
                <div className="card h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h6 className="card-title mb-0">
                        {due.project_name} ({due.project_id})
                      </h6>
                      {getStatusBadge(due.status)}
                    </div>
                    
                    <p className="card-text small mb-2">
                      <strong>Task:</strong> {due.task_description || 'N/A'}
                    </p>
                    
                    <p className="card-text small mb-2">
                      <strong>Employee:</strong> {due.employee_email || 'N/A'}
                    </p>
                    
                    <p className="card-text small mb-2">
                      <strong>Manager:</strong> {due.manager_email || 'N/A'}
                    </p>
                    
                    <p className="card-text small mb-2">
                      <strong>Original Deadline:</strong> {formatDate(due.task_deadline)}
                    </p>
                    
                    <p className="card-text small mb-2">
                      <strong>Extension Request:</strong> {due.no_of_days} days
                    </p>
                    
                    <p className="card-text small mb-2">
                      <strong>Reason:</strong> {due.reason || 'N/A'}
                    </p>
                    
                    <p className="card-text small mb-2">
                      <strong>Request Date:</strong> {formatDate(due.due_date)}
                    </p>
                    
                    <p className="card-text small mb-0">
                      <strong>Processed Date:</strong> {formatDate(due.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary Statistics */}
        {history.length > 0 && (
          <div className="row mt-4">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <h6 className="card-title">Summary for {months[selectedMonth - 1]?.label} {selectedYear}</h6>
                  <div className="row text-center">
                    <div className="col-md-3">
                      <div className="text-success">
                        <h4>{history.filter(d => d.status === 'approved').length}</h4>
                        <small>Approved</small>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="text-danger">
                        <h4>{history.filter(d => d.status === 'rejected').length}</h4>
                        <small>Rejected</small>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="text-warning">
                        <h4>{history.filter(d => d.status === 'pending').length}</h4>
                        <small>Pending</small>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="text-info">
                        <h4>{history.length}</h4>
                        <small>Total</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamLeaderDueHistory; 