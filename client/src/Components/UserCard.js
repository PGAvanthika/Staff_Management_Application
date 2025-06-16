import React, { useState } from "react";
import "./UserCard.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserCard = ({ user, onUserDeleted }) => {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  if (!user) return null;

  const handleClick = () => {
    navigate(`/UserForm/${user.id}`); // Pass the user ID when navigating
  };

  const handleDeleteClick = () => {
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      console.log("Deleting user with ID:", user.id);
      // Ensure to send credentials (cookies) along with the request
      await axios.delete(`http://localhost:3001/api/user/${user.id}`, {
        withCredentials: true, // Send cookies (JWT token) along with the request
      });
      setShowConfirm(false);
      if (onUserDeleted) onUserDeleted(user.id);
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  const cancelDelete = () => {
    setShowConfirm(false);
  };

  return (
    <div className="card-container">
      <div className="user-card">
        <img
          className="user-image"
          src={user.profilepic || "/images/default-user.jpg"}
          alt="User"
        />
        <div className="user-card-header">
          <span className="user-card-name">{user.name || user.fname + ' ' + user.lname || user.fullName || user.email}</span>
        </div>
        <div className="user-card-role">{user.role}</div>
        <div className="card-actions">
          <button className="delete-item" onClick={handleDeleteClick} title="Delete">
            <ion-icon name="trash-bin-outline"></ion-icon>
          </button>
          <button className="edit-btn" onClick={handleClick} title="Edit">
            <ion-icon name="pencil-outline"></ion-icon>
          </button>
        </div>
      </div>

      {showConfirm && (
        <div className="overlay">
          <div className="modal-box">
            <p>Are you sure you want to delete this user?</p>
            <div className="modal-actions">
              <button className="yes-btn" onClick={confirmDelete}>
                Yes
              </button>
              <button className="no-btn" onClick={cancelDelete}>
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserCard;
