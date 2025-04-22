//indexController.js
const db = require("../db/queries");
const CustomNotFoundError = require("../errors/CustomNotFoundError");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const {
  userDataValidate,
  newMessageValidation,
} = require("../validations/userValidation");

const formatDate = (time) => {
  const date = new Date(time);

  const options = {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  const formatted = date.toLocaleString("en-US", options);
  return formatted;
};

exports.indexHome = asyncHandler(async (req, res, next) => {
  const messages = await db.getAllMessages();
  console.log(messages);
  messages.forEach((message) => {
    message.created_at = formatDate(message.created_at);
  });

  res.render("home", {
    user: req.user,
    messages: messages,
  });
});

exports.createAccountForm = asyncHandler(async (req, res, next) => {
  res.render("create-account", {
    title: "Create account",
    previousData: false,
    user: req.user,
    errors: false,
    messages: req.flash(),
  });
});

exports.createAccountFormPost = [
  userDataValidate,

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    console.log(errors.array());
    if (!errors.isEmpty()) {
      return res.status(400).render("create-account", {
        title: "Create account",
        previousData: req.body,
        user: req.user,
        errors: errors.array(),
      });
    }

    const { first_name, last_name, email, password } = req.body;

    const userExists = await db.checkForEmail(email);

    if (userExists.length > 0) {
      // throw new CustomNotFoundError(
      //   "Username already exists. Please choose another.",
      //   400
      // );
      req.flash("error", "Email is already in use. Please try another.");
      return res.redirect("create-account");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.createAccount(first_name, last_name, email, hashedPassword);

    res.redirect("/login");
  }),
];

exports.logInForm = asyncHandler(async (req, res, next) => {
  res.render("login", { user: req.user, messages: req.flash() });
});

exports.logInSubmit = asyncHandler(async (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error(err);
      return next(err);
    }

    if (!user) {
      req.flash("error", info.message || "Invalid username or password.");
      return res.redirect("/login");
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
  res.render("create-new-message", { user: req.user, title: "", message: "" });
});

exports.postNewMessage = [
  newMessageValidation,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log(errors);
      return res.render("create-new-message", {
        user: req.user,
        errors: errors.array(),
        title: req.body.title,
        message: req.body.message,
      });
    }

    const { title, message } = req.body;
    const { id } = req.user;

    const result = await db.postNewMessage(title, message, id);

    if (result) {
      res.redirect("/");
    } else {
      throw new CustomNotFoundError("Something happened", 400);
    }
  }),
];

exports.membersPage = (req, res) => {
  res.render("members", {
    user: req.user,
    messages: req.flash(),
  });
};

exports.membersPagePost = asyncHandler(async (req, res, next) => {
  if (req.body.member) {
    const result = await db.addMembershipToUser(req.user.id);
    if (result) {
      res.redirect("/");
    } else {
      req.flash("error", "An error occurred or you are already a member ");
      res.redirect("/members");
    }
  } else {
    req.flash("error", "You forgot to click the checkbox!");
    res.redirect("/members");
  }
});
