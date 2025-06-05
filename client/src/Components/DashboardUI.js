import React from "react";
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
const lineData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
};

const DashboardUI = () => {
  const doughnutData = {
    labels: ["Completed", "Remaining"],
    datasets: [
      {
        data: [78, 22],
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
        data: [20, 30, 45, 55, 70, 60, 50],
        backgroundColor: "#3c658e",
      },
    ],
  };

  const lineData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Monthly Progress",
        data: [15, 25, 35, 50, 45, 50, 70, 85, 90, 80, 75, 65],
        fill: true,
        backgroundColor: "rgba(60, 101, 142, 0.2)",
        borderColor: "#3c658e",
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="dashboard-container">
      <div className="summary-section">
        <div className="summary-card">
          <h2>28</h2>
          <p>Tasks Completed</p>
        </div>
        <div className="summary-card">
          <h2>5</h2>
          <p>Tasks Overdue</p>
        </div>
        <div className="summary-card">
          <h2>$12.5k</h2>
          <p>Sales</p>
        </div>
        <div className="summary-card">
          <h2>15</h2>
          <p>Meetings</p>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-card">
          <h5>OVERALL PERFORMANCE</h5>
          <Doughnut data={doughnutData} />
          <p className="chart-footer">Good</p>
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
    </div>
  );
};

export default DashboardUI;
