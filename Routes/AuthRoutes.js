const express = require("express");
const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const adminModel = require("../models/adminModel");
const { loginSchema, signUpSchema } = require("../Validation/validationSchema");
const router = express.Router();
//const MAX_AGE = 1000 * 60 * 60 * 24;
const { createUserToken, createAdminToken } = require("../Validation/jwt");

//Login of user
router.post("/user/Login", async (req, res) => {
  try {
    const result = await loginSchema.validateAsync(req.body);
    const isUserPresent = await userModel.findOne({
      email: result.email,
    });
    if (!isUserPresent) {
      return res.json({ message: "User not Registered" });
    }
    const match = await bcrypt.compare(result.password, isUserPresent.password);
    if (!match) {
      return res.json({ message: "Invalid Credentials" });
    }

    const token = await createUserToken(isUserPresent._id.toString());
    res.cookie("jwt", token, { httpOnly: true });
    res.json({ user_id: isUserPresent._id });
  } catch (err) {
    res.json({ message: "Internal Server Error" });
  }
});

//Store the User Registration details
router.post("/user/SignUp", async (req, res) => {
  try {
    const result = await signUpSchema.validateAsync(req.body);
    const isUserPresent = await userModel.findOne({
      email: result.email,
    });
    if (isUserPresent) {
      return res.json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(result.password, 10);
    const userDetails = new userModel({
      firstName: result.firstName,
      lastName: result.lastName,
      email: result.email,
      password: hashedPassword,
      phoneNumber: result.phoneNumber,
    });

    const data = await userDetails.save();
    const token = await createUserToken(data._id.toString());
    res.cookie("jwt", token, { httpOnly: true });

    res.json({ user_id: data._id });
  } catch (err) {
    res.json({ message: err.details[0].message });
  }
});

//User logout
router.get("/user/Logout", async (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.json("User Logged out");
});

//Login of Admin
router.post("/admin/Login", async (req, res) => {
  try {
    const result = await loginSchema.validateAsync(req.body);
    const isAdminPresent = await adminModel.findOne({
      email: result.email,
    });
    if (!isAdminPresent) {
      return res.json({ message: "Admin not Registered" });
    }
    const match = await bcrypt.compare(
      result.password,
      isAdminPresent.password
    );
    if (!match) {
      return res.json({ message: "Invalid Credentials" });
    }

    const token = await createAdminToken(isAdminPresent._id.toString());
    res.cookie("jwt", token, { httpOnly: true });
    res.json({ admin_id: isAdminPresent._id });
  } catch (err) {
    res.json({ message: "Internal Server Error" });
  }
});

//Signup of Admin
router.post("/admin/Signup", async (req, res) => {
  try {
    const result = await signUpSchema.validateAsync(req.body);
    const isAdminPresent = await adminModel.findOne({
      email: result.email,
    });
    if (isAdminPresent) {
      return res.json({ message: "Admin already exists" });
    }
    const hashedPassword = await bcrypt.hash(result.password, 10);
    const adminDetails = new adminModel({
      firstName: result.firstName,
      lastName: result.lastName,
      email: result.email,
      password: hashedPassword,
      phoneNumber: result.phoneNumber,
    });

    const data = await adminDetails.save();
    const token = await createAdminToken(data._id.toString());
    res.cookie("jwt", token, { httpOnly: true });

    res.json({ admin_id: data._id });
  } catch (err) {
    res.json({ message: err.details[0].message });
  }
});

//admin logout
router.get("/admin/Logout", async (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.json("Admin Logged out");
});

module.exports = router;

// const refreshToken = await createRefreshToken(isUserPresent.id)
// res.send({ accessToken, refreshToken});

// const accessToken = await createAccessToken(data.id);
// const refreshToken = await createRefreshToken(data.id);

// router.post("/user/refreshToken", async (req, res) => {
//     try {
//         const ReceivedRefreshToken  = req.body.refreshToken;
//         if(!ReceivedRefreshToken) {
//             //console.log(ReceivedRefreshToken);
//             return res.send("Please Login Again")
//         }
//         console.log(ReceivedRefreshToken)
//         const userId = await verifyRefreshToken(ReceivedRefreshToken)

//         const accessToken = await createAccessToken(userId)
//         const refreshToken = await createRefreshToken(userId);
//         res.send({accessToken, refreshToken});
//     } catch(err) {
//         console.log(err);
//         res.send("Error")
//     }
// });

//router.post("/admin/refresh-token", async (req, res) => {});
