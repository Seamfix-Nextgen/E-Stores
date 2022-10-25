const express = require("express");
const { protect, restrictTo } = require("../controllers/auth-controller");
const {
  getAllCarts,
  createCart,
  updateCart,
  deleteCart,
  getOneCart,
} = require("../controllers/cart-controllers");

const router = express.Router();

router
  .route("/")
  .post(protect, createCart)
  .get(protect, restrictTo("admin"), getAllCarts);
router
  .route("/:id")
  .get(protect, getOneCart)
  .patch(protect, updateCart)
  .delete(protect, deleteCart);

module.exports = router;
