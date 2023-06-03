const express = require("express");
const router = express.Router();
const userModel = require("../models/userModel");
const bookingModel = require("../models/bookingModel");
const flightModel = require("../models/flightModel")
const { verifyUserToken } = require("../Validation/jwt");

//Routes

//Get all the flight Details
router.get("/", verifyUserToken, async (req, res) => {
  try {
    const allFlightDetails = await flightModel.find();
    res.json(allFlightDetails);
  } catch (err) {
    res.json({message :"Error Occured"});
  }
});

//Specific flight details by time
router.get("/searchByTime/:flightTime", verifyUserToken, async (req, res) => {
  try {
    const flightDetailsByTime = await flightModel.find({
      time: req.params.flightTime,
    });
    res.json(flightDetailsByTime);
  } catch (err) {
    res.json({message :"Error Occured"});
  }
});

//Specific flight details by date
router.get("/searchByDate/:flightDate", verifyUserToken, async (req, res) => {
  try {
    const flightDetailsByDate = await flightModel.find({
      date: req.params.flightDate,
    });
    res.json(flightDetailsByDate);
  } catch (err) {
    res.json({message :"Error Occured"});
  }
});

//Flights booked by the user
router.get("/getAllBookings", verifyUserToken, async (req, res) => {
  try {
    const Bookings = await bookingModel.find({userId : req.payload.aud})
    if(Bookings.length === 0) {
      return res.json({message : "No bookings has been done previously"})
    }
    let data = []
    for await (const booking of Bookings) {
      const temp = await flightModel.findOne({flightId : booking.flightId});
      if(!temp) throw new Error("flight Details not found");
      data = [...data, [booking.flightId, temp.source, temp.destination, temp.date, temp.time, booking.seats]]
    }
    res.json(data);
  } catch(err) {
    console.log(err);
    res.json({message : "Error Occured"})
  }
})

//Book a ticket
router.post("/bookTicket", verifyUserToken, async (req, res) => {
  try {
    const {flightId, seats} = req.body;
    // //Check whether the flight exists
    const flightDetail = await flightModel.findOne({
      flightId: flightId,
    });
    if(!flightDetail) {
       return res.json({message : "Flight Doesn't exist"});
    }
    //Checks whether seats are available && update seat in flight table
    const currentSeat = flightDetail.seats - seats;
    if(currentSeat < 0) {
        return res.json({message : "Required seats are not available"});
    }
    const flightData = await flightModel.updateOne(
        { flightId : flightId},
        { $set : {seats : currentSeat}}
    );
    //Add entry booking table
    const newBooking = new bookingModel({
        userId : req.payload.aud,
        flightId : flightId,
        seats : seats,
    })
    const data = await newBooking.save();

    return res.json({message : "Booking has been successful"});
  } catch (err) {
    console.log(err);
    res.json({message : "Error Occured"});
  }
});

module.exports = router;
