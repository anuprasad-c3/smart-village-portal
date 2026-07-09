const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  createScheme,
  getAllSchemes,
  getSchemeById,
  updateScheme,
  deleteScheme,
} = require("../controllers/schemeController");

// Public Routes
router.get("/", getAllSchemes);
router.get("/:id", getSchemeById);

// Admin Routes
router.post("/", authMiddleware, adminMiddleware, createScheme);

router.put("/:id", authMiddleware, adminMiddleware, updateScheme);

router.delete("/:id", authMiddleware, adminMiddleware, deleteScheme);

module.exports = router;