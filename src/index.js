import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
const express = require("express");
const multer = require("multer");
const { OpenAI } = require("openai");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/transcribe", upload.single("audio"), async (req, res) => {
  try {
    const buffer = req.file.buffer;

    const response = await openai.audio.transcriptions.create({
      file: buffer,
      model: "whisper-1",
      response_format: "json",
      language: "en",
    });

    const transcript = response.text;
    res.json({ transcript });
  } catch (err) {
    console.error("Whisper transcription error:", err);
    res.status(500).json({ error: "Failed to transcribe audio" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
