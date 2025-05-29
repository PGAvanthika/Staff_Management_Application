import React from "react";
import "./UserCard.css";

const UserCard = ({ name, role, imageSrc }) => {
  return (
    <div className="user-card">
      <img src={imageSrc} alt={name} className="user-image" />
      <div className="user-info">
        <h3>{name}</h3>
        <p>{role}</p>
      </div>
      <button className="edit-btn">
        <ion-icon name="pencil-outline"></ion-icon>
      </button>
    </div>
  );
};

export default UserCard;
