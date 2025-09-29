const { body, validationResult } = require("express-validator");
const utilities = require("./index"); 

const classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .notEmpty()
      .withMessage("Classification name is required.")
      .isAlphanumeric()
      .withMessage("Classification name must not contain spaces or special characters."),
  ];
};

const inventoryRules = () => {
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

    body("inv_model")
      .trim()
      .notEmpty()
      .withMessage("Model is required.")
      .isLength({ max: 50 })
      .withMessage("Model must be 50 characters or less."),

    body("inv_year")
      .trim()
      .notEmpty()
      .withMessage("Year is required.")
      .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
      .withMessage(`Year must be a valid number between 1900 and ${new Date().getFullYear() + 1}.`),

    body("inv_description")
      .trim()
      .notEmpty()
      .withMessage("Description is required."),

    body("inv_image")
      .trim()
      .notEmpty()
      .withMessage("Image path is required.")
      .matches(/^\/images\/vehicles\/.*\.(jpg|jpeg|png|gif)$/i)
      .withMessage("Image path must be a valid vehicle image path."),

    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .withMessage("Thumbnail path is required.")
      .matches(/^\/images\/vehicles\/.*\.(jpg|jpeg|png|gif)$/i)
      .withMessage("Thumbnail path must be a valid vehicle thumbnail path."),

    body("inv_price")
      .trim()
      .notEmpty()
      .withMessage("Price is required.")
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number."),

    body("inv_miles")
      .trim()
      .notEmpty()
      .withMessage("Mileage is required.")
      .isInt({ min: 0 })
      .withMessage("Mileage must be a positive integer."),

    body("inv_color")
      .trim()
      .notEmpty()
      .withMessage("Color is required.")
      .isLength({ max: 30 })
      .withMessage("Color must be 30 characters or less."),
  ];
};

// Middleware para validar e exibir erros da classificação
const checkClassificationData = (req, res, next) => {
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

// Middleware para validar e exibir erros do inventário
const checkInventoryData = (req, res, next) => {
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

module.exports = {
  classificationRules,
  inventoryRules,
  checkClassificationData,
  checkInventoryData,
};
