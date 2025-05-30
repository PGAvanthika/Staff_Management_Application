import React, { useEffect, useState } from "react";
import UserCard from "./UserCard";
import "./UserList.css";
import axios from "axios";

const UserList = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = () => {
    axios
      .get("http://localhost:3001/api/user/all")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Error fetching users:", err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUserDeleted = (deletedId) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== deletedId));
  };

  return (
    <div className="user-list-container">
      {users.map((user) => (
        <UserCard
          key={user.id}
          id={user.id}
          name={`${user.fname} ${user.lname}`}
          role={user.role}
          imageSrc="https://via.placeholder.com/80"
          onUserDeleted={handleUserDeleted}
        />
      ))}
    </div>
  );
};

export default UserList;
