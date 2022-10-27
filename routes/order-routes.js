const express = require("express");
const { protect,
     restrictTo
     } = ("../controllers/auth-controllers");

const { getOrder,
     getAllOrder
     } = ("../controllers/order-controllers");

const router = express.Router();

router.get("/:id", protect, getOrder);
router.get("/", protect, restrictTo("admin"), getAllOrder);

module.exports = router;
