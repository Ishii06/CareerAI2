import { createPDF } from "../utils/pdfGenerator.js";
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const callGemini = async (prompt) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-001",
      contents: prompt,
      temperature: 0.7,
      maxOutputTokens: 700,
    });
    return response.text;
  } catch (err) {
    console.error("Gemini API error:", err.message);
    throw new Error("AI service failed");
  }
};

export const generateResume = async (req, res) => {
  try {
    let { name, email, phone, education, skills, experience, template } = req.body;

    // Ensure arrays
    education = Array.isArray(education) ? education : education ? [education] : [];
    skills = Array.isArray(skills) ? skills : skills ? skills.split(",").map((s) => s.trim()) : [];

    // Prompt AI to format experience + whole resume
    const prompt = `
User Info:
Name: ${name}, Email: ${email}, Phone: ${phone}
Education: ${education}
Skills: ${skills.join(", ")}
Experience (free-form text):
${experience}

Task:
    You are an expert resume writer. 
Based on the user’s input, generate a polished resume with the following rules:
Do NOT repeat name, email, or phone in the output — they are already handled in the header.
1. Sections: Summary, Education, Skills, Projects, Experience.
2. Enhance and elaborate user input using professional language. 
   - Use strong action verbs (Led, Developed, Optimized, Spearheaded).
   - Quantify impact wherever possible (e.g., "increased performance by 20%").
3. Keep formatting plain text (no markdown, no asterisks), though you can use • for bullets.
4. Each section should look like a professional resume:
   - **Education** → Degree, Institution, Year.
   - **Skills** → categorized (Programming, Frameworks, Tools).
   - **Projects** → convert user’s project input into 2–3 impact-focused bullets.
   - **Experience** → job/role, organization, dates + 3–4 enhanced bullets.
5. Keep font size readable for resumes (11–12pt equivalent).
6. Keep spacing clear: 1 blank line between sections, bullets indented.
    `;

    const enhancedText = await callGemini(prompt);
    console.log(enhancedText);
    const pdfBuffer = await createPDF({ name, email, phone, enhancedText, template });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=resume.pdf");
    res.send(pdfBuffer);

  } catch (error) {
    console.error("Resume generation failed:", error);
    res.status(500).json({ error: error.message });
  }
};
