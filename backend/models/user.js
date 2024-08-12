const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const enumValues = require("mongoose-enumvalues");

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String },
    lastLoginAttempt: { type: Date },
    location: { type: String },
    bio: { type: String },
    verified: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const enumOptions = {};

userSchema.plugin(enumValues, enumOptions);

userSchema.plugin(uniqueValidator);

userSchema.virtual("exercises", {
  ref: "UserExercise",
  localField: "_id",
  foreignField: "user",
});

module.exports = mongoose.model("User", userSchema);
