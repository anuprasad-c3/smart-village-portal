const express = require("express");

const router = express.Router();

const {
  createUpdate,
  getAllUpdates,
  getUpdateById,
  updateUpdate,
  deleteUpdate,
} = require("../controllers/updateController");

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

// Public
router.get("/", getAllUpdates);
router.get("/:id", getUpdateById);

// Admin
router.post("/", protect, admin, createUpdate);
router.put("/:id", protect, admin, updateUpdate);
router.delete("/:id", protect, admin, deleteUpdate);

module.exports = router;