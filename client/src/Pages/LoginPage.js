import React, { useState } from "react";
import "./LoginPage.css";
import loginIllustration from "../Assets/forgot-password.avif";

const LoginPage = () => {
  const [showOverlay, setShowOverlay] = useState(false);

  return (
    <div className="login-container">
      <div className="left-section">
        <div className="decorative-circle large"></div>
        <div className="decorative-circle small"></div>
        <div className="decorative-circle small2"></div>
      </div>

      <div className="right-section">
        <h2>Login</h2>
        <div className="input-group">
          <i className="fa fa-user"></i>
          <input type="text" placeholder="Username" />
        </div>
        <div className="input-group">
          <i className="fa fa-lock"></i>
          <input type="password" placeholder="Password" />
        </div>
        <div className="options">
          <label>
            <input type="checkbox" /> Remember Me
          </label>
          <span onClick={() => setShowOverlay(true)}>Forgot Password?</span>
        </div>
        <button className="login-btn">LOGIN</button>
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
