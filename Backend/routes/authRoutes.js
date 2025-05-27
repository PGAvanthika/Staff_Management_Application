const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require('../config/db'); // postgres.js client instance

// Helper: Log activity (you can write to DB or file)
const logActivity = async (msg) => {
  console.log(`[Activity Log]: ${msg}`);
};

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    // Query users table for the given email (postgres.js style)
    const result = await db`SELECT * FROM users WHERE email = ${email}`;

    if (result.length === 0) {
      await logActivity(`Failed login attempt: ${email}`);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result[0];

    // Password verification
    // const isMatch = await bcrypt.compare(password, user.password);
    if (password!=user.password) {
      await logActivity(`Failed login (wrong password): ${email}`);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Set cookie (optional) or send as JSON
    res.cookie("token", token, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production", // only over HTTPS in production
      sameSite: "Strict",
      maxAge: 3600000,
    });

    await logActivity(`User logged in successfully: ${email}`);

    // Send user info to frontend
    res.status(200).json({
      message: "Login successful",
      token,
      role: user.role,
    });

  } catch (error) {
    console.error("Login error:", error.message);
    await logActivity(`Login error for ${email}: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
