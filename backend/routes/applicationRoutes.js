const express = require("express");

const router = express.Router();

const {
  applyScheme,
  getMyApplications,
  getAllApplications,
  updateApplicationStatus,
} = require("../controllers/applicationController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Citizen
router.post(
    "/",
    authMiddleware,
    upload.array("documents",5),
    applyScheme
);

router.get("/my", authMiddleware, getMyApplications);

// Admin
router.get("/", authMiddleware, adminMiddleware, getAllApplications);

router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  updateApplicationStatus
);

module.exports = router;