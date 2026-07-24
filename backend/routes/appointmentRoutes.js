const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  bookAppointment,
    getMyAppointments,
    cancelAppointment,
    getAllAppointments,
    updateAppointmentStatus,
} = require("../controllers/appointmentController");

router.get(
  "/admin/all",
  authMiddleware,
  adminMiddleware,
  getAllAppointments
);

router.put(
  "/admin/:id/status",
  authMiddleware,
  adminMiddleware,
  updateAppointmentStatus
);

router.post("/", authMiddleware, bookAppointment);
router.get("/", authMiddleware, getMyAppointments);
router.put("/:id/cancel", authMiddleware, cancelAppointment);

module.exports = router;