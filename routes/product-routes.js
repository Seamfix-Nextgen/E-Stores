const express = require("express");
const { protect, restrictTo } = require("../controllers/auth-contoller");
const {
  listByCategories,
  createAProduct,
  listAllProducts,
  deleteProduct,
  updateProduct,
  productByID,
  listproductByShop,
  listbyLatest,
  createManyProducts,
  sortPrices,
  uploadProductImage,
  resizeImage,
} = require("../controllers/product.controller");
const router = express.Router();



router.route("/latest").get(listbyLatest);

router.route("/cheapest").get(sortPrices);

router
  .route("/")
  .post(protect, restrictTo("shopOwner"),uploadProductImage,resizeImage, createAProduct)
  .get(listAllProducts);
router
  .route("/many")
  .post(protect, restrictTo(  "shopOwner"), createManyProducts);

router.route("/shop/:shopID/").get(listproductByShop);
router
  .route("/:productID")
  .delete(protect, restrictTo("admin"), deleteProduct)
  .patch(protect, restrictTo("shopOwner"),uploadProductImage,resizeImage, updateProduct)
  .get(productByID);

router.route("/categories/:category").get(listByCategories);

module.exports = router;
