import { GoogleGenAI } from "@google/genai";
import Progress from "../models/Progress.js";

// Initialize Gemini client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Helper function to call Gemini
const callGemini = async (prompt) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-001", // Gemini 2.0 model
      contents: prompt,
      temperature: 0.7,
      maxOutputTokens: 500,
    });

    // response.text contains the generated text
    return response.text;
  } catch (error) {
    console.error("Gemini API error:", error.message);
    throw new Error("Gemini API failed");
  }
};

// Career advice endpoint
export const getCareerAdvice = async (req, res) => {
  try {
    const { skills, experience, interests } = req.body;

    const prompt = `The user has skills: ${skills}.
Experience: ${experience}.
Interests: ${interests}.
Suggest 3 career paths, trending job roles, required skills, and a 6-month learning roadmap. Keep it concise.`;

    const rawText = await callGemini(prompt);

    // remove stars only
    const cleanText = rawText.replace(/\*/g, "");

    res.json({ advice: cleanText });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI service failed" });
  }
};


// Skill advice + auto-save endpoint
export const getSkillAdvice = async (req, res) => {
  try {
    const { career } = req.body;
    const userId = req.user?.id;

    const prompt = `Suggest the top 10 essential technical and soft skills required for a career in ${career}.
Output only a clean bullet-point list of skills.`;

    const rawText = await callGemini(prompt);
    const cleanText = rawText.replace(/\*/g, "");

    const skills = cleanText
      .split("\n")
      .map((line) => line.replace(/^[-*•]\s*/, "").trim())
      .filter((line) => line.length > 0 && !line.endsWith(":"));

    let progress = await Progress.findOne({ user: userId });
    if (!progress) {
      progress = new Progress({ user: userId, skills: [] });
    }

    progress.skills = [];
    const totalMonths = 6;
    skills.forEach((skill, index) => {
      const month = (index % totalMonths) + 1;
      if (!progress.skills.some((s) => s.name.toLowerCase() === skill.toLowerCase())) {
        progress.skills.push({ name: skill, completed: false, month });
      }
    });

    await progress.save();

    res.json({ suggestedSkills: skills, roadmap: progress.skills });
  } catch (error) {
    console.error("getSkillAdvice error:", error.message);
    res.status(500).json({ message: "Failed to generate skill roadmap", error: error.message });
  }
};