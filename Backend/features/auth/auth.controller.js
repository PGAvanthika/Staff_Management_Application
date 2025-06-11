const authService = require('./auth.service');
const jwt = require("jsonwebtoken");

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    const user = await authService.verifyUser(email, password);

    const token = jwt.sign(
      { 
        userId: user.id, 
        role: user.role, 
        email: user.email 
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Set cookie with proper domain and path
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      sameSite: 'lax',
      path: '/',
      domain: 'localhost',
      maxAge: 3600000 // 1 hour
    });

    // Log successful login
    await authService.logLoginAttempt(user.id, "login", "success");

    // Send response with user data
    return res.status(200).json({ 
      message: "Login successful", 
      user: {
        id: user.id,
        role: user.role,
        email: user.email
      }
    });
  } catch (err) {
    if (err.code === "INVALID_CREDENTIALS") {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    return res.status(500).json({ message: "Server error" });
  }
};

exports.logoutUser = async (req, res) => {
  try {
    if (req.user?.userId) {
      await authService.logLoginAttempt(req.user.userId, "logout", "success");
    }
  } catch (err) {
    console.error("Logout log error:", err.message);
  }

  // Clear cookie with same settings
  res.clearCookie("access_token", {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    path: '/',
    domain: 'localhost'
  });

  return res.status(200).json({ message: "Logged out successfully" });
};

exports.validateToken = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  return res.status(200).json({ 
    message: "Token is valid", 
    user: {
      id: req.user.userId,
      role: req.user.role,
      email: req.user.email
    }
  });
};
