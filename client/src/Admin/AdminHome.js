import React from "react";
import "./AdminHome.css";
import UserCard from "../Components/UserCard";
import { useNavigate } from "react-router-dom";

const dummyUsers = [
  {
    name: "Yuthish",
    role: "cybersecurity enthusiast",
    imageSrc: "/images/user1.jpg",
  },
  {
    name: "Avanthika PG",
    role: "DevOps enthusiast",
    imageSrc: "/images/user2.jpg",
  },
  { name: "Shreya Sri", role: "Team Lead", imageSrc: "/images/user3.jpg" },
  // Add more dummy users as needed
];

const AdminHome = () => {
  const navigate = useNavigate();

  const handleAddUser = () => {
    navigate("/UserForm"); // navigate to your desired route
  };
  const handleLogOut = () => {
    navigate("/");
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
          <ion-icon name="search-outline" class="search-icon"></ion-icon>
          <input type="text" placeholder="Search" />
        </div>
        <button className="filter-btn">Filter</button>
        <button className="add-user-btn" onClick={handleAddUser}>
          <ion-icon name="add-outline" class="plus-icon"></ion-icon>
          Add new user
        </button>
      </div>
      

      <div className="user-grid">
        {dummyUsers.map((user, index) => (
          <UserCard
            key={index}
            name={user.name}
            role={user.role}
            imageSrc={user.imageSrc}
          />
        ))}
      </div>
    </div>
  );
};

export default AdminHome;
