// Needed Resources 
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const baseController = require("../controllers/baseController")
const utilities = require("../utilities/")

// Route to build inventory by classification view
router.get("/type/:classificationId", 
  utilities.handleErrors(invController.buildByClassificationId)
)

// Route to build vehicle detail view
router.get("/detail/:inv_id", 
  utilities.handleErrors(invController.buildDetail)
)

// Route cause error (Task 3)
router.get("/cause-error", 
  utilities.handleErrors(baseController.throwError)
)

module.exports = router
