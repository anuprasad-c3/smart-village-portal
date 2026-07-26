const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadProfile");

const {
  getProfile,
  updateProfile,
    changePassword,
    uploadProfilePhoto
} = require("../controllers/profileController");

// Get Logged-in User Profile
router.get("/", authMiddleware, getProfile);

// Update Profile
router.put("/", authMiddleware, updateProfile);
// Upload Profile Photo
router.post( "/photo",authMiddleware,upload.single("profileImage"),uploadProfilePhoto );

// Change Password
router.put("/password", authMiddleware, changePassword);

module.exports = router;