const { body } = require("express-validator");

const userDataValidate = [
  body("first_name")
    .trim()
    .notEmpty()
    .withMessage("First name is required.")
    .isLength({ min: 1, max: 100 })
    .withMessage("First name must be less than 100 characters."),

  body("last_name")
    .trim()
    .exists({ checkFalsy: true })
    .withMessage("Last name is required.")
    .isAlpha()
    .withMessage("Last name must only contain letters.")
    .isLength({ min: 1, max: 100 })
    .withMessage("Last name must be less than 100 characters."),

  body("email")
    .isEmail()
    .withMessage("Please enter a valid email address")
    .normalizeEmail()
    .notEmpty()
    .withMessage("Email is required"),

  body("password")
    .isStrongPassword({
      minLength: 5,
      minUppercase: 1,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 0,
    })
    .withMessage("password must be atleast 5 chars long, contain 1 uppercase"),

  body("confirmPassword").custom((value, { req }) => {
    return value === req.body.password;
  }),
];

const newMessageValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters"),

  body("message")
    .trim()
    .notEmpty()
    .withMessage("Message is required")
    .isLength({ min: 5, max: 500 })
    .withMessage("Message must be between 5 and 500 characters")
    .escape(),
];

module.exports = { userDataValidate, newMessageValidation };
