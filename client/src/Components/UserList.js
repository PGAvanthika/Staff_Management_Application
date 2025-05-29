import React, { useEffect, useState } from "react";
import UserCard from "./UserCard";
import "./UserList.css"; // Optional: For layout styling
import axios from "axios";

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3001/api/user/all")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  return (
    <div className="user-list-container">
      {users.map((user) => (
        <UserCard
          key={user.id}
          name={`${user.fname} ${user.lname}`}
          role={user.role}
          imageSrc="https://via.placeholder.com/80" // Replace with user.profileImage if available
        />
      ))}
    </div>
  );
};

export default UserList;
