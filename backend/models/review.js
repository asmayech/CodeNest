const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  exercise: { type: mongoose.Schema.Types.ObjectId, ref: "Exercise" },
  text: String,
  rating: Number,
  date: { type: Date, default: Date.now },
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
