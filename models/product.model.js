const mongoose = require("mongoose");
const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: "Name is required",
    },
    images: [
      {
        type: String,
        trim: true,
      },
    ],
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
    },
    quantity: {
      type: Number,
      required: "Quantity is required",
    },
    price: {
      type: Number,
      required: "Price is required",
    },
    averageReview: {
      type: Number,
      default: 0,
    },

    shop: {
      type: mongoose.Schema.ObjectId,
      ref: "Shop",
      autopopulate: true,
    },
    reviews: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Review",
        autopopulate: true,
        select: false 
      },
    ],
  },

  { timestamps: true }
);


// ProductSchema.pre("findOneAndUpdate", async function (next) {
//  console.log(this.reviews)
//  this.averageReview = (this.reviews.reduce((total, currentValue) => {
//           if(typeof currentValue.rate === "number"){
//           return total + parseInt(currentValue.rate)}
// },0)/this.reviews.length)

// next()
// })
ProductSchema.plugin(require("mongoose-autopopulate"));
const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
