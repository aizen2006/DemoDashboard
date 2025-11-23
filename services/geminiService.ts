import { GoogleGenAI } from "@google/genai";

// Vite exposes env variables on import.meta.env
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateInsights = async (contextData: string): Promise<string> => {
  if (!apiKey) {
    return "API Key is missing. Please check your .env file and ensure VITE_GEMINI_API_KEY is set.";
  }

  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      You are a Senior Data Analyst for LYNQ, an EdTech analytics platform.
      Analyze the following JSON data representing learning module performance metrics.

      Data:
      ${contextData}

      Your goal is to provide high-value, actionable intelligence. 
      Just give the insights and a short Call to Action plan
      Tone: Professional, insightful, and direct. Avoid generic advice.
      If the data indicates perfect performance, suggest advanced optimization strategies.
      Try to Keep it short and in bullets/points format with actionable steps make it not more than 4 points
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "No insights could be generated at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Failed to generate AI insights. Please try again later.";
  }
};