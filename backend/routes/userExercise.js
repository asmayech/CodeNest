const express = require("express");
const router = express.Router();
const UserExercise = require("../models/userexercise");

/*************-start-********** */

router.post("/start", async (req, res) => {
  try {
    const { userId, exerciseId } = req.body;

    const userExercise = await UserExercise.findOne({
      user: userId,
      exercise: exerciseId,
    });
    if (userExercise) {
      if (userExercise.completedAt) {
        return res.status(200).json({
          message: "You have already completed this exercise",
          status: "completed",
        });
      } else {
        return res.status(200).json({
          message: "You have already started this exercise",
          status: "started",
        });
      }
    }

    const newUserExercise = new UserExercise({
      user: userId,
      exercise: exerciseId,
    });
    await newUserExercise.save();
    res
      .status(201)
      .json({ message: "Exercise started successfully", status: "started" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/*************-complete-********** */

router.post("/complete", async (req, res) => {
  try {
    const { userId, exerciseId } = req.body;
    const userExercise = await UserExercise.findOneAndUpdate(
      { user: userId, exercise: exerciseId },
      { completedAt: new Date() },
      { new: true }
    );
    if (!userExercise) {
      return res.status(404).json({ message: "Exercise not found" });
    }
    res.json({ message: "Exercise completed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/*************-Fetch exercises by user-********** */

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { completed } = req.query;

    let filter = { user: userId };
    if (completed !== undefined) {
      filter.completedAt =
        completed === "true" ? { $exists: true } : { $exists: false };
    }

    const exercises = await UserExercise.find(filter)
      .populate({
        path: "exercise",
        select: "_id title difficulty",
      })
      .exec();

    res.json(exercises);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
