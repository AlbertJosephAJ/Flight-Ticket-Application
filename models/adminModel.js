const mongoose = require("mongoose");

//Admin Table Schema
const adminSchema = new mongoose.Schema(
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
adminSchema.set("timestamps", true);
module.exports = mongoose.model('admin', adminSchema)
