const express = require("express");
const { protect } = require("../controllers/auth-contoller");
const {
  saveAStore,
  getSavedStores,
  deleteAsavedStore,
} = require("../controllers/savedStore");
const router = express.Router();

router
  .route("/:storeID/")
  .post(protect, saveAStore)
  .delete(protect, deleteAsavedStore);
router
  .route("/")
  .get(protect, getSavedStores)
  
module.exports = router;
