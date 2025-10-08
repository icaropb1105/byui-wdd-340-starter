const express = require("express");
const router = express.Router();
const favoritesController = require("../controllers/favoritesController");
const utilities = require("../utilities");

// View favorites page
router.get(
  "/",
  utilities.checkJWTToken,
  utilities.checkLogin,
  favoritesController.buildFavoritesPage
);

// Toggle favorite (add/remove)
router.post(
  "/toggle/:inv_id",
  utilities.checkJWTToken,
  utilities.checkLogin,
  favoritesController.toggleFavorite
);

module.exports = router;
