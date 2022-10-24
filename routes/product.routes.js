const {
  createAProduct,
  deleteProduct,
  listByCategories,
  listproductByShop,
  productByID,
  updateProduct,
  listAllProducts,
  listbyLatest,
} = require("../controllers/product.controller");

const express = require("express");

const router = express.Router();

router.route("/products/new").post(createAProduct);
router.route("/products/:productID").delete(deleteProduct);
router.route("/products/:category").get(listByCategories);
router.route("/products/:shop").get(listproductByShop);
router.route("/products/:productID").get(productByID);
router.route("/products/all").get(listAllProducts);
router.route("/products/latest").get(listbyLatest);
router.route("/products/:productID").put(updateProduct);
