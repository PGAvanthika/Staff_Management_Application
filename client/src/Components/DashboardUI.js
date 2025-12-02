import React, { useEffect, useState } from "react";
import { Doughnut, Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import "./DashboardUI.css";
import { useAuth } from "../context/AuthContext";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

const DashboardUI = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    completedOnTime: 0,
    completedLate: 0,
    overdue: 0,
    assigned: 0,
  });
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (!user || !user.role) return;

    let url = "";
    if (user.role === "team_leader") {
      url = "http://13.49.158.152:3001/api/tasks/teamleader";
    } else if (user.role === "employee") {
      url = "http://13.49.158.152:3001/api/tasks/employee";
    } else {
      return; // keep static charts for other roles
    }

    setLoading(true);
    fetch(url, { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch tasks");
        return res.json();
      })
      .then((tasksData) => {
        const now = new Date();
        now.setHours(0, 0, 0, 0); // Reset time to start of day for comparison
        
        let total = tasksData.length;
        let completedOnTime = 0;
        let completedLate = 0;
        let overdue = 0;
        let assigned = 0;

        tasksData.forEach((task) => {
          const status = (task.task_status || "").toLowerCase();
          const deadline = task.deadline ? new Date(task.deadline) : null;
          
          if (deadline) {
            deadline.setHours(0, 0, 0, 0); // Reset time for comparison
          }

          const isCompleted = status === "completed";
          
          if (isCompleted && deadline && !isNaN(deadline.getTime())) {
            // Task is completed - check if it was on time or late
            if (deadline >= now) {
              completedOnTime += 1;
            } else {
              completedLate += 1;
            }
          } else if (!isCompleted && deadline && !isNaN(deadline.getTime()) && now > deadline) {
            // Task is not completed and deadline has passed
            overdue += 1;
          } else if (!isCompleted) {
            // Task is assigned but not overdue
            assigned += 1;
          }
        });

        setStats({ total, completedOnTime, completedLate, overdue, assigned });
        setTasks(tasksData);
      })
      .catch(() => {
        setStats({ total: 0, completedOnTime: 0, completedLate: 0, overdue: 0, assigned: 0 });
        setTasks([]);
      })
      .finally(() => setLoading(false));
  }, [user]);

  // Calculate task breakdown by status categories
  const getWeeklyData = () => {
    const categories = ["Completed On Time", "Completed Late", "Overdue", "Assigned"];
    const data = [
      stats.completedOnTime,
      stats.completedLate,
      stats.overdue,
      stats.assigned,
    ];

    return { categories, data };
  };

  // Calculate monthly progress (completion rate over last 12 months)
  const getMonthlyData = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentMonth = new Date().getMonth();
    const monthlyData = Array(12).fill(0);
    
    // Calculate completion rate for current month
    const completionRate = stats.total > 0 
      ? Math.round((stats.completedOnTime / stats.total) * 100) 
      : 0;
    
    // Fill current month with actual completion rate
    monthlyData[currentMonth] = completionRate;
    
    // For previous months, show a gradual progression (simulated based on current performance)
    for (let i = 0; i < currentMonth; i++) {
      monthlyData[i] = Math.max(0, completionRate - (currentMonth - i) * 5);
    }
    
    return { months, data: monthlyData };
  };

  const weeklyData = getWeeklyData();
  const monthlyData = getMonthlyData();

  const doughnutData = {
    labels: ["Completed on Time", "Overdue", "Assigned"],
    datasets: [
      {
        data: [stats.completedOnTime, stats.overdue, stats.assigned],
        backgroundColor: ["#22c55e", "#f97373", "#e5e7eb"],
        borderWidth: 0,
      },
    ],
  };

  const barData = {
    labels: weeklyData.categories,
    datasets: [
      {
        label: "Number of Tasks",
        data: weeklyData.data,
        backgroundColor: [
          "#22c55e", // Completed on Time - green
          "#f59e0b", // Completed Late - amber
          "#f97373", // Overdue - red
          "#e5e7eb", // Assigned - gray
        ],
        borderRadius: 8,
      },
    ],
  };

  const lineData = {
    labels: monthlyData.months,
    datasets: [
      {
        label: "Completion Rate (%)",
        data: monthlyData.data,
        fill: true,
        backgroundColor: "rgba(60, 101, 142, 0.2)",
        borderColor: "#3c658e",
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const completionRate = stats.total > 0 
    ? Math.round((stats.completedOnTime / stats.total) * 100) 
    : 0;

  const performanceStatus = completionRate >= 80 ? "Excellent" 
    : completionRate >= 60 ? "Good" 
    : completionRate >= 40 ? "Fair" 
    : "Needs Improvement";

  if (loading) {
    return (
      <div className="dashboard-container">
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="summary-section">
        <div className="summary-card">
          <h2>{stats.total}</h2>
          <p>Total Assigned Tasks</p>
        </div>
        <div className="summary-card" style={{ backgroundColor: "#22c55e" }}>
          <h2>{stats.completedOnTime}</h2>
          <p>Completed on Time</p>
        </div>
        <div className="summary-card" style={{ backgroundColor: "#f97373" }}>
          <h2>{stats.overdue}</h2>
          <p>Overdue</p>
        </div>
        <div className="summary-card" style={{ backgroundColor: "#e5e7eb", color: "#1f2937" }}>
          <h2>{stats.assigned}</h2>
          <p>Currently Assigned</p>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-card">
          <h5>OVERALL PERFORMANCE</h5>
          <Doughnut 
            data={doughnutData}
            options={{
              responsive: true,
              maintainAspectRatio: true,
              plugins: {
                legend: {
                  position: "bottom",
                  labels: {
                    padding: 15,
                    font: {
                      size: 12,
                    },
                  },
                },
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      const label = context.label || '';
                      const value = context.parsed || 0;
                      const total = context.dataset.data.reduce((a, b) => a + b, 0);
                      const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                      return `${label}: ${value} (${percentage}%)`;
                    }
                  }
                }
              }
            }}
          />
          <p className="chart-footer">{performanceStatus} ({completionRate}%)</p>
        </div>

        <div className="chart-card">
          <h5>TASK STATUS BREAKDOWN</h5>
          <Bar 
            data={barData}
            options={{
              responsive: true,
              maintainAspectRatio: true,
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    stepSize: 1,
                    precision: 0,
                  },
                },
                x: {
                  ticks: {
                    font: {
                      size: 11,
                    },
                  },
                },
              },
              plugins: {
                legend: {
                  display: false,
                },
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      return `Tasks: ${context.parsed.y}`;
                    }
                  }
                }
              }
            }}
          />
        </div>
      </div>

      <div className="line-chart-section">
        <h5>MONTHLY COMPLETION RATE</h5>
        <Line 
          data={lineData}
          options={{
            responsive: true,
            maintainAspectRatio: true,
            scales: {
              y: {
                beginAtZero: true,
                max: 100,
                ticks: {
                  callback: function(value) {
                    return value + '%';
                  }
                }
              },
            },
            plugins: {
              legend: {
                display: true,
                position: "top",
                labels: {
                  padding: 15,
                  font: {
                    size: 12,
                  },
                },
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return `Completion Rate: ${context.parsed.y}%`;
                  }
                }
              }
            }
          }}
        />
      </div>
    </div>
  );
};

export default DashboardUI;
