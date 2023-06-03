const mongoose = require("mongoose");

//flight Table Schema
const flightSchema = new mongoose.Schema(
  {
    flightId: {
      type: String,
      required: true,
    },
    company : {
      type: String,
      required: true,
    },
    source : {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    date: {
        type: String,
        required: true,
    }, 
    time: {
        type: String,
        required: true,
    },
    seats : {
      type: Number,
      default : 60,
    }
  },
  { versionKey: false }
);

module.exports = mongoose.model('flight', flightSchema)
