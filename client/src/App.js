import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import AdminHome from "./Admin/AdminHome";
import UserForm from "./Components/UserForm";
import Logs from "./Admin/Logs"; 

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/UserForm/:id" element={<UserForm />} /> {/* For editing user by ID */}
        <Route path="/UserForm" element={<UserForm />} /> {/* For creating new user */}
        <Route path="/adminhome" element={<AdminHome />} />
        <Route path="/Logs" element={<Logs />} />
      </Routes>
    </div>
  );
}
 
export default App;
