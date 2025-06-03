import React from "react";
import { Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import LoginPage from "./Pages/LoginPage";
import AdminHome from "./Admin/AdminHome";
import UserForm from "./Components/UserForm";
import Logs from "./Admin/Logs"; 
import ManagerHome from "./Manager/ManagerHome";
import TaskAllocation from "./Components/TaskAllocation";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/UserForm/:id" element={<UserForm />} />{" "}
        {/* For editing user by ID */}
        <Route path="/UserForm" element={<UserForm />} />{" "}
        {/* For creating new user */}
        <Route path="/adminhome" element={<AdminHome />} />
        <Route path="/Logs" element={<Logs />} />
        <Route path="/ManagerHome" element={<ManagerHome />} />
        <Route path="/Components/TaskAllocation" element={<TaskAllocation />}/>
      </Routes>
    </div>
  );
}
 
export default App;
