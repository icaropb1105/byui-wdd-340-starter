const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);

  if (!data || data.length === 0) {
    //
    return res.redirect('/');
  }
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;

  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};


/* ***************************
 *  Build vehicle detail view
 * ************************** */
invCont.buildDetail = async function (req, res, next) {
  const inv_id = req.params.inv_id;

  // Pega os dados do veículo pelo id
  const data = await invModel.getInventoryById(inv_id);

  if (!data) {
    // Se não achar, envia erro 404
    const error = new Error("Vehicle not found");
    error.status = 404;
    return next(error);
  }

  // Usa o utilitário para montar o HTML da view do veículo
  const vehicleDetail = await utilities.buildVehicleDetail(data);

  let nav = await utilities.getNav();

  res.render("./inventory/detail", {
    title: `${data.inv_make} ${data.inv_model}`,
    nav,
    vehicleDetail,
  });
};

module.exports = invCont
