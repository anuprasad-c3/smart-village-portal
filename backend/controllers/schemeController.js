const Scheme = require("../models/Scheme");

// Create Scheme
const createScheme = async (req, res) => {
  try {
    const {
      title,
      category,
      description,
      eligibility,
      requiredDocuments,
      benefits,
      department,
      image,
      officialDocument,
      lastDate,
      status,
    } = req.body;

    // Validation
    if (
      !title ||
      !category ||
      !description ||
      !eligibility ||
      !requiredDocuments ||
      !lastDate
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    const scheme = await Scheme.create({
      title,
      category,
      description,
      eligibility,
      requiredDocuments,
      benefits,
      department,
      image,
      officialDocument,
      lastDate,
      status,
      createdBy: req.user ? req.user._id : null,
    });

    res.status(201).json({
      success: true,
      message: "Scheme created successfully.",
      data: scheme,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createScheme,
};


// Get All Schemes
const getAllSchemes = async (req, res) => {
  try {
    const schemes = await Scheme.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: schemes.length,
      data: schemes,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Scheme by ID
const getSchemeById = async (req, res) => {
  try {

    const scheme = await Scheme.findById(req.params.id);

    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: "Scheme not found",
      });
    }

    res.status(200).json({
      success: true,
      data: scheme,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Scheme
const updateScheme = async (req, res) => {
  try {

    const scheme = await Scheme.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: "Scheme not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Scheme updated successfully",
      data: scheme,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Scheme
const deleteScheme = async (req, res) => {
  try {

    const scheme = await Scheme.findById(req.params.id);

    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: "Scheme not found",
      });
    }

    await scheme.deleteOne();

    res.status(200).json({
      success: true,
      message: "Scheme deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createScheme,
  getAllSchemes,
  getSchemeById,
  updateScheme,
  deleteScheme,
};