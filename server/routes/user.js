const express = require("express");
const router = express.Router();

// Import the required controllers and middleware functions
const {
  login,
  signup,
  sendOtp,
  changePassword,
} = require("../controller/auth");

const {
  resetPasswordToken,
  resetPassword,
} = require("../controller/ResetPassword");

const { auth } = require("../middleware/auth");

// Authentication routes

// Route for user login
router.post("/login", login);

// Route for user signup
router.post("/signup", signup);

// Route for sending OTP to the user's email
router.post("/send-otp", sendOtp);

// Route for Changing the password (with auth middleware)
router.post("/change-password", auth, changePassword);

// Reset Password routes
router.post("/reset-password-token", resetPasswordToken);
router.post("/reset-password", resetPassword);

// Export the router
module.exports = router;
