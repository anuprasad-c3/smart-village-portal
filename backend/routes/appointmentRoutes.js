const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  bookAppointment,
    getMyAppointments,
    cancelAppointment,
    getAllAppointments
} = require("../controllers/appointmentController");

router.get(
  "/admin/all",
  authMiddleware,
  adminMiddleware,
  getAllAppointments
);

// Book Appointment
router.post("/", authMiddleware, bookAppointment);

// Get My Appointments
router.get("/", authMiddleware, getMyAppointments);

// Cancel Appointment
router.put("/:id/cancel", authMiddleware, cancelAppointment);

module.exports = router;