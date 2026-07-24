const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema(
  {
    department: {
      type: String,
      required: true,
      enum: [
        "Secretary",
        "Revenue",
        "Agriculture",
        "Health",
        "Welfare",
        "Tax",
        "Birth Certificate",
        "Death Certificate",
        "Building Permit",
      ],
    },

    date: {
      type: Date,
      required: true,
    },

    startTime: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },

    maxBookings: {
      type: Number,
      default: 1,
    },

    bookedCount: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Slot", slotSchema);