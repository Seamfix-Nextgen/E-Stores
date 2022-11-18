const mongoose = require("mongoose");

const savedStoreSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    shop: {
      type: mongoose.Types.ObjectId,
      ref: "Shop",
      autopopulate: true,
    },
  },
  { timestamps: true }
);
savedStoreSchema.plugin(require("mongoose-autopopulate"));
const savedStore = mongoose.model("savedStoreSchema", savedStoreSchema);
module.exports = savedStore;
