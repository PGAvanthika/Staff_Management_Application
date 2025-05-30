import React, { useState } from "react";
import "./UserCard.css";
import { useNavigate } from "react-router-dom";
import UserForm from "./UserForm";

const UserCard = ({ name, role, imageSrc }) => {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [readOnlyMode, setReadOnlyMode] = useState(true);

  const handleClick = () => {
    setReadOnlyMode(true); // View mode
    setShowUserForm(true);
  };

  const handleCloseUserForm = () => {
    setShowUserForm(false);
  };

  const handleDeleteClick = () => {
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    console.log("Item deleted"); // Your delete logic here
    setShowConfirm(false);
  };

  const cancelDelete = () => {
    setShowConfirm(false);
  };

  return (
    <div className="card-container">
      {showUserForm && (
        <div className="user-form-overlay">
          <UserForm
            readOnly={readOnlyMode}
            userData={{
              fname: name.split(" ")[0],
              lname: name.split(" ")[1] || "",
              role: role,
              // Add more fields if needed
            }}
          />
          <button
            className="close-overlay-btn"
            onClick={handleCloseUserForm}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              background: "#f44336",
              color: "white",
              border: "none",
              borderRadius: "50%",
              width: "30px",
              height: "30px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
            }}
          >
            X
          </button>
        </div>
      )}

      <div
        className="user-card"
        onClick={handleClick}
        style={{ cursor: "pointer" }}
      >
        <img src={imageSrc} className="user-image" />
        <div className="user-info">
          <h3>{name}</h3>
          <p>{role}</p>
        </div>
        <div className="card-actions">
          <button
            className="delete-item"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick();
            }}
          >
            <ion-icon name="trash-bin-outline"></ion-icon>
          </button>
          <button
            className="edit-btn"
            onClick={(e) => {
              e.stopPropagation();
              setReadOnlyMode(false);
              setShowUserForm(true);
            }}
          >
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
