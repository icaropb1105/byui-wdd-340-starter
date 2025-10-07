const express = require("express");
const router = express.Router();
const invController = require("../controllers/invController");
const baseController = require("../controllers/baseController");
const utilities = require("../utilities/");
const invValidate = require("../utilities/inventory-validation");

// View classification for visitors (NO auth)
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);

// View vehicle detail for visitors (NO auth)
router.get(
  "/detail/:inv_id",
  utilities.handleErrors(invController.buildDetail)
);

// ==============================
// PROTECTED ROUTES BELOW
// Only Admin/Employee can access
// ==============================

router.get(
  "/",
  utilities.checkJWTToken,
  utilities.checkLogin,
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildManagement)
);

router.get(
  "/getInventory/:classification_id",
  utilities.checkJWTToken,
  utilities.checkLogin,
  utilities.checkAccountType,
  utilities.handleErrors(invController.getInventoryJSON)
);

router.get(
  "/add-classification",
  utilities.checkJWTToken,
  utilities.checkLogin,
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildAddClassification)
);

router.post(
  "/add-classification",
  utilities.checkJWTToken,
  utilities.checkLogin,
  utilities.checkAccountType,
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
);

router.get(
  "/add-inventory",
  utilities.checkJWTToken,
  utilities.checkLogin,
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildAddInventory)
);

router.post(
  "/add-inventory",
  utilities.checkJWTToken,
  utilities.checkLogin,
  utilities.checkAccountType,
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
);

router.get(
  "/edit/:inv_id",
  utilities.checkJWTToken,
  utilities.checkLogin,
  utilities.checkAccountType,
  utilities.handleErrors(invController.editInventoryView)
);

router.post(
  "/update",
  utilities.checkJWTToken,
  utilities.checkLogin,
  utilities.checkAccountType,
  invValidate.inventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
);

// Error trigger 
router.get(
  "/cause-error",
  utilities.handleErrors(baseController.throwError)
);

module.exports = router;
