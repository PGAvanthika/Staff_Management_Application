import React, { useEffect, useRef } from "react";

const Profile = ({ onClose }) => {
  const overlayRef = useRef(null);
  const cardRef = useRef(null);

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

  // Dummy user data
  const name = "Avanthika PG";
  const employeeId = "EMP1024";
  const email = "avanthika@example.com";
  const photoUrl = "https://via.placeholder.com/100";

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
        <img
          src={photoUrl}
          alt="User"
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            objectFit: "cover",
            border: "2px solid #ccc",
          }}
        />
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
