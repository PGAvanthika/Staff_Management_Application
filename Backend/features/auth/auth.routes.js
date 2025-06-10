const express = require("express");
const router = express.Router();
const { isLoggedIn, isAdmin } = require("../../middlewares/authMiddleware");
const authController = require("./auth.controller");

router.post("/login", authController.loginUser);
router.post("/logout", isLoggedIn, authController.logoutUser);
router.get("/validate", isLoggedIn, authController.validateToken);

module.exports = router;
