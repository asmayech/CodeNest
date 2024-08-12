const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const router = express.Router();
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many attempts, please try again later.",
});

/*************-Signup-********** */
router.post("/signup", limiter, async (req, res, next) => {
  try {
    const emailExists = await User.exists({ email: req.body.email });
    if (emailExists) {
      return res.status(409).json({
        message: "Email already exists.",
      });
    }
    const hash = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hash,
    });
    const result = await user.save();
    res.status(201).json({
      message: "User created!",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
      message: "An error occurred while creating the user.",
    });
  }
});

/*************-Login-********** */
router.post("/login", async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(409).json({
        message: "Incorrect email or password!.",
      });
    }

    const result = await bcrypt.compare(req.body.password, user.password);
    if (!result) {
      return res.status(409).json({
        message: "Incorrect email or password!.",
      });
    }

    const token = jwt.sign(
      {
        name: user.name,
        userId: user._id,
        isAdmin: user.isAdmin,
        verified: user.verified,
      },
      "secret_this_should_be_longer_secret_this_should_be_longer_secret_this_should_be_longer_secret_this_should_be_longer_",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      token: token,
      expiresIn: 3600,
      userId: user._id,
      userName: user.name,
      isAdmin: user.isAdmin,
    });
  } catch (err) {
    console.error("Authentication error:", err);
    res.status(401).json({
      message: "Authentication failed. Incorrect email or password.",
    });
  }
});
/*************-Get User by ID-********** */
router.get("/:userId", async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({
      message: "An error occurred while fetching user information.",
      error: err,
    });
  }
});

/*************-Update User Info-********** */
router.put("/updateInfo/:userId", async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const { phoneNumber, location, bio } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.phoneNumber = phoneNumber;
    user.location = location;
    user.bio = bio;
    user.verified = true;

    await user.save();

    res.status(200).json({ message: "User information updated successfully." });
  } catch (err) {
    console.error("Error updating user info:", err);
    res.status(500).json({
      message: "An error occurred while updating user information.",
      error: err,
    });
  }
});
/*************-List Users and Filter-********** */
router.get("/", async (req, res, next) => {
  try {
    const { search } = req.query;
    let filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(filter);
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({
      message: "An error occurred while fetching users.",
      error: err,
    });
  }
});

/*************-Delete User-********** */
router.delete("/:userId", async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json({ message: "User deleted successfully." });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({
      message: "An error occurred while deleting user.",
      error: err,
    });
  }
});
module.exports = router;
