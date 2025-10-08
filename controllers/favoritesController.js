const favoritesModel = require("../models/favorites-model");
const utilities = require("../utilities");

const favoritesController = {};

favoritesController.buildFavoritesPage = async function (req, res, next) {
  try {
    const account_id = res.locals.accountData.account_id;
    const favorites = await favoritesModel.getFavoritesByAccount(account_id);
    const nav = await utilities.getNav();
    const grid = await utilities.buildClassificationGrid(favorites);

    res.render("favorites/index", {
      title: "My Favorite Vehicles",
      nav,
      grid,
    });
  } catch (err) {
    next(err);
  }
};

favoritesController.toggleFavorite = async function (req, res, next) {
  try {
    const account_id = res.locals.accountData.account_id;
    const inv_id = parseInt(req.params.inv_id);

    const isFav = await favoritesModel.isFavorite(account_id, inv_id);
    if (isFav) {
      await favoritesModel.removeFavorite(account_id, inv_id);
      return res.json({ success: true, message: "Removed from favorites" });
    } else {
      await favoritesModel.addFavorite(account_id, inv_id);
      return res.json({ success: true, message: "Added to favorites" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error toggling favorite" });
  }
};

module.exports = favoritesController;
