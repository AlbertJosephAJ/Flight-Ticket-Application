const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser")
//const path = require('path')
//const hbs = require('hbs')
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

//To parse the Json object from the request
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Middlewares

//To prevent Cross Domain Policy
app.use(cors());

//To access the public folder inside the project
app.use(express.static('public'));

//View engine
//app.set('view engine', 'hbs');
//hbs.registerPartials(path.join(__dirname, "views", "partials"))

//To work with cookies
app.use(cookieParser());

//Import Routes
const AuthRoute = require("./Routes/AuthRoutes");
const userRoute = require("./Routes/userRoutes");
const adminRoute = require("./Routes/adminRoutes");

//Auth Routes
app.use("/auth", AuthRoute);

//User Routes
app.use("/user", userRoute);

//Admin Routes
app.use("/admin", adminRoute);

app.get("/app", (req, res) => {
  res.render('index')
})
//Connect to DB
mongoose
  .connect(process.env.DB_CONNECTION)
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((error) => console.log(error));

mongoose.connection.on("error", (err) => {
  console.log(err);
});
//Listening at Port 3000
app.listen(PORT);
