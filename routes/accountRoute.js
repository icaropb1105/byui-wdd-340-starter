const express = require("express");
const router = express.Router();

const accountController = require("../controllers/accountController");
const utilities = require("../utilities");
const regValidate = require("../utilities/account-validation");

// Routes for login
router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.post("/login", utilities.handleErrors(accountController.processLogin));

// Routes for registration
router.get("/register", utilities.handleErrors(accountController.buildRegister));
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.processRegister)
);

module.exports = router;
