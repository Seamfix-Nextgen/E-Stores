const {
  createShop,
  editShop,
  getShopByName,
  getAllShops,
  deleteShop,
} = require("../controllers/shop-controllers");
const { protect, restrictTo } = require("../controllers/auth-contoller");
const express = require("express");
const router = express.Router();

router.route("/new").post(protect, restrictTo("shopOwner"), createShop);
router.route("/all").get(getAllShops);
router.route("/shop/").get(getShopByName);
router.route("/:shopID").put(protect, editShop).delete(protect, deleteShop);

module.exports = router;
