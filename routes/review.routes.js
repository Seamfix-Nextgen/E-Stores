const express = require("express");
const { protect} = require("../controllers/auth-contoller");
const { createReview,getAverageReviews } = require("../controllers/review-controllers");
const router = express.Router();

router.route("/:id/add").post(protect, createReview);
router.route("/:id").get(protect, getAverageReviews);


module.exports = router;
