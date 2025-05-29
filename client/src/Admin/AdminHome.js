import React, { useEffect, useState } from "react";
import "./AdminHome.css";
import UserCard from "../Components/UserCard";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminHome = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/user/all")
      .then((res) => {
        const formattedUsers = res.data.map((user) => ({
          name: `${user.fname} ${user.lname}`,
          role: user.role || "No role specified",
          imageSrc: user.profilepic || "/images/default-user.jpg",
        }));
        setUsers(formattedUsers);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
      });
  }, []);

  const handleAddUser = () => {
    navigate("/UserForm");
  };

  const handleLogOut = async () => {
    try {
      await fetch("http://localhost:3001/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="admin-home">
      <header className="top-nav">
        <button className="profile-btn">
          <ion-icon name="person-circle-outline"></ion-icon>
        </button>
        <nav>
          <a href="#">Home</a>
          <a href="#">View Logs</a>
        </nav>
        <button className="logout-btn" onClick={handleLogOut}>
          <ion-icon name="power-outline"></ion-icon>
        </button>
      </header>

      <div className="search-bar">
        <div className="search-input-wrapper">
          <ion-icon name="search-outline" className="search-icon"></ion-icon>
          <input type="text" placeholder="Search" />
        </div>

        {/* Filter Dropdown (No button) */}
        <select defaultValue="">
          <option value="" disabled>
            Filter by Role
          </option>
          <option value="Developer">Developer</option>
          <option value="Designer">Designer</option>
          <option value="Manager">Manager</option>
          <option value="Tester">Tester</option>
          <option value="Intern">Intern</option>
        </select>

        <button className="add-user-btn" onClick={handleAddUser}>
          <ion-icon name="add-outline" className="plus-icon"></ion-icon>
          Add new user
        </button>
      </div>

      <div className="user-grid">
        {users.length === 0 ? (
          <p>Loading users...</p>
        ) : (
          users.map((user, index) => (
            <UserCard
              key={index}
              name={user.name}
              role={user.role}
              imageSrc={user.imageSrc}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default AdminHome;
