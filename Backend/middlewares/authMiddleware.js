const jwt = require("jsonwebtoken");

function parseCookies(cookieHeader) {
  if (!cookieHeader) return {};
  
  const cookies = {};
  cookieHeader.split(';').forEach(cookie => {
    const [name, value] = cookie.trim().split('=');
    cookies[name] = value;
  });
  return cookies;
}

function isLoggedIn(req, res, next) {
  try {
    // Parse cookies from header
    const cookies = parseCookies(req.headers.cookie);
    
    // Get token from cookies or Authorization header
    const token = cookies.access_token || 
                 (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    if (!token) {
      return res.status(401).json({ message: "Not logged in" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user info to request
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not logged in" });
    }

    // Case-insensitive role check
    const userRole = req.user.role ? req.user.role.toLowerCase() : '';
    const allowed = allowedRoles.map(r => r.toLowerCase());
    if (!allowed.includes(userRole)) {
      return res.status(403).json({ 
        message: `Access denied. Required role: ${allowedRoles.join(", ")}` 
      });
    }
    next();
  };
}

const isAdmin = authorizeRoles("Admin");
const isManager = authorizeRoles("Manager");
const isTeamLeader = authorizeRoles("TeamLeader");
const isEmployee = authorizeRoles("Employee");

module.exports = {
  isLoggedIn,
  isAdmin,
  isManager,
  isTeamLeader,
  isEmployee,
  authorizeRoles,
};
