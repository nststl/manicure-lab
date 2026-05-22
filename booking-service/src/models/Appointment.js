const mongoose = require("mongoose");

const STATUSES = ["scheduled", "confirmed", "completed", "cancelled"];

const appointmentSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    date: { type: String, required: true },
    time: { type: String, required: true },
    status: {
      type: String,
      enum: STATUSES,
      default: "scheduled",
    },
  },
  { timestamps: true }
);

appointmentSchema.statics.STATUSES = STATUSES;

module.exports = mongoose.model("Appointment", appointmentSchema);
