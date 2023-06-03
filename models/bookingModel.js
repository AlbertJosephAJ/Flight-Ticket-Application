const mongoose = require("mongoose");

//Booking table Schema
const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    flightId: {
      type: String,
      required: true,
    },
    seats: {
      type: Number,
      required: true,
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model("booking", bookingSchema);
