const express = require("express");
const { protect, restrictTo } = require("../controllers/auth-contoller");
const {
  getAllCarts,
  createCart,
  getOneCart,
  updateCart,
  deleteCart,
  getAllUserCarts,
} = require("../controllers/cart-controllers");
const router = express.Router();

router
  .route("/")
  .post(protect, createCart)
  // .get(protect, restrictTo("admin"), getAllCarts);
  .get(protect, getAllUserCarts);

router
  .route("/:id")
  .get(protect, getOneCart)
  .patch(protect, updateCart)
  .delete(protect, deleteCart);

module.exports = router;
