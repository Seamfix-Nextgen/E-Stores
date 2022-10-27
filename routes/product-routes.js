const {
  createAProduct,
  deleteProduct,
  listByCategories,
  listproductByShop,
  productByID,
  updateProduct,
  listAllProducts,
  listbyLatest,
} = require("../controllers/product-controller");

const express = require("express");

const router = express.Router();

router.route("/").post(createAProduct).get(listAllProducts);
router.route("/:productID").delete(deleteProduct).patch(updateProduct).get(productByID);
router.route("/:category").get(listByCategories);
router.route("/:shop").get(listproductByShop);
router.route("/latest").get(listbyLatest);

