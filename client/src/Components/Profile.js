import React, { useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";

const Profile = ({ onClose }) => {
  const overlayRef = useRef(null);
  const cardRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        cardRef.current &&
        !cardRef.current.contains(event.target) &&
        overlayRef.current &&
        overlayRef.current.contains(event.target)
      ) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  if (!user) return null;
  const name = user.fname && user.lname ? `${user.fname} ${user.lname}` : user.name || user.email;
  const employeeId = user.id || "-";
  const email = user.email || "-";

  return (
    <div
      ref={overlayRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.25)",
        zIndex: 9999,
      }}
    >
      <div
        ref={cardRef}
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          width: "300px",
          backgroundColor: "rgb(165, 198, 228)",
          padding: "16px",
          borderRadius: "12px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          display: "flex",
          alignItems: "center",
          gap: "16px",
          userSelect: "none",
        }}
      >
        {/* Optionally show a profile image if available */}
        {/* <img
          src={user.profilepic || "/images/default-user.jpg"}
          alt="User"
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            objectFit: "cover",
            border: "2px solid #ccc",
          }}
        /> */}
        <div>
          <div
            style={{
              fontWeight: "600",
              fontSize: "18px",
              color: "#222",
              marginBottom: "4px",
            }}
          >
            {name}
          </div>
          <div style={{ fontSize: "14px", color: "#666", marginBottom: "2px" }}>
            ID: {employeeId}
          </div>
          <div style={{ fontSize: "14px", color: "#007bff" }}>{email}</div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
