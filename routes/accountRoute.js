const express = require("express");
const router = express.Router();

const accountController = require("../controllers/accountController");
const utilities = require("../utilities");
const regValidate = require("../utilities/account-validation");

// Login page - GET
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Process login - POST with validation
router.post(
  "/login",
  regValidate.loginRules ? regValidate.loginRules() : [],
  regValidate.checkLoginData ? regValidate.checkLoginData : (req, res, next) => next(),
  utilities.handleErrors(accountController.accountLogin)
);

// Register page - GET
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Process registration - POST with validation
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.processRegister)
);

// Account main page - GET with JWT and Login check middleware
router.get(
  "/",
  utilities.checkJWTToken,
  utilities.checkLogin,
  utilities.handleErrors(accountController.accountView)
);

module.exports = router;
