import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginPage from "./Pages/LoginPage";
import AdminHome from "./Admin/AdminHome";
import UserForm from "./Components/UserForm";
import Logs from "./Admin/Logs"; 
import ManagerHome from "./Manager/ManagerHome";
import TaskAllocation from "./Components/TaskAllocation";

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
    </Routes>
  );
}

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </div>
  );
}

export default App;
