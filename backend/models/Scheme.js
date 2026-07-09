const mongoose = require("mongoose");

const schemeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Agriculture",
        "Housing",
        "Education",
        "Healthcare",
        "Employment",
        "Women Welfare",
        "Senior Citizens",
        "Other",
      ],
    },

    description: {
      type: String,
      required: true,
    },

    eligibility: {
      type: [String],
      required: true,
      default: [],
    },

    requiredDocuments: {
      type: [String],
      required: true,
      default: [],
    },

    benefits: {
      type: [String],
      default: [],
    },

    department: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },

    officialDocument: {
      type: String,
      default: "",
    },

    lastDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Scheme", schemeSchema);