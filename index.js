const express = require("express");
const { GoogleGenAI } = require("@google/genai");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.get("/", (req, res) => {
  res.send("🚀 Business Guidance AI is Running!");
});

app.post("/ask", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
    });

    res.json({
      reply: response.text,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "AI Error",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});