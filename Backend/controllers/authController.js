const authService = require("../services/authService");
const jwt = require("jsonwebtoken");

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required." });

  try {
    const user = await authService.verifyUser(email, password);

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
      maxAge: 3600000, // 1 hour
    });

    await authService.logLoginAttempt(user.id, "login", "success");

    return res.status(200).json({ message: "Login successful", role: user.role });
  } catch (err) {
    console.error("Login error:", err.message);

    if (err.code === "INVALID_CREDENTIALS") {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    return res.status(500).json({ message: "Server error" });
  }
};

exports.logoutUser = async (req, res) => {
  try {
    await authService.logLoginAttempt(req.user?.userId, "logout", "success");
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
};

exports.validateToken = (req, res) => {
  return res.status(200).json({ message: "Token is valid", user: req.user });
};
