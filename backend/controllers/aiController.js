import openai from "../config/openai.js";
import Progress from "../models/Progress.js";
import ollama from 'ollama'

export const getCareerAdvice = async (req, res) => {
  try {
    const { skills, experience, interests } = req.body;

    const prompt = `The user has skills: ${skills}.
    Experience: ${experience}.
    Interests: ${interests}.
    Suggest 3 career paths, trending job roles, required skills, and a 6-month learning roadmap,Keep it concise.`

    const response = await ollama.chat({
      model: "gemma3:4b",   // ✅ Can swap with any OpenRouter-supported model
      messages: [{ role: "user", content: prompt }],
    });

    const cleanText = response.message.content.replace(/\*/g, "");

    res.json({ advice: cleanText });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI service failed" });
  }
};


// Skill recommendations + auto-save
export const getSkillAdvice = async (req, res) => {  
  try {
    const { career } = req.body;
    const userId = req.user?.id;

    const prompt = `Suggest the top 10 essential technical and soft skills required for a career in ${career}.
    Output only a clean bullet-point list of skills.`;

    const response = await ollama.chat({
      model: "gemma3:4b",
      messages: [{ role: "user", content: prompt }],
    });
    console.log(response.message.content)

    const rawText = response.message.content;

    // Extract skills (split by new lines / bullet points)
    const skills = rawText
      .split("\n")
      .map((line) => line.replace(/^[-*•]\s*/, "").trim())
      .filter((line) => line.length > 0 && !line.endsWith(":"));

    // Save into Progress DB
    let progress = await Progress.findOne({ user: userId });
    if (!progress) {
      progress = new Progress({ user: userId, skills: [] });
    }

    // Spread skills evenly across 6 months
    progress.skills=[];
    const totalMonths = 6;
    skills.forEach((skill, index) => {
      const month = (index % totalMonths) + 1;  // Assign 1 → 6 cyclically
      if (!progress.skills.some((s) => s.name.toLowerCase() === skill.toLowerCase())) {
        progress.skills.push({ name: skill, completed: false, month });
      }
    });

    await progress.save();

    res.json({ suggestedSkills: skills, roadmap: progress.skills });
  } catch (error) {
    console.error("getSkillAdvice error:", error.response?.data || error.message);
    res.status(500).json({ message: "Failed to generate skill roadmap", error: error.message });
  }
};
