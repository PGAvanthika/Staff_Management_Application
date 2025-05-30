import React, { useEffect, useState } from "react";
import "./AdminHome.css";
import UserCard from "../Components/UserCard";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Profile from "../Components/Profile";
import { Link } from "react-router-dom";

// Then in JSX:
<Link to="/Logs">View Logs</Link>;



const AdminHome = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [showProfile, setShowProfile] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");

  const fetchUsers = async (role = "") => {
    try {
      const response = await axios.get("http://localhost:3001/api/user/all", {
        params: { role: role || undefined }, // include only if role is selected
      });

      const formatted = response.data.map((user) => ({
        name: `${user.fname} ${user.lname}`,
        role: user.role || "No role",
        imageSrc: user.profilepic || "/images/default-user.jpg",
      }));

      setUsers(formatted);
      setFilteredUsers(
        formatted.filter((u) =>
          u.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = users.filter((user) =>
      user.name.toLowerCase().includes(value)
    );
    setFilteredUsers(filtered);
  };

  // Handle role dropdown
  const handleRoleChange = (e) => {
    const role = e.target.value;
    setSelectedRole(role);
    fetchUsers(role); // server call based on role
  };

  const handleAddUser = () => navigate("/UserForm");

  const handleProfile = () => {
    setShowProfile(true);
  }

  const handleCloseProfile = () => {
    setShowProfile(false);
  }

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
      {showProfile && <Profile onClose={handleCloseProfile} />}
      <header className="top-nav">
        <button className="profile-btn" onClick={handleProfile}>
          <ion-icon name="person-circle-outline"></ion-icon>
        </button>
        <nav>
          <a href="#">Home</a>
          <Link to="/Logs">View Logs</Link>
        </nav>
        <button className="logout-btn" onClick={handleLogOut}>
          <ion-icon name="power-outline"></ion-icon>
        </button>
      </header>

      <div className="search-bar">
        <div className="search-input-wrapper">
          <ion-icon name="search-outline" className="search-icon"></ion-icon>
          <input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <select value={selectedRole} onChange={handleRoleChange}>
          <option value="">All Roles</option>
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
        {filteredUsers.length === 0 ? (
          <p>No users found.</p>
        ) : (
          filteredUsers.map((user, index) => (
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
