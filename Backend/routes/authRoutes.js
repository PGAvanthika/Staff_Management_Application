// routes/authRoutes.js
const express  = require("express");
const router   = express.Router();
const bcrypt   = require("bcrypt");
const jwt      = require("jsonwebtoken");
const db       = require("../config/db");
const { isLoggedIn } = require("../middlewares/authMiddleware");

// Helper for login_logs
const logLoginAttempt = async (empId, logType, status) => {
  if (!empId) return;

  const now  = new Date();
  const time = now.toTimeString().split(" ")[0];
  const date = now.toISOString().split("T")[0];

  try {
    await db`
      INSERT INTO login_logs (emp_id, log_type, status, time, date)
      VALUES (${empId}, ${logType}, ${status}, ${time}, ${date});
    `;
  } catch (err) {
    console.error("Log write failed:", err.message);
  }
};

// POST /login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required." });

  try {
    const users = await db`SELECT * FROM users WHERE email = ${email}`;
    if (users.length === 0)
      return res.status(401).json({ message: "Invalid credentials" });

    const user    = users[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      await logLoginAttempt(user.id, "login", "fail");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("access_token", token, {
      httpOnly: true,
      sameSite: "Lax",
      secure: false,
      path: "/",
      maxAge: 3600000,
    });

    await logLoginAttempt(user.id, "login", "success");

    return res.status(200).json({ message: "Login successful", role: user.role });
  } catch (err) {
    console.error("Login error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
});

// POST /logout
router.post("/logout", isLoggedIn, async (req, res) => {
  try {
    await logLoginAttempt(req.user?.userId, "logout", "success");
  } catch (err) {
    console.error("Logout log error:", err.message);
  }

  res.clearCookie("access_token", {
    httpOnly: true,
    sameSite: "Lax",
    secure: false,
    path: "/",
  });

  return res.status(200).json({ message: "Logged out successfully" });
});

// GET /validate
router.get("/validate", isLoggedIn, (req, res) => {
  return res.status(200).json({ message: "Token is valid", user: req.user });
});

module.exports = router;
