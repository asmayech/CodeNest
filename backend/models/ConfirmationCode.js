const mongoose = require("mongoose");

const confirmationCodeSchema = new mongoose.Schema({
  email: { type: String, required: true },
  code: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 600 }, // Expires after 10 minutes (600 seconds)
});

const ConfirmationCode = mongoose.model(
  "ConfirmationCode",
  confirmationCodeSchema
);

module.exports = ConfirmationCode;
