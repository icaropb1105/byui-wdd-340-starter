const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  // const nav = await utilities.getNav() // <- Temporariamente comentado
  res.render("index", {
    title: "Home",
    nav // Isso vai causar erro porque `nav` não está definido
  })
}

module.exports = baseController
