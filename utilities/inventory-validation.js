const { body, validationResult } = require("express-validator");
const utilities = require("./index");

let validate = {}

validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .notEmpty()
      .withMessage("Classification name is required.")
      .isAlphanumeric()
      .withMessage("Classification name must not contain spaces or special characters."),
  ];
};

validate.inventoryRules = () => {
  return [
    body("classification_id")
      .trim()
      .notEmpty()
      .withMessage("Please select a classification."),

    body("inv_make")
      .trim()
      .notEmpty()
      .withMessage("Make is required.")
      .isLength({ max: 50 })
      .withMessage("Make must be 50 characters or less."),

    // ... as outras validações seguem aqui, igual você já fez
  ];
};

validate.checkClassificationData = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    utilities.getNav().then((nav) => {
      return res.render("inventory/add-classification", {
        title: "Add New Classification",
        nav,
        errors: errors.array(),
        classification_name: req.body.classification_name,
      });
    });
  } else {
    next();
  }
};

validate.checkInventoryData = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    Promise.all([utilities.getNav(), utilities.buildClassificationList()]).then(
      ([nav, classificationList]) => {
        return res.render("inventory/add-inventory", {
          title: "Add New Inventory",
          nav,
          classificationList,
          errors: errors.array(),
          classification_id: req.body.classification_id,
          inv_make: req.body.inv_make,
          inv_model: req.body.inv_model,
          inv_year: req.body.inv_year,
          inv_description: req.body.inv_description,
          inv_image: req.body.inv_image,
          inv_thumbnail: req.body.inv_thumbnail,
          inv_price: req.body.inv_price,
          inv_miles: req.body.inv_miles,
          inv_color: req.body.inv_color,
        });
      }
    );
  } else {
    next();
  }
};

validate.checkUpdateData = async (req, res, next) => {
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

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList(classification_id);
    const itemName = `${inv_make} ${inv_model}`;
    return res.render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationList,
      errors: errors.array(),
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
  next();
};

module.exports = validate;
