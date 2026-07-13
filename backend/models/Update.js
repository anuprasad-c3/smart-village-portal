const mongoose = require("mongoose");

const updateSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
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

module.exports = mongoose.model("Update", updateSchema);