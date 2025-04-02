//indexController.js
const db = require("../db/queries");
const CustomNotFoundError = require("../errors/CustomNotFoundError");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { userDataValidate } = require("../validations/userValidation");

exports.indexHome = asyncHandler(async (req, res, next) => {
  res.render("home", {
    user: req.user,
  });
});

exports.createAccountForm = asyncHandler(async (req, res, next) => {
  res.render("create-account", {
    title: "Create account",
    previousData: { first_name: "" },
    user: req.user,
    // errors: false,
  });
});

// function errorsArrayHelper(errors) {

// }

exports.createAccountFormPost = [
  userDataValidate,

  asyncHandler(async (req, res, next) => {
    console.log(req.body);

    const errors = validationResult(req);
    console.log(errors.array());
    if (!errors.isEmpty()) {
      console.log(errors);
      return res.status(400).render("create-account", {
        title: "Create account",
        previousData: req.body,
        user: req.user,
        errors: errors.array(),
      });
    }

    const { first_name, last_name, email, password } = req.body;

    const userExists = await db.checkForEmail(email);
    console.log(userExists);
    if (userExists.length > 0) {
      throw new CustomNotFoundError(
        "Username already exists. Please choose another.",
        400
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.createAccount(first_name, last_name, email, hashedPassword);

    res.redirect("/login");
  }),
];

exports.logInForm = asyncHandler(async (req, res, next) => {
  res.render("login", { user: req.user });
});

exports.logInSubmit = asyncHandler(async (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error(err);
      return next(err);
    }

    if (!user) {
      // Log the message that was passed from the strategy
      console.log(info); // This will log the error message (e.g., "Incorrect username" or "Incorrect password")

      return res.redirect("/login"); // Redirect back to the login page (or handle it in another way)
    }

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      console.log("success");
      return res.redirect("/");
    });
  })(req, res, next);
});

exports.createNewMessageForm = asyncHandler(async (req, res, next) => {
  res.render("create-new-message", { user: req.user });
});

exports.postNewMessage = asyncHandler(async (req, res, next) => {
  console.log(req.user);
  console.log(req.body);
});
