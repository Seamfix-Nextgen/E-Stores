const Review = require("../models/review.model");
const Product = require("../models/product.model");
const CatchAsync = require("../utils/catch-async");
const createReview = async (req, res) => {
  let { rate } = req.body;
  let newrate = parseInt(rate);
  Review.create({
    rate: newrate,
    user: req.user._id,
  })
    .then((savedReview) => {
      return Product.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { reviews: savedReview._id } },
        { new: true }
      );
    })
    .then((updatedProduct) => {
      let averageReview =
        updatedProduct.reviews.reduce((total, currentValue) => {
          if (typeof currentValue.rate === "number") {
            return total + parseInt(currentValue.rate);
          } else {
            return total + 0;
          }
        }, 0) / updatedProduct.reviews.length;

      updatedProduct.averageReview = averageReview.toFixed(2);
      updatedProduct.save();
      return res
        .status(201)
        .json({ averageReview: updatedProduct.averageReview });
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).send({ err: err.message });
    });
};

const getAverageReviews = CatchAsync(async (req, res) => {
  const productID = req.params.id;
  const product = await Product.findById(productID);
  if (!product)
    return res.status(404).send({ error: true, message: "product not found" });
  const averageReview = product.averageReview    
  return res.status(200).json({ averageReview });
});
module.exports = { createReview, getAverageReviews };
