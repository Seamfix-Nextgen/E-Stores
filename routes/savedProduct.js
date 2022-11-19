const express = require("express");
const { protect } = require("../controllers/auth-contoller");
const {
  getSavedProducts,
  saveAProduct,
  deleteAsavedProduct,
} = require("../controllers/savedProducts");
const router = express.Router();

router
  .route("/:productID/")
  .post(protect, saveAProduct)
  .delete(protect, deleteAsavedProduct);
router
  .route("/")
  .get(protect, getSavedProducts)
  
module.exports = router;
