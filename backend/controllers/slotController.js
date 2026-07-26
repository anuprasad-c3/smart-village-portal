const Slot = require("../models/Slot");

// Create Slot (Admin)
const createSlot = async (req, res) => {
  try {
    const {
      department,
      date,
      startTime,
      endTime,
      maxBookings,
    } = req.body;

    if (!department || !date || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Prevent creating slots in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const slotDate = new Date(date);

    if (slotDate < today) {
      return res.status(400).json({
        success: false,
        message: "Cannot create slots for past dates",
      });
    }

    // Prevent duplicate slot
    const existingSlot = await Slot.findOne({
      department,
      date,
      startTime,
      endTime,
    });

    if (existingSlot) {
      return res.status(400).json({
        success: false,
        message: "Slot already exists",
      });
    }

    const slot = await Slot.create({
      department,
      date,
      startTime,
      endTime,
      maxBookings,
    });

    res.status(201).json({
      success: true,
      message: "Slot created successfully",
      slot,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Citizen - View Available Slots
const getAvailableSlots = async (req, res) => {
  try {
    const { department, date } = req.query;

    const filter = {
      isActive: true,
    };

    if (department) {
      filter.department = department;
    }

    if (date) {
      filter.date = new Date(date);
    }

    const slots = await Slot.find(filter).sort({
      date: 1,
      startTime: 1,
    });

    const availableSlots = slots.filter(
      (slot) => slot.bookedCount < slot.maxBookings
    );

    res.status(200).json({
      success: true,
      count: availableSlots.length,
      slots: availableSlots,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Admin - View All Slots
const getAllSlots = async (req, res) => {
  try {
    const slots = await Slot.find().sort({
      date: 1,
      startTime: 1,
    });

    res.status(200).json({
      success: true,
      count: slots.length,
      slots,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateSlotAvailability = async (req, res) => {
  try {
    const { isActive } = req.body;
    if (typeof isActive !== "boolean") {
      return res.status(400).json({ success: false, message: "isActive must be a boolean" });
    }

    const slot = await Slot.findByIdAndUpdate(req.params.id, { isActive }, { new: true });
    if (!slot) {
      return res.status(404).json({ success: false, message: "Slot not found" });
    }

    res.status(200).json({
      success: true,
      message: `Slot ${isActive ? "opened" : "closed"} successfully`,
      slot,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createSlot,
  getAvailableSlots,
  getAllSlots,
  updateSlotAvailability,
};
