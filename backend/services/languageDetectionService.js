const express = require("express");
const { detectLanguage } = require("../services/languageDetectionService"); // Import the detection service
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res
        .status(400)
        .json({ error: "Code is required for language detection." });
    }

    const language = await detectLanguage(code); // Call the language detection service
    res.json({ language });
  } catch (error) {
    console.error("Error detecting language:", error);
    res.status(500).json({ error: "Failed to detect language" });
  }
});

module.exports = router;
