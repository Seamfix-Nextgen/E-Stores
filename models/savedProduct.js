const mongoose = require("mongoose");

const savedProductSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      autopopulate: true,
    },
  },
  { timestamps: true }
);
savedProductSchema.plugin(require("mongoose-autopopulate"));
const savedProduct = mongoose.model("savedProduct", savedProductSchema);
module.exports = savedProduct;
