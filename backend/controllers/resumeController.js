import { createPDF } from "../utils/pdfGenerator.js";

// resumeController.js
export const generateResume = async (req, res) => {
  try {
    let { name, email, phone, education, skills, experience } = req.body;

    // Ensure arrays
    education = Array.isArray(education) ? education : education ? [education] : [];
    skills = Array.isArray(skills) ? skills : skills ? skills.split(',').map(s => s.trim()) : [];
    experience = Array.isArray(experience) ? experience : experience ? [{ role: experience }] : [];

    const pdfBuffer = await createPDF({
      name,
      email,
      phone,
      education,
      skills,
      experience,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=resume.pdf");
    res.send(pdfBuffer);

  } catch (error) {
    console.error("Resume generation failed:", error);
    res.status(500).json({ error: error.message });
  }
};