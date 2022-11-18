const express = require("express");
const { protect } = require("../controllers/auth-contoller");
const { saveAStore, getSavedStores } = require("../controllers/savedStore");
const router = express.Router();

router.route("/:storeID/add").post(protect, saveAStore);
router.route("/").get(protect, getSavedStores);
module.exports = router;
