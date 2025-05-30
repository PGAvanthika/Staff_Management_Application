// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

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

function isAdmin(req, res, next) {
    if (req.user.role !== "Admin") {
        return res.status(403).json({ redirect: true, message: "Access denied. Admins only." });
    }
    next();
}

function isManager(req, res, next) {
    if (req.user.role !== "manager") {
        return res.status(403).json({ redirect: true, message: "Access denied. Managers only." });
    }
    next();
}

function isTeamLeader(req, res, next) {
    if (req.user.role !== "team_leader") {
        return res.status(403).json({ redirect: true, message: "Access denied. Team Leaders only." });
    }
    next();
}

function isEmployee(req, res, next) {
    if (req.user.role !== "employee") {
        return res.status(403).json({ redirect: true, message: "Access denied. Employees only." });
    }
    next();
}

module.exports = {
    isLoggedIn,
    isAdmin,
    isManager,
    isTeamLeader,
    isEmployee
};
