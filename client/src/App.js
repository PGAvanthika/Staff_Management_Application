import React, { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginPage from "./Pages/LoginPage";
import AdminHome from "./Admin/AdminHome";
import UserForm from "./Components/UserForm";
import Logs from "./Admin/Logs"; 
import ManagerHome from "./Manager/ManagerHome";
import TaskAllocation from "./Components/TaskAllocation";

import Tlhome from "./TeamLead/Tlhome";
import EmployeeHome from "./Employee/Employee/EmployeeHome";

// Protected Route component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// AuthRedirector component
function AuthRedirector() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only run on the login page
    if (location.pathname === "/") {
      fetch("http://13.49.158.152:3001/api/auth/validate", {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.user && data.user.role) {
            // Redirect based on role
            switch (data.user.role) {
              case "Admin":
                navigate("/adminhome");
                break;
              case "team_leader":
                navigate("/Tlhome");
                break;
              case "Manager":
                navigate("/ManagerHome");
                break;
              case "employee":
                navigate("/EmployeeHome");
                break;
              default:
                break;
            }
          }
        });
    }
  }, [location, navigate]);

  return null; // This component does not render anything
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />

      {/* Protected Admin Routes */}
      <Route
        path="/adminhome"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <AdminHome />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Logs"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <Logs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/UserForm/:id"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <UserForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/UserForm"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <UserForm />
          </ProtectedRoute>
        }
      />

      {/* Protected Manager Routes */}
      <Route
        path="/ManagerHome"
        element={
          <ProtectedRoute allowedRoles={["Manager"]}>
            <ManagerHome />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Components/TaskAllocation"
        element={
          <ProtectedRoute allowedRoles={["Manager"]}>
            <TaskAllocation />
          </ProtectedRoute>
        }
      />

      <Route
        path="/Tlhome"
        element={
          <ProtectedRoute allowedRoles={["team_leader"]}>
            {" "}
            <Tlhome />
          </ProtectedRoute>
        }
      />

      <Route
        path="/employeehome/*"
        element={
          <ProtectedRoute allowedRoles={["employee"]}>
            <EmployeeHome />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <AuthRedirector />
        <AppRoutes />
      </AuthProvider>
    </div>
  );
}

export default App;
