const express = require("express");
const User = require("../Model/userModel");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const router = express.Router();

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

// Register handle

router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;

  let errors = [];
  //check required fields

  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please fill in all fields" });
  }
  //check password match

  if (password !== password2) {
    errors.push({ msg: "Passwords do not match" });
  }
  // password strength

  if (password.length < 6) {
    errors.push({ msg: "Enter a minimum of 6 characters" });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2,
    });
  } else {
    //validation pass
    User.findOne({ email: email }).then((user) => {
      if (user) {
        // user exist
        errors.push({ msg: "Email is already registered" });
        res.render("register", {
          errors,
          name,
          email,
          password,
          password2,
        });
      } else {
        const newUser = new User({
          name,
          email,
          password,
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (salt, hash) => {
            if (err) {
              throw err;
            }
            // setting the new password to hashed
            newUser.password = hash;

            newUser
              .save()
              .then((user) => {
                req.flash(
                  "success_msg",
                  "You are now registered and can login"
                );
                res.redirect("/users/login");
              })
              .catch((err) => {
                console.log(err);
              });
          });
        });
      }
    });
  }
});

// Login handle

router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
});

//logout handle

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return err;
    }
    req.flash("success_msg", "You are logged out");
    res.redirect("/users/login");
  });
});

module.exports = router;
