const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../Model/userModel");

module.exports = async function (passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        /// to check if the user exist
        await User.findOne({ email: email })
          .then((user) => {
            if (!user) {
              return done(null, false, {
                message: "That email is not registered",
              });
            }

            // match the password
            bcrypt.compare(password, user.password, (err, isMatch) => {
              if (err) {
                throw err;
              }

              if (isMatch) {
                return done(null, user);
              } else {
                return done(null, false, { message: "Password incorrect" });
              }
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    )
  );

  passport.serializeUser(async function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};
