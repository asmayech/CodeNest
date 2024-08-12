const express = require("express");
const Review = require("../models/review");
const Exercise = require("../models/exercise");
const router = express.Router();

/**************-  Create Review  -************** */
router.post("/", async (req, res) => {
  try {
    const review = new Review(req.body);
    await review.save();
    res.status(201).json({ review });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}); /**************-  List Reviews  -**************/
router.get("/:exerciseId", async (req, res) => {
  try {
    const { exerciseId } = req.params;
    let { sortBy } = req.query;

    const exercise = await Exercise.findById(exerciseId).select(
      "_id title description"
    );
    if (!exercise) {
      return res.status(404).json({ error: "Exercise not found" });
    }

    // Default sorting to "newest" if sortBy is not provided or is invalid
    if (!["newest", "oldest"].includes(sortBy)) {
      sortBy = "newest";
    }

    let reviewsQuery = Review.find({ exercise: exerciseId }).populate([
      { path: "user", select: "_id name email verified isAdmin" },
    ]);

    if (sortBy === "newest") {
      reviewsQuery = reviewsQuery.sort({ date: -1 });
    } else if (sortBy === "oldest") {
      reviewsQuery = reviewsQuery.sort({ date: 1 });
    }

    const reviews = await reviewsQuery;

    let totalComments = 0;
    let totalReviews = 0;
    let totalRating = 0;
    const ratedUsers = new Set();
    reviews.forEach((review) => {
      if (review.rating !== 0 && !ratedUsers.has(review.user._id)) {
        totalReviews++;
        totalRating += review.rating;
        ratedUsers.add(review.user._id);
      }
      if (review.text !== "") {
        totalComments++;
      }
    });

    const averageRating = totalReviews !== 0 ? totalRating / totalReviews : 0;

    res.json({ exercise, reviews, totalReviews, averageRating, totalComments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**************-  Edit Review  -************** */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const review = await Review.findByIdAndUpdate(
      id,
      { text },
      {
        new: true,
      }
    );
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }
    res.json({ review });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**************-  Delete Review  -************** */

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findByIdAndDelete(id);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }
    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
