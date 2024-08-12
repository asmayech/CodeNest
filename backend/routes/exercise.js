const express = require("express");
const Exercise = require("../models/exercise");
const Review = require("../models/review");
const UserExercise = require("../models/userexercise");
const router = express.Router();

/**************-  Create Exercise  -************** */

router.post("/", async (req, res) => {
  try {
    const exercise = new Exercise(req.body);
    await exercise.save();
    res.status(201).json({ exercise });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
/**************-  Get Exercise by ID  -************** */

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const exercise = await Exercise.findById(id);
    if (!exercise) {
      return res.status(404).json({ error: "Exercise not found" });
    }
    res.json({ exercise });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**************-  List Exercises -************** */
router.get("/", async (req, res) => {
  try {
    const { search, category, difficulty } = req.query;
    let query = {};

    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ],
      };
    }

    if (category) {
      query.category = category;
    }

    if (difficulty) {
      query.difficulty = difficulty;
    }

    // Populate the createdBy field with user data
    const exercises = await Exercise.find(query).populate([
      { path: "createdBy", select: "_id name verified isAdmin" },
    ]);

    res.json({ exercises });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**************-  List Exercises by Creator ID  -************** */

router.get("/creator/:creatorId", async (req, res) => {
  try {
    const { creatorId } = req.params;
    const { search } = req.query;

    let query = { createdBy: creatorId };
    if (search) {
      query = {
        ...query,
        $or: [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ],
      };
    }

    const exercises = await Exercise.find(query).populate({
      path: "createdBy",
      select: "_id name verified difficulty  isAdmin",
    });

    res.json({ exercises });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**************-  Edit Exercise  -************** */

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const exercise = await Exercise.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!exercise) {
      return res.status(404).json({ error: "Exercise not found" });
    }
    res.json({ exercise });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**************-  Delete Exercise  -************** */

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Review.deleteMany({ exercise: id });
    await UserExercise.deleteMany({ exercise: id });
    const exercise = await Exercise.findByIdAndDelete(id);
    if (!exercise) {
      return res.status(404).json({ error: "Exercise not found" });
    }
    res.json({ message: "Exercise deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
/**************-  Return the related exercises  -************** */

router.get("/related/:exerciseId", async (req, res) => {
  try {
    const { exerciseId } = req.params;

    const exercise = await Exercise.findById(exerciseId);
    if (!exercise) {
      return res.status(404).json({ error: "Exercise not found" });
    }

    const category = exercise.category;

    const relatedExercises = await Exercise.find({ category: category })
      .select("_id title description category difficulty")
      .limit(10);

    res.json({ relatedExercises });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;
