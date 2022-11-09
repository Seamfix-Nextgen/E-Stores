const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  rate: {
    type: Number,
    require: true,
    min: 0,
    max: [5, "can't be more than 5"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    unique:true
    // autopopulate: true
  },
});
reviewSchema.plugin(require("mongoose-autopopulate"));

module.exports = mongoose.model("Review", reviewSchema);
