import * as functions from "firebase-functions";
import fetch from "node-fetch";
import * as corsLib from "cors";

const cors = corsLib({ origin: true });

// 👇 Proxy endpoint to safely call Gemini API
export const askGemini = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const { prompt } = req.body;

      if (!prompt) {
        res.status(400).json({ error: "Missing prompt text" });
        return;
      }

      const apiKey = "AIzaSyDzpFFQ1-ISrW0syy9mWXcIb7DqMlqNi2k";
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini API Error: ${errorText}`);
      }

      const data = await response.json();
      const reply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response from Gemini";

      res.json({ reply });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: error.message });
    }
  });
});
