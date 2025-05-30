import React from "react";
//import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import AdminHome from "./Admin/AdminHome";
import UserForm from "./Components/UserForm";
import Logs from "./Admin/Logs"; 
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/adminhome" element={<AdminHome />} />
        <Route path="/userform" element={<UserForm />} />
        <Route path="/Logs" element={<Logs />} />
      </Routes>
    </div>
  );
}
 
export default App;
