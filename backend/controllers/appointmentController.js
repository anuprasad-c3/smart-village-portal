const Appointment = require("../models/Appointment");

// Book Appointment
const bookAppointment = async (req, res) => {
  try {
    const {
      department,
      appointmentDate,
      timeSlot,
      reason,
    } = req.body;

    // Validation
    if (
      !department ||
      !appointmentDate ||
      !timeSlot ||
      !reason
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check duplicate booking
    const existingAppointment = await Appointment.findOne({
      appointmentDate,
      timeSlot,
      status: {
        $in: ["Pending", "Approved"],
      },
    });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: "This time slot is already booked.",
      });
    }

    const appointment = await Appointment.create({
      citizen: req.user._id,
      department,
      appointmentDate,
      timeSlot,
      reason,
    });

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully.",
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
    }).sort({ appointmentDate: 1 });

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

module.exports = {
    bookAppointment,
    getMyAppointments,
    cancelAppointment,
    getAllAppointments
};  