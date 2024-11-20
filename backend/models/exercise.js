const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  starterCode: {
    type: String,
    required: true,
  },
  expectedOutput: {
    type: String,
    required: true,
  },
  tasks: {
    type: String,
    required: true,
  },
  exampleCode: {
    type: String,
    required: true,
  },
  solution: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ["easy", "normal", "hard"],
    default: "normal",
  },
});

const Exercise = mongoose.model("Exercise", exerciseSchema);

module.exports = Exercise;
