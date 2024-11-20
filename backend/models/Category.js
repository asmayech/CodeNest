// backend/models/Category.js
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Ensures the category name is unique
  },
});

categorySchema.plugin(uniqueValidator);

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
