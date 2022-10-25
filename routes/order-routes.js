const express = require("express");
const { protect, restrictTo } = "../controllers/auth-controllers";

const { getOrder, getAllOrder } = "../controllers/order-controllers";
const router = express.Router();

router.get("/", protect, restrictTo("admin"), getAllOrder);
router.get("/:id", protect, getOrder);

module.exports = router;
