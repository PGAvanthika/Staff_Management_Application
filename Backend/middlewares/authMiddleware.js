const jwt = require('jsonwebtoken');

// Middleware to verify if the user is logged in and attach user info
function isLoggedIn(req, res, next) {
  const token =
    req.cookies?.access_token ||
    (req.headers.authorization && req.headers.authorization.split(" ")[1]);

  if (!token) {
    return res.status(401).json({ redirect: true, message: "Not logged in" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ redirect: true, message: "Invalid or expired token" });
  }
}

// Role-based middleware generator: accept one or multiple allowed roles
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ redirect: true, message: `Access denied. Allowed roles: ${allowedRoles.join(", ")}` });
    }
    next();
  };
}

// Usage examples:
const isAdmin = authorizeRoles("Admin");
const isManager = authorizeRoles("Manager");
const isTeamLeader = authorizeRoles("TeamLeader");
const isEmployee = authorizeRoles("Employee");

// Export middlewares
module.exports = {
  isLoggedIn,
  isAdmin,
  isManager,
  isTeamLeader,
  isEmployee,
  authorizeRoles, // export for flexible usage elsewhere
};
