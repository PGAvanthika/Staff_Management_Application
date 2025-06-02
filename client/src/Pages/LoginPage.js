import React, { useState } from "react";
import "./LoginPage.css";
import loginIllustration from "../Assets/forgot-password.avif";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const [showOverlay, setShowOverlay] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async () => {
  try {
    const res = await fetch("http://localhost:3001/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // 👈 This allows cookies to be stored
      body: JSON.stringify(credentials),
    });

    const data = await res.json();

    if (res.ok) {
      // No need to save the token manually if you're using cookies
      // localStorage.setItem("token", data.token);

      if (data.role === "Admin") navigate("/Adminhome");
      else if (data.role === "team_leader") navigate("/tlhome");
      else if (data.role === "Manager") navigate("/ManagerHome");
      else if (data.role === "employee") navigate("/employeehome");
    } else {
      setError(data.message || "Login failed");
    }
  } catch (err) {
    console.error(err);
    setError("Server error");
  }
};


  return (
    <div className="login-container">
      <div className="left-section">
        <div className="decorative-circle large"></div>
        <div className="decorative-circle small"></div>
        <div className="decorative-circle small2"></div>
      </div>

      <div className="right-section">
        <h2>Login</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div className="input-group">
          <i className="fa fa-user"></i>
          <input
            type="email"
            name="email"
            placeholder="email"
            value={credentials.email}
            onChange={handleChange}
          />
        </div>
        <div className="input-group">
          <i className="fa fa-lock"></i>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleChange}
          />
        </div>
        <div className="options">
          <label>
            <input type="checkbox" /> Remember Me
          </label>
          <span onClick={() => setShowOverlay(true)}>Forgot Password?</span>
        </div>
        <button className="login-btn" onClick={(e) => handleLogin(e)}>
          LOGIN
        </button>
      </div>

      {showOverlay && (
        <div className="overlay">
          <div className="overlay-content">
            <button className="close-btn" onClick={() => setShowOverlay(false)}>
              &times;
            </button>
            <h3>Forgot your password?</h3>
            <img src={loginIllustration} alt="Reset Illustration" />
            <div className="input-group">
              <i className="fa fa-envelope"></i>
              <input type="email" placeholder="Email" />
            </div>
            <button className="reset-btn">Reset password</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
