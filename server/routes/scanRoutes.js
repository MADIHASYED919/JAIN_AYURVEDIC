if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const router = express.Router();
const multer = require("multer");
const Tesseract = require("tesseract.js");
const axios = require("axios");
const fs = require("fs");

const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("image"), async (req, res) => {
  const imagePath = req.file.path;

  try {
    // =========================
    // 🔍 OCR TEXT
    // =========================
    const ocr = await Tesseract.recognize(imagePath, "eng");
    const extractedText = ocr.data.text;

    const base64Image = fs.readFileSync(imagePath).toString("base64");

    // =========================
    // 🧠 PROMPT
    // =========================
 const prompt = `
You are an experienced medical doctor.

Analyze the medicine and respond STRICTLY in JSON format:

{
  "name": "Medicine name",
  "uses": "What it is used for",
  "dosage": {
    "children": "Dosage for children",
    "adults": "Dosage for adults",
    "elderly": "Dosage for elderly"
  },
  "precautions": "Important precautions",
  "sideEffects": "Possible side effects",
  "expiryInfo": "Storage and expiry info",
  "howToUse": "When and how to take (before/after food)"
}

Give clear, practical, patient-friendly explanation.
Do not give short answers.

Medicine text:
${extractedText}
`;

    let result = null;

    // =========================
    // ✅ SAFE PARSE FUNCTION
    // =========================
    const safeParse = (text) => {
      try {
        const cleanText = text.match(/{[\s\S]*}/); // extract JSON
        return JSON.parse(cleanText ? cleanText[0] : text);
      } catch {
        return {
          name: "Unknown Medicine",
          uses: text,
          dosage: {
            children: "Consult doctor",
            adults: "Check label",
            elderly: "Consult doctor",
          },
          precautions: "Follow medical advice",
          sideEffects: "Not clearly known",
          expiryInfo: "Check packaging",
        };
      }
    };

    // =========================
    // ⚡ GEMINI FIRST
    // =========================
    try {
      const geminiRes = await axios.post(
        `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [
                { text: prompt },
                {
                  inlineData: {
                    mimeType: req.file.mimetype,
                    data: base64Image,
                  },
                },
              ],
            },
          ],
        }
      );

      const text =
        geminiRes.data.candidates?.[0]?.content?.parts?.[0]?.text || "";

      result = safeParse(text);

      console.log("✅ Gemini used");

    } catch (err) {
   console.log("⚠️ Gemini failed → switching to Ollama...");

      // =========================
      // 🔁 OLLAMA FALLBACK
      // =========================
      try {
        const ollamaRes = await axios.post(
          "http://localhost:11434/api/generate",
          {
            model: "llava",
            prompt: prompt,
            images: [base64Image],
            stream: false,
          }
        );

        const text = ollamaRes.data.response || "";

        result = safeParse(text);

        console.log("✅ Ollama used");

      } catch (err2) {
        console.log("❌ Ollama failed");

        // =========================
        // 🆘 FINAL FALLBACK
        // =========================
        result = {
          name: "Unknown Medicine",
          uses: "General health support",
          dosage: {
            children: "Consult doctor",
            adults: "1-2 times daily after food",
            elderly: "Consult doctor",
          },
          precautions: "Avoid overdose",
          sideEffects: "Not clearly known",
          expiryInfo: "Check packaging",
        };
      }
    }

    fs.unlinkSync(imagePath);

    res.json(result);

  } catch (err) {
    console.log("❌ ERROR:", err.message);

    res.json({
      name: "Error",
      uses: "Scan failed",
      dosage: {},
      precautions: "",
      sideEffects: "",
      expiryInfo: "",
    });
  }
});

module.exports = router;