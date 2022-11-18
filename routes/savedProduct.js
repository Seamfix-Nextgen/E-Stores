const express = require("express");
const { protect } = require("../controllers/auth-contoller");
const { getSavedProducts, saveAProduct} = require("../controllers/savedProducts");
const router = express.Router();

router.route("/:productID/add").post(protect, saveAProduct);
router.route("/").get(protect, getSavedProducts);
module.exports = router;
