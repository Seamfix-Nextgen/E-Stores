const express = require("express");
const { protect, restrictTo } = require("../controllers/auth-controller");
const {
  getAllProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getOneProduct,
  uploadProductImage,
  resizeImage,
} = require("../controllers/product-controllers");
const router = express.Router();

router
  .route("/")
  .post(
    protect,
    restrictTo("admin"),
    uploadProductImage,
    resizeImage,
    createProduct
  )
  .get(getAllProduct);
router
  .route("/:id")
  .delete(protect, restrictTo("admin"), deleteProduct)
  .patch(
    protect,
    restrictTo("admin"),
    uploadProductImage,
    resizeImage,
    updateProduct
  )
  .get(getOneProduct);

module.exports = router;
