const Joi = require('joi');

const loginSchema = Joi.object({
    email : Joi.string().email().lowercase().required(),
    password : Joi.string().min(8).required()
})

const signUpSchema = Joi.object({
    firstName : Joi.string().min(6).required(),
    lastName : Joi.string().min(1).required(),
    email : Joi.string().email().lowercase().required(),
    password : Joi.string().min(8).required(),
    phoneNumber : Joi.string().min(10).max(10).required()
})

const flightSchema = Joi.object({
    flightId : Joi.string().alphanum().min(6).required(),
    company : Joi.string().min(4).required(),
    source : Joi.string().required(),
    destination : Joi.string().required(),
    date : Joi.string().required(),
    time : Joi.string().required(),
})

const bookingSchema = Joi.object({
    email : Joi.string().email().lowercase().required(),
    flightId : Joi.array().items(Joi.string().alphanum()),
})

module.exports = {
    loginSchema,
    signUpSchema,
    flightSchema,
    bookingSchema,
}