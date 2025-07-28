import React, { useState, useEffect } from "react";
import { Doughnut, Bar, Line } from "react-chartjs-2";
import { useAuth } from "../context/AuthContext";
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
  const [kpiData, setKpiData] = useState(null);
  const [dailyPerformance, setDailyPerformance] = useState([]);
  const [monthlyProgress, setMonthlyProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        console.log('=== FETCHING DASHBOARD DATA ===');
        console.log('User:', user);
        
        // Fetch KPI data
        console.log('Fetching KPI data...');
        const kpiResponse = await fetch("http://localhost:3001/api/tasks/kpi", {
          credentials: "include",
        });
        
        console.log('KPI Response status:', kpiResponse.status);
        console.log('KPI Response headers:', kpiResponse.headers);
        
        if (!kpiResponse.ok) {
          const errorText = await kpiResponse.text();
          console.error('KPI Response error:', errorText);
          throw new Error(`Failed to fetch KPI data: ${kpiResponse.status} ${errorText}`);
        }
        
        const kpiResult = await kpiResponse.json();
        console.log('KPI Result:', kpiResult);
        setKpiData(kpiResult);

        // Fetch daily performance data
        console.log('Fetching daily performance data...');
        const dailyResponse = await fetch("http://localhost:3001/api/tasks/daily-performance", {
          credentials: "include",
        });
        
        console.log('Daily Response status:', dailyResponse.status);
        
        if (!dailyResponse.ok) {
          const errorText = await dailyResponse.text();
          console.error('Daily Response error:', errorText);
          throw new Error(`Failed to fetch daily performance data: ${dailyResponse.status} ${errorText}`);
        }
        
        const dailyResult = await dailyResponse.json();
        console.log('Daily Result:', dailyResult);
        setDailyPerformance(dailyResult);

        // Fetch monthly progress data
        console.log('Fetching monthly progress data...');
        const monthlyResponse = await fetch("http://localhost:3001/api/tasks/monthly-progress", {
          credentials: "include",
        });
        
        console.log('Monthly Response status:', monthlyResponse.status);
        
        if (!monthlyResponse.ok) {
          const errorText = await monthlyResponse.text();
          console.error('Monthly Response error:', errorText);
          throw new Error(`Failed to fetch monthly progress data: ${monthlyResponse.status} ${errorText}`);
        }
        
        const monthlyResult = await monthlyResponse.json();
        console.log('Monthly Result:', monthlyResult);
        setMonthlyProgress(monthlyResult);

      } catch (err) {
        console.error("Dashboard data fetch error:", err);
        console.error("Error details:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  // Prepare chart data
  const doughnutData = {
    labels: ["Completed", "Remaining"],
    datasets: [
      {
        data: kpiData ? [kpiData.completed, kpiData.active + kpiData.overdue] : [0, 0],
        backgroundColor: ["#3c658e", "#d6d6d6"],
        borderWidth: 0,
      },
    ],
  };

  const barData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Daily Performance",
        data: dailyPerformance.length > 0 
          ? dailyPerformance.map(day => day.performance)
          : [0, 0, 0, 0, 0, 0, 0],
        backgroundColor: "#3c658e",
      },
    ],
  };

  const lineData = {
    labels: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ],
    datasets: [
      {
        label: "Monthly Progress",
        data: monthlyProgress.length > 0 
          ? monthlyProgress.map(month => month.progress)
          : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        fill: true,
        backgroundColor: "rgba(60, 101, 142, 0.2)",
        borderColor: "#3c658e",
        tension: 0.4,
      },
    ],
  };

  if (!user) {
    return (
      <div className="dashboard-container">
        <div className="text-center p-4">
          <div className="alert alert-warning" role="alert">
            Please log in to view your dashboard.
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="text-center p-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="alert alert-danger" role="alert">
          Error loading dashboard: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="summary-section">
        <div className="summary-card">
          <h2>{kpiData?.totalTasks || 0}</h2>
          <p>Total Tasks</p>
        </div>
        <div className="summary-card">
          <h2>{kpiData?.overdue || 0}</h2>
          <p>Tasks Overdue</p>
        </div>
        <div className="summary-card">
          <h2>{kpiData?.kpi || 0}%</h2>
          <p>KPI Score</p>
        </div>
        <div className="summary-card">
          <h2>{kpiData?.active || 0}</h2>
          <p>Active Tasks</p>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-card">
          <h5>OVERALL PERFORMANCE</h5>
          <Doughnut data={doughnutData} />
          <p className="chart-footer">
            {kpiData?.kpi >= 80 ? "Excellent" : 
             kpiData?.kpi >= 60 ? "Good" : 
             kpiData?.kpi >= 40 ? "Fair" : "Needs Improvement"}
          </p>
        </div>

        <div className="chart-card">
          <h5>DAILY PERFORMANCE</h5>
          <Bar data={barData} />
        </div>
      </div>

      <div className="line-chart-section">
        <h5>Monthly Progress</h5>
        <Line data={lineData} />
      </div>

      {/* Additional KPI Details */}
      <div className="kpi-details mt-4">
        <div className="row">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h6 className="card-title">Task Completion Breakdown</h6>
                <ul className="list-unstyled">
                  <li>✅ Completed tasks: {kpiData?.completed || 0}</li>
                  <li>📋 Active tasks: {kpiData?.active || 0}</li>
                  <li>🚨 Overdue tasks: {kpiData?.overdue || 0}</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h6 className="card-title">Performance Metrics</h6>
                <ul className="list-unstyled">
                  <li>🎯 KPI Score: {kpiData?.kpi || 0}%</li>
                  <li>📊 Completion Rate: {kpiData?.completionRate || 0}%</li>
                  <li>📈 Completion Rate: {kpiData?.completionRate || 0}%</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardUI;
