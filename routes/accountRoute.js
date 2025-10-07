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
  regValidate.loginRules(),
  regValidate.checkLoginData,
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

// Logout route
router.get('/logout', (req, res) => {
  res.clearCookie('jwt'); 
  req.flash('notice', 'You have been logged out.');
  res.redirect('/'); 
});

router.get(
  "/update-account",
  utilities.checkJWTToken,
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildUpdateAccount)
);

router.post(
  "/update-account",
  utilities.checkJWTToken,
  utilities.checkLogin,
  regValidate.updateAccountRules(),  
  regValidate.checkUpdateAccountData,
  utilities.handleErrors(accountController.updateAccount)
);

router.get(
  "/update-password",
  utilities.checkJWTToken,
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildUpdatePassword)
);

router.post(
  "/update-password",
  utilities.checkJWTToken,
  utilities.checkLogin,
  regValidate.updatePasswordRules(), 
  regValidate.checkUpdatePasswordData,
  utilities.handleErrors(accountController.updatePassword)
);

module.exports = router;
