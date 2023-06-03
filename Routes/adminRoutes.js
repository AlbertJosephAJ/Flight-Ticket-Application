const express = require("express");
const router = express.Router();
const flightModel = require("../models/flightModel");
const bookingModel = require("../models/bookingModel");
const { verifyAdminToken } = require("../Validation/jwt");
const { flightSchema } = require("../Validation/validationSchema");

//Routes

//Get all the bookings based on time and flightId
router.post("/", verifyAdminToken, async (req, res) => {
  try {
    const bookings = await bookingModel.find({ flightId: req.body.flightId });

    let data = [];
    for await (const booking of bookings) {
      const temp = await flightModel.findOne({ flightId: booking.flightId });
      if (temp && temp.time == req.body.time) {
        data = [
          ...data,
          [
            booking.userId,
            booking.flightId,
            booking.seats,
            temp.source,
            temp.destination,
          ],
        ];
      }
    }
    if (data.length === 0)
      return res.json({
        message: "No bookings is found based on given flightId and time",
      });
    res.json(data);
  } catch (err) {
    res.json({ message: err.message });
  }
});

//Add a Flight
router.post("/addFlight", verifyAdminToken, async (req, res) => {
  try {
    const result = await flightSchema.validateAsync(req.body);
    const isSameFlightPresent = await flightModel.findOne({
      flightId: result.flightId,
    });
    if (isSameFlightPresent) {
      return res.json({ message: "Duplicate Entry" });
    }
    const flightDetails = new flightModel({
      flightId: result.flightId,
      company: result.company,
      source: result.source,
      destination: result.destination,
      date: result.date,
      time: result.time,
    });

    const data = await flightDetails.save();

    res.json(data);
  } catch (err) {
    res.json({ message: "Error Occured" });
  }
});

//Delete a Flight
router.delete("/deleteFlight/:flightId", verifyAdminToken, async (req, res) => {
  try {
    const isFlightPresent = await flightModel.findOne({
      flightId: req.params.flightId,
    });
    if (!isFlightPresent) {
      return res.json({ message: "Flight Doesn't exist" });
    }
    const data = await flightModel.deleteOne({
      flightId: req.params.flightId,
    });
    res.json({ message: "Flight Deleted" });
  } catch (err) {
    res.json({ message: "Error Occurred" });
  }
});

module.exports = router;
