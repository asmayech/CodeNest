const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const ConfirmationCode = require("../models/confirmationCode");
const User = require("../models/user");
const bcrypt = require("bcrypt");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "glassisaif@gmail.com",
    pass: "cshu kmlz dkoy fawp",
  },
});

router.post("/send-confirmation-email", async (req, res) => {
  const email = req.body.email;
  const confirmationCode = generateConfirmationCode();

  try {
    const existingUser = await User.findOne({ email: email });
    if (!existingUser) {
      // If the user does not exist, throw an error
      return res.status(402).send("User not found. Please register first.");
    }

    // Check if there is an existing confirmation code for the email
    const existingConfirmation = await ConfirmationCode.findOne({ email });

    // If there is an existing confirmation, delete it
    if (existingConfirmation) {
      await existingConfirmation.remove();
    }

    // Save the new confirmation code to the database
    await ConfirmationCode.create({ email, code: confirmationCode });

    // Send the email
    transporter.sendMail(
      {
        from: "glassisaif@gmail.com",
        to: email,
        subject: "Confirm your email",
        text: `Your confirmation code is: ${confirmationCode}`,
      },
      (error, info) => {
        if (error) {
          console.log("Error sending confirmation email:", error);
          res.status(500).send("Email confirmation failed.");
        } else {
          console.log("Confirmation email sent:", info.response);
          res.status(200).json({ message: "Email sent successfully." });
        }
      }
    );
  } catch (error) {
    console.log("Error handling confirmation email:", error);
    res.status(500).send("Email confirmation failed.");
  }
});

router.post("/confirm-email", async (req, res) => {
  const { email, confirmationCode } = req.body;
  try {
    // Verify the confirmation code
    const isValidCode = await ConfirmationCode.exists({
      email,
      code: confirmationCode,
    });

    if (isValidCode) {
      res.status(200).json({ message: "Email confirmed successfully." });
    } else {
      // Invalid confirmation code
      res.status(400).send("Invalid confirmation code.");
    }
  } catch (error) {
    console.log("Error verifying confirmation code:", error);
    res.status(500).send("Email confirmation failed.");
  }
});

function generateConfirmationCode(length = 6) {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);
  }

  return code;
}
/***************-change-password-*******************/
router.post("/change-password", async (req, res) => {
  const { newPassword, email } = req.body;

  try {
    // Retrieve the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordMatch = await bcrypt.compare(newPassword, user.password);

    if (isPasswordMatch) {
      return res.status(400).json({
        message: "New password should be different from the old password",
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password and save to the database
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
module.exports = router;
