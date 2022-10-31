const mongoose = require("mongoose");
const shopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: "Name is required",
      unique: true,
    },
    image: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    owner: { type: mongoose.Schema.ObjectId, ref: "User", autopopulate: true },
  },
  { timestamps: true }
);
shopSchema.plugin(require("mongoose-autopopulate"));
const Shop = mongoose.model("Shop", shopSchema);
module.exports = Shop;
