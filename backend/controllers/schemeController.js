const Scheme = require("../models/Scheme");

// =========================
// Create Scheme
// =========================
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

// =========================
// Get All Schemes
// =========================
const getAllSchemes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const filter = {};

    // Search
    if (req.query.search) {
      filter.$or = [
        {
          title: {
            $regex: req.query.search,
            $options: "i",
          },
        },
        {
          category: {
            $regex: req.query.search,
            $options: "i",
          },
        },
        {
          department: {
            $regex: req.query.search,
            $options: "i",
          },
        },
      ];
    }

    // Category Filter
    if (req.query.category) {
      filter.category = req.query.category;
    }

    // Status Filter
    if (req.query.status) {
      const today = new Date();

      if (req.query.status === "Active") {
        filter.status = "Active";
        filter.lastDate = { $gte: today };
      } else if (req.query.status === "Expired") {
        filter.lastDate = { $lt: today };
      } else {
        filter.status = req.query.status;
      }
    }

    const totalSchemes = await Scheme.countDocuments(filter);

    const schemes = await Scheme.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Automatically update display status
    const updatedSchemes = schemes.map((scheme) => {
      const obj = scheme.toObject();

      if (
        obj.status === "Active" &&
        new Date(obj.lastDate) < new Date()
      ) {
        obj.status = "Expired";
      }

      return obj;
    });

    res.status(200).json({
      success: true,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalSchemes / limit),
        totalSchemes,
        limit,
      },
      data: updatedSchemes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Get Scheme By ID
// =========================
const getSchemeById = async (req, res) => {
  try {
    const scheme = await Scheme.findById(req.params.id);

    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: "Scheme not found",
      });
    }

    const schemeData = scheme.toObject();

    if (
      schemeData.status === "Active" &&
      new Date(schemeData.lastDate) < new Date()
    ) {
      schemeData.status = "Expired";
    }

    res.status(200).json({
      success: true,
      data: schemeData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Update Scheme
// =========================
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

// =========================
// Delete Scheme
// =========================
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