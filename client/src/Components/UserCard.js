import React from "react";
import "./UserCard.css"; // Separate CSS for styling the card
//import { Pencil } from "lucide-react"; // Optional: Use any edit icon library

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
