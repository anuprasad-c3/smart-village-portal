const User = require("../models/User");
const Scheme = require("../models/Scheme");
const Application = require("../models/Application");

// Admin Dashboard
const adminDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "citizen" });

    const totalSchemes = await Scheme.countDocuments();

    const totalApplications = await Application.countDocuments();

    const pending = await Application.countDocuments({
      status: "Pending",
    });

    const approved = await Application.countDocuments({
      status: "Approved",
    });

    const rejected = await Application.countDocuments({
      status: "Rejected",
    });

    res.status(200).json({
      success: true,

      data: {
        totalUsers,
        totalSchemes,
        totalApplications,
        pending,
        approved,
        rejected,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Citizen Dashboard
const citizenDashboard = async (req, res) => {
  try {
    const total = await Application.countDocuments({
      applicant: req.user._id,
    });

    const pending = await Application.countDocuments({
      applicant: req.user._id,
      status: "Pending",
    });

    const approved = await Application.countDocuments({
      applicant: req.user._id,
      status: "Approved",
    });

    const rejected = await Application.countDocuments({
      applicant: req.user._id,
      status: "Rejected",
    });

    res.status(200).json({
      success: true,

      data: {
        total,
        pending,
        approved,
        rejected,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  adminDashboard,
  citizenDashboard,
};