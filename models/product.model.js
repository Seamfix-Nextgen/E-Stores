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

    shop: { type: mongoose.Schema.ObjectId, ref: "Shop", autopopulate: true },
  },
  { timestamps: true }
);

ProductSchema.plugin(require("mongoose-autopopulate"));
const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
