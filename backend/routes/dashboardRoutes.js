const express = require("express");

const router = express.Router();

const {
  adminDashboard,
  citizenDashboard,
} = require("../controllers/dashboardController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.get(
  "/admin",
  authMiddleware,
  adminMiddleware,
  adminDashboard
);

router.get(
  "/citizen",
  authMiddleware,
  citizenDashboard
);

module.exports = router;