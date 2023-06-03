const mongoose = require("mongoose");

//User Table Schema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName : {
      type: String,
      required: true,
    },
    email : {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    }
  },
  { versionKey: false }
);

//Store the 'created at' and 'updated at'
userSchema.set("timestamps", true);
module.exports = mongoose.model('user', userSchema)
