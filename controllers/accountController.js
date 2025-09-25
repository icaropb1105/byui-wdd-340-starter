const utilities = require("../utilities");
const accountModel = require("../models/account-model");

const accountController = {};

// Build login view
accountController.buildLogin = async (req, res) => {
  res.render("account/login", {
    title: "Login",
    messages: req.flash("notice") || [],
    nav: res.locals.nav,
  });
};

// Process login
accountController.processLogin = async (req, res, next) => {
  try {
    const { account_email, account_password } = req.body;
    // TODO

    req.flash("notice", "Login successful!");
    res.redirect("/account");
  } catch (error) {
    next(error);
  }
};

// Build register view
accountController.buildRegister = async (req, res) => {
  res.render("account/register", {
    title: "Register",
    messages: req.flash("notice") || [],
    nav: res.locals.nav,
    errors: null,
  });
};

// Process registration
accountController.processRegister = async (req, res, next) => {
  try {
    const { account_firstname, account_lastname, account_email, account_password } = req.body;

    

    const result = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      account_password
    );

    if (result) {
      req.flash(
        "notice",
        `Congratulations, you're registered ${result.account_firstname}. Please log in.`
      );
      return res.status(201).render("account/login", {
        title: "Login",
        nav: res.locals.nav,
        messages: req.flash("notice"),
      });
    } else {
      req.flash("notice", "Registration failed.");
      return res.status(500).render("account/register", {
        title: "Register",
        nav: res.locals.nav,
        messages: req.flash("notice"),
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = accountController;
