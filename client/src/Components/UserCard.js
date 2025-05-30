import React, { useState } from "react";
import "./UserCard.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserCard = ({ id, name, role, imageSrc, onUserDeleted }) => {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClick = () => {
    navigate(`/UserForm/${id}`); // Pass the user ID when navigating
  };

  const handleDeleteClick = () => {
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      console.log("Deleting user with ID:", id);
      // Ensure to send credentials (cookies) along with the request
      await axios.delete(`http://localhost:3001/api/user/${id}`, {
        withCredentials: true, // Send cookies (JWT token) along with the request
      });
      setShowConfirm(false);
      if (onUserDeleted) onUserDeleted(id);
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
        <img src={imageSrc} className="user-image" alt="user" />
        <div className="user-info">
          <h3>{name}</h3>
          <p>{role}</p>
        </div>
        <div className="card-actions">
          <button className="delete-item" onClick={handleDeleteClick}>
            <ion-icon name="trash-bin-outline"></ion-icon>
          </button>
          <button className="edit-btn" onClick={handleClick}>
            <ion-icon name="pencil-outline"></ion-icon>
          </button>
        </div>
      </div>

      {showConfirm && (
        <div className="overlay">
          <div className="modal-box">
            <p>Are you sure you want to delete this item?</p>
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
