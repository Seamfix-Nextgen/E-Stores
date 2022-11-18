const mongoose = require("mongoose");
const shopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name is required"],
    },
    image: {
      type: String,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      trim: true,
      required: [true, "Address of the Store is required"],
    },
    description: {
      type: String,
      trim: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
        index: "2dsphere",
      },
      formattedAddress: String,
    },
    owner: { type: mongoose.Schema.ObjectId, ref: "User" },
  },
  { timestamps: true }
);
shopSchema.plugin(require("mongoose-autopopulate"));
const Shop = mongoose.model("Shop", shopSchema);
module.exports = Shop;
