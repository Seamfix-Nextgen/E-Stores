const express = require("express");
const { protect, restrictTo } = require("../controllers/auth-contoller");
const {
  createProduct,
  listCategories,
  listProductByShop,
  deleteProduct,
  productById,
  updateProduct,
  listAllProduct,
  listByLatest,
} = require("../controllers/product-controller");
const router = express.Router();

router
  .route("/")
  .post(protect, restrictTo("admin"), createProduct)
  .get(listAllProduct);
router
  .route("/:id")
  .delete(protect, restrictTo("admin"), deleteProduct)
  .patch(protect, restrictTo("admin"), updateProduct)
  .get(productById);
router.route("/:category").get(listCategories);
router.route("/:shop").get(listProductByShop);
router.route("/:latest").get(listByLatest);

module.exports = router;
