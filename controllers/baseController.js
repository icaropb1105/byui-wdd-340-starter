const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res) {
  const nav = await utilities.getNav()
  res.render("index", { title: "Home", nav })
}

baseController.throwError = (req, res, next) => {
  try {
    throw new Error("Intentional 500 error for testing middleware")
  } catch (err) {
    next(err)
  }
}


module.exports = baseController
