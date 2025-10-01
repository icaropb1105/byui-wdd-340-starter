const utilities = require(".");
const { body, validationResult } = require("express-validator");

const validate = {};

/* *************************************
 * Validation and sanitization rules for registration
 * ************************************* */
validate.registrationRules = () => {
  return [
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a first name."),

    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a last name."),

    body("account_email")
      .trim()
      .notEmpty()
      .withMessage("Email is required.")
      .isEmail()
      .withMessage("A valid email is required.")
      .normalizeEmail()
      .escape(),

    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("Password is required.")
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet security requirements."),
  ];
};

/* *************************************
 * Validation and sanitization rules for login
 * ************************************* */
validate.loginRules = () => {
  return [
    body("account_email")
      .trim()
      .notEmpty()
      .withMessage("Email is required.")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .normalizeEmail()
      .escape(),

    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("Password cannot be empty."),
  ];
};

/* *************************************
 * Check for errors after registration validation
 * ************************************* */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    return res.status(400).render("account/register", {
      title: "Register",
      nav,
      errors: errors.array(), 
      account_firstname,
      account_lastname,
      account_email,
    });
  }
  next();
};

/* *************************************
 * Check for errors after login validation
 * ************************************* */
validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: errors.array(), // pass errors array to the view
      account_email,
      messages: req.flash("notice"),
    });
  }
  next();
};

module.exports = validate;
