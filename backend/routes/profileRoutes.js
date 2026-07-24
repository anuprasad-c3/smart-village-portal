const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getProfile,
  updateProfile,
  changePassword,
} = require("../controllers/profileController");

// Get Logged-in User Profile
router.get("/", authMiddleware, getProfile);

// Update Profile
router.put("/", authMiddleware, updateProfile);

// Change Password
router.put("/password", authMiddleware, changePassword);

module.exports = router;