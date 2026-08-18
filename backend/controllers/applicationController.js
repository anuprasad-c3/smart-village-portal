const Application = require("../models/Application");
const Scheme = require("../models/Scheme");
const fs = require("fs");
const path = require("path");

// Citizen Apply Scheme
const applyScheme = async (req, res) => {
  try {
    const { scheme } = req.body;

    if (!scheme) {
      return res.status(400).json({
        success: false,
        message: "Scheme ID is required.",
      });
    }

    const uploadedDocuments = req.files.map((file) => ({
  originalName: file.originalname,
  fileName: file.filename,
  filePath: `/uploads/documents/${file.filename}`,
  mimeType: file.mimetype,
  fileSize: file.size,
}));

    // Check scheme exists
    const schemeExists = await Scheme.findById(scheme);

    if (!schemeExists) {
      return res.status(404).json({
        success: false,
        message: "Scheme not found.",
      });
    }

    // Check duplicate application
    const alreadyApplied = await Application.findOne({
      applicant: req.user._id,
      scheme,
    });

    if (alreadyApplied) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this scheme.",
      });
    }

    const application = await Application.create({
      applicant: req.user._id,
      scheme,
      uploadedDocuments,
    });

    res.status(201).json({
      success: true,
      message: "Application submitted successfully.",
      data: application,
    });
  } catch (error) {
       // Delete uploaded files if something failed
  if (req.files && req.files.length > 0) {

    req.files.forEach(file => {

      const filePath = path.join(__dirname, "..", file.path);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

    });

  }
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Citizen - My Applications
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      applicant: req.user._id,
    })
      .populate("scheme", "title category status")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Admin - View All Applications
const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("applicant", "fullName email phone address")
      .populate("scheme", "title category")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Admin - Update Status
const updateApplicationStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;

    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    application.status = status || application.status;
    application.remarks = remarks || application.remarks;

    await application.save();

    res.status(200).json({
      success: true,
      message: "Application updated successfully.",
      data: application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  applyScheme,
  getMyApplications,
  getAllApplications,
  updateApplicationStatus,
};
