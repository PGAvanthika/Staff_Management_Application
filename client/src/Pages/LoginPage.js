import React, { useState } from "react";
import "./LoginPage.css";
import loginIllustration from "../Assets/forgot-password.avif";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

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
      console.log('Attempting login with credentials:', credentials);
      
      const res = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(credentials),
      });

      console.log('Login response status:', res.status);
      
      const data = await res.json();
      console.log('Login response data:', data);

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store user data in auth context
      login(data.user);
      console.log('User data stored in auth context:', data.user);

      // Navigate based on role
      switch (data.user.role) {
        case "Admin":
          navigate("/adminhome");
          break;
        case "team_leader":
          navigate("/Tlhome");
          break;
        case "Manager":
          navigate("/ManagerHome");
          break;
        case "employee":
          navigate("/EmployeeHome");
          break;
        default:
          throw new Error("Unknown role");

          
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Server error");
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
