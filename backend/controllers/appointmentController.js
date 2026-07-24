const Appointment = require("../models/Appointment");
const Slot = require("../models/Slot");

// Book Appointment
// Book Appointment using Slot
const bookAppointment = async (req, res) => {
  try {
    const { slotId, reason } = req.body;

    if (!slotId || !reason) {
      return res.status(400).json({
        success: false,
        message: "Slot and reason are required",
      });
    }

    // Find slot
    const slot = await Slot.findById(slotId);

    if (!slot) {
      return res.status(404).json({
        success: false,
        message: "Slot not found",
      });
    }

    // Check if slot is active
    if (!slot.isActive) {
      return res.status(400).json({
        success: false,
        message: "This slot is not available",
      });
    }

    // Check booking limit
    if (slot.bookedCount >= slot.maxBookings) {
      return res.status(400).json({
        success: false,
        message: "Slot is fully booked",
      });
    }

    // Prevent duplicate booking by the same user
    const existingAppointment = await Appointment.findOne({
      citizen: req.user._id,
      slot: slotId,
      status: {
        $in: ["Pending", "Approved"],
      },
    });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: "You have already booked this slot",
      });
    }

    // Create appointment
    const appointment = await Appointment.create({
      citizen: req.user._id,
      slot: slotId,
      reason,
    });

    // Increase booked count
    slot.bookedCount += 1;
    await slot.save();

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Logged-in User Appointments
const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      citizen: req.user._id,
    })
      .populate("slot")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Cancel Appointment
const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Ensure the appointment belongs to the logged-in user
    if (appointment.citizen.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Only pending appointments can be cancelled
    if (appointment.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending appointments can be cancelled",
      });
    }

    appointment.status = "Cancelled";
    await appointment.save();

    const slot = await Slot.findById(appointment.slot);

    if (slot && slot.bookedCount > 0) {
      slot.bookedCount -= 1;
      await slot.save();
    }

    res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Appointments (Admin)
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("citizen", "fullName email phone")
      .populate("slot")
      .sort({ appointmentDate: 1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Appointment Status (Admin)
const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatus = ["Approved", "Rejected", "Completed"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    appointment.status = status;

    await appointment.save();

    res.status(200).json({
      success: true,
      message: `Appointment ${status.toLowerCase()} successfully.`,
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  bookAppointment,
  getMyAppointments,
  cancelAppointment,
  getAllAppointments,
  updateAppointmentStatus,
};
