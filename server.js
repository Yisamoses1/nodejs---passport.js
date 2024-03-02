require("dotenv").config();
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const expressSession = require("express-session");
const flash = require("connect-flash");
const mongoose = require("mongoose");
const userRoute = require("./Route/userRoute");
const index = require("./Route/index");
const passport = require("passport");

const app = express();

// passport configuration
require("./config/passport-setup")(passport);

// EJS
app.set("view engine", "ejs");
app.use(expressLayouts);

//Bodyparser
app.use(express.urlencoded({ extended: false }));
// Express session
app.use(
  expressSession({
    secret: process.env.sessionSecret,
    resave: true,
    saveUninitialized: true,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//connect flash
 
app.use(flash());

//Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

//Routes
app.use("/users", userRoute);
app.use("/", index);

// port
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Listening for request on port ${port}`);
});

// connect to mongo db
const MONGO_URL = process.env.MONGO_URL;
mongoose
  .connect(MONGO_URL)
  .then((result) => {
    console.log("Server connected");
  })
  .catch((err) => {
    console.log(err);
  });
