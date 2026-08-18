import { GoogleGenAI } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

async function runChat(prompt) {
  try {
    if (!apiKey) {
      throw new Error("API key not found. Please check your .env file.");
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Detailed error:", error);
    throw error;
  }
}

export default runChat;