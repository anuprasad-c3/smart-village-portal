const Update = require("../models/Update");

// Create Update
const createUpdate = async (req, res) => {
  try {
    const { date, message } = req.body;

    if (!date || !message) {
      return res.status(400).json({
        success: false,
        message: "Date and message are required.",
      });
    }

    const update = await Update.create({
      date,
      message,
      createdBy: req.user ? req.user._id : null,
    });

    res.status(201).json({
      success: true,
      message: "Update posted successfully.",
      data: update,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Updates
const getAllUpdates = async (req, res) => {
  try {
    const updates = await Update.find()
      .sort({ date: -1 })
      .populate("createdBy", "name");

    res.status(200).json({
      success: true,
      data: updates,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Update by ID
const getUpdateById = async (req, res) => {
  try {
    const update = await Update.findById(req.params.id);

    if (!update) {
      return res.status(404).json({
        success: false,
        message: "Update not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: update,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Existing Update
const updateUpdate = async (req, res) => {
  try {
    const update = await Update.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!update) {
      return res.status(404).json({
        success: false,
        message: "Update not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Update edited successfully.",
      data: update,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Update
const deleteUpdate = async (req, res) => {
  try {
    const update = await Update.findById(req.params.id);

    if (!update) {
      return res.status(404).json({
        success: false,
        message: "Update not found.",
      });
    }

    await update.deleteOne();

    res.status(200).json({
      success: true,
      message: "Update deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createUpdate,
  getAllUpdates,
  getUpdateById,
  updateUpdate,
  deleteUpdate,
};