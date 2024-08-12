const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "glassisaif@gmail.com",
    pass: "gfqc yalp bjrx ajhb",
  },
});

router.post("/send-email", async (req, res) => {
  try {
    const { topic, gmail, content } = req.body;
    // Check if all required fields are provided
    if (!topic || !gmail || !content) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Email options
    const mailOptions = {
      from: "glassisaif@gmail.com",
      to: "glassisaif@gmail.com",
      subject: `New Inquiry - ${topic}`,
      html: `
      <div style="text-align: center;">
      <h2 style="color: #333;">New Inquiry - CodeNest</h2>
      <p style="color: #555;">Contacting Admin</p>
      <div style="max-width: 400px; margin: 20px auto; padding: 20px; background-color: #f8f8f8; border-radius: 8px; border: 1px solid #ddd;">
        <p>Hello Admin,</p>
        <p>A user has contacted you through the CodeNest website. Here are the details:</p>
        <ul style="list-style: none; padding-left: 0;">
          <li><strong>Topic:</strong> ${topic}</li>
          <li><strong>From:</strong>  ${gmail}</li>
          <li><strong>Message:</strong> ${content}</li>
        </ul>
        <p>You can respond to this inquiry by replying to this email.</p>
        <p>Best regards,<br/>CodeNest Team</p>
      </div>
    </div>
    
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Respond with success message
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
