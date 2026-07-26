const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  createSlot,
  getAvailableSlots,
  getAllSlots,
  updateSlotAvailability,
} = require("../controllers/slotController");

// Citizen
router.get("/", authMiddleware, getAvailableSlots);

// Admin
router.post("/", authMiddleware, adminMiddleware, createSlot);

router.get(
  "/admin",
  authMiddleware,
  adminMiddleware,
  getAllSlots
);

router.patch(
  "/:id/availability",
  authMiddleware,
  adminMiddleware,
  updateSlotAvailability
);

module.exports = router;
