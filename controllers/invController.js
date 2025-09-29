const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");
const { validationResult } = require("express-validator");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);

  if (!data || data.length === 0) {
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
  const data = await invModel.getInventoryById(inv_id);

  if (!data) {
    const error = new Error("Vehicle not found");
    error.status = 404;
    return next(error);
  }

  const vehicleDetail = await utilities.buildVehicleDetail(data);
  let nav = await utilities.getNav();

  res.render("./inventory/detail", {
    title: `${data.inv_make} ${data.inv_model}`,
    nav,
    vehicleDetail,
  });
};

/* ***************************
 *  Management view
 * ************************** */
invCont.buildManagement = async function (req, res) {
  const nav = await utilities.getNav();
  const messages = {
    success: req.flash("success"),
    error: req.flash("error"),
  };

  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    messages,
  });
};

/* ***************************
 *  Add Classification View
 * ************************** */
invCont.buildAddClassification = async function (req, res) {
  const nav = await utilities.getNav();
  const messages = {
    success: req.flash("success"),
    error: req.flash("error"),
  };

  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    messages,
    errors: null,
    classification_name: "",
  });
};

/* ***************************
 *  Process Add Classification
 * ************************** */
invCont.addClassification = async function (req, res) {
  const { classification_name } = req.body;
  const nav = await utilities.getNav();
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      messages: { success: [], error: [] },
      errors: errors.array(),
      classification_name,
    });
  }

  const result = await invModel.addClassification(classification_name);

  if (result) {
    req.flash("success", "New classification added successfully.");
    return res.redirect("/inv");
  } else {
    req.flash("error", "Failed to add classification.");
    return res.render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      messages: { success: [], error: req.flash("error") },
      errors: [],
      classification_name,
    });
  }
};

/* ***************************
 *  Add Inventory View
 * ************************** */
invCont.buildAddInventory = async function (req, res) {
  const nav = await utilities.getNav();
  const classificationList = await utilities.buildClassificationList();
  const messages = {
    success: req.flash("success"),
    error: req.flash("error"),
  };

  res.render("./inventory/add-inventory", {
    title: "Add New Inventory",
    nav,
    messages,
    classificationList,
    errors: null,
    classification_id: "",
    inv_make: "",
    inv_model: "",
    inv_year: "",
    inv_description: "",
    inv_image: "/images/vehicles/no-image.png",
    inv_thumbnail: "/images/vehicles/no-image-tn.png",
    inv_price: "",
    inv_miles: "",
    inv_color: "",
  });
};

/* ***************************
 *  Process Add Inventory
 * ************************** */
invCont.addInventory = async function (req, res) {
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
  } = req.body;

  const nav = await utilities.getNav();
  const classificationList = await utilities.buildClassificationList();
  const errors = validationResult(req);

  const formValues = {
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
  };

  if (!errors.isEmpty()) {
    return res.render("./inventory/add-inventory", {
      title: "Add New Inventory",
      nav,
      messages: { success: [], error: [] },
      classificationList,
      errors: errors.array(),
      ...formValues,
    });
  }

  const result = await invModel.addInventory(
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color
  );

  if (result) {
    req.flash("success", "New vehicle added successfully.");
    return res.redirect("/inv");
  } else {
    req.flash("error", "Failed to add vehicle.");
    return res.render("./inventory/add-inventory", {
      title: "Add New Inventory",
      nav,
      messages: { success: [], error: req.flash("error") },
      classificationList,
      errors: [],
      ...formValues,
    });
  }
};

module.exports = invCont;
