const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const { isLoggedIn } = require("../middlewares/authMiddleware");

// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    const result = await db`SELECT * FROM users WHERE email = ${email}`;
    if (result.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 👇 Cookie setup
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: false, // set to true in production with HTTPS
      sameSite: "Lax", // or "Strict"
      maxAge: 3600000,
      path: "/",
    });

    res.status(200).json({
      message: "Login successful",
      role: user.role,
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Logout Route
router.post("/logout", (req, res) => {
  res.clearCookie("access_token", {
    httpOnly: true,
    sameSite: "Lax",
    secure: false,
    path: "/",
  });
  res.status(200).json({ message: "Logged out successfully" });
});


// Token Validation Route
router.get("/validate", isLoggedIn, (req, res) => {
  res.status(200).json({
    message: "Token is valid",
    user: req.user,
  });
});


module.exports = router;
