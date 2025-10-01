const utilities = require("../utilities");
const accountModel = require("../models/account-model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const accountController = {};

// Build login page
accountController.buildLogin = async (req, res) => {
  const nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    messages: req.flash("notice") || [],
    nav,
  });
};

// Process login
accountController.accountLogin = async (req, res) => {
  const nav = await utilities.getNav();
  const { account_email, account_password } = req.body;

  const accountData = await accountModel.getAccountByEmail(account_email);
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
  }

  try {
    const passwordMatch = await bcrypt.compare(account_password, accountData.account_password);
    if (passwordMatch) {
      delete accountData.account_password; // remove password before token
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 }); // 1 hour

      const cookieOptions = {
        httpOnly: true,
        maxAge: 3600 * 1000,
      };

      if (process.env.NODE_ENV !== "development") {
        cookieOptions.secure = true; // use secure cookie in production
      }

      res.cookie("jwt", accessToken, cookieOptions);

      return res.redirect("/account/");
    } else {
      req.flash("notice", "Please check your credentials and try again.");
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
    }
  } catch (error) {
    console.error(error);
    throw new Error("Access Forbidden");
  }
};

// Build register page
accountController.buildRegister = async (req, res) => {
  const nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    messages: req.flash("notice") || [],
    nav,
    errors: null,
  });
};

// Process registration
accountController.processRegister = async (req, res, next) => {
  try {
    const { account_firstname, account_lastname, account_email, account_password } = req.body;

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(account_password, 10);

    const result = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    );

    if (result) {
      req.flash("notice", `Congratulations, you're registered ${result.account_firstname}. Please log in.`);
      return res.status(201).render("account/login", {
        title: "Login",
        nav: await utilities.getNav(),
        messages: req.flash("notice"),
      });
    } else {
      req.flash("notice", "Registration failed.");
      return res.status(500).render("account/register", {
        title: "Register",
        nav: await utilities.getNav(),
        messages: req.flash("notice"),
      });
    }
  } catch (error) {
    next(error);
  }
};

// Build account view page (user dashboard)
accountController.accountView = async (req, res, next) => {
  try {
    // Account data from verified JWT token
    const accountData = res.locals.accountData;

    if (!accountData || !accountData.account_id) {
      req.flash("notice", "Please log in to view your account.");
      return res.redirect("/account/login");
    }

    // Get fresh account info from DB by ID
    const accountDetails = await accountModel.getAccountById(accountData.account_id);

    if (!accountDetails) {
      req.flash("notice", "Account not found.");
      return res.redirect("/account/login");
    }

    const nav = await utilities.getNav();

    res.render("account/index", {
      title: "Account Management",
      nav,
      account: accountDetails,
      message: req.flash("notice"),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = accountController;
