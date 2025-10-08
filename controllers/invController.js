const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");
const { validationResult } = require("express-validator");

const invCont = {};

/* Build inventory by classification view */
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

/* Build vehicle detail view */
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
  inv_id: data.inv_id, 
});

};

/* Management view */
invCont.buildManagement = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    const classificationData = await invModel.getClassifications();
    const classificationSelect = classificationData.rows;

    const messages = {
      success: req.flash("success"),
      error: req.flash("error"),
    };

    res.render("./inventory/management", {
      title: "Inventory Management",
      nav,
      classificationSelect,
      messages,
    });
  } catch (error) {
    return next(error);
  }
};

/* Add Classification view */
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
    serverError: []
  });
};

/* Process Add Classification */
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
      serverError: []
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
      serverError: []
    });
  }
};

/* Add Inventory view */
invCont.buildAddInventory = async function (req, res) {
  const nav = await utilities.getNav();
  const classificationData = await invModel.getClassifications();
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
    serverError: [], 
  });
};

/* Process Add Inventory */
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
      serverError: [],  // evita erro undefined
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
      serverError: [],  // evita erro undefined
      ...formValues,
    });
  }
};

/* API: Return inventory by classification as JSON */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  try {
    const invData = await invModel.getInventoryByClassificationId(classification_id);
    return res.json(invData);
  } catch (error) {
    return next(error);
  }
};

/* Build edit inventory view */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  const nav = await utilities.getNav();

  const itemData = await invModel.getInventoryById(inv_id);
  if (!itemData) {
    const error = new Error("Vehicle not found");
    error.status = 404;
    return next(error);
  }

  const classificationList = await utilities.buildClassificationList(itemData.classification_id);
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;

  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationList,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  });
};

/* Update Inventory Data */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;

  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  );

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model;
    req.flash("success", `The ${itemName} was successfully updated.`);
    res.redirect("/inv/");
  } else {
    const classificationList = await utilities.buildClassificationList(classification_id);
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("error", "Sorry, the update failed.");
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationList,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
  }
};

module.exports = invCont;
