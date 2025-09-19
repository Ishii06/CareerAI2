import { useState } from "react";
import { generateResume } from "../api/resumeApi";

export default function ResumeBuilder() {
  const [step, setStep] = useState(0);
  const [template, setTemplate] = useState("classic");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    education: [{ degree: "", institution: "", year: "" }],
    skills: [""],
    experience: "" // free-form text
  });

  const handleChange = (field: string, value: any) =>
    setFormData({ ...formData, [field]: value });
  const handleNext = () => setStep(step + 1);
  const handlePrev = () => setStep(step - 1);

  const handleSubmit = async () => {
    const blob = await generateResume({ ...formData, template });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resume.pdf";
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex justify-center items-start py-12">
      <div className="w-full max-w-3xl bg-gray-900 p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-400">
          AI Resume Builder
        </h1>

        {/* Step 0: Personal Info */}
        {step === 0 && (
          <div className="space-y-6">
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700"
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700"
            />
            <input
              type="tel"
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700"
            />
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-cyan-600 rounded-lg mt-4"
            >
              Next
            </button>
          </div>
        )}

        {/* Step 1: Education */}
        {step === 1 && (
        <div className="space-y-6">
            <textarea
            placeholder="Write your education details freely. Example: 
            B.Tech in Computer Science at VIPS, 2025
            Dean's List 2023, Research paper on AI..."
            value={formData.education as unknown as string}
            onChange={(e) => handleChange("education", e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700"
            rows={6}
            />
            <div className="flex justify-between">
            <button
                onClick={handlePrev}
                className="px-6 py-2 bg-gray-600 rounded-lg"
            >
                Back
            </button>
            <button
                onClick={handleNext}
                className="px-6 py-2 bg-cyan-600 rounded-lg"
            >
                Next
            </button>
            </div>
        </div>
        )}


        {/* Step 2: Experience (free-form) */}
        {step === 2 && (
          <div className="space-y-6">
            <textarea
              placeholder="Write any experience: clubs, hackathons, volunteering, internships..."
              value={formData.experience}
              onChange={(e) => handleChange("experience", e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700"
              rows={6}
            />
            <div className="flex justify-between">
              <button onClick={handlePrev} className="px-6 py-2 bg-gray-600 rounded-lg">
                Back
              </button>
              <button onClick={handleNext} className="px-6 py-2 bg-cyan-600 rounded-lg">
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Skills & Template */}
        {step === 3 && (
          <div className="space-y-6">
            <input
              type="text"
              placeholder="Skills (comma separated)"
              value={formData.skills.join(", ")}
              onChange={(e) =>
                handleChange("skills", e.target.value.split(",").map(s => s.trim()))
              }
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700"
            />

            <div>
              <label className="block mb-2">Select Resume Template</label>
              <select
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700"
              >
                <option value="classic">Classic</option>
                <option value="modern">Modern</option>
                <option value="creative">Creative</option>
              </select>
            </div>

            <div className="flex justify-between">
              <button onClick={handlePrev} className="px-6 py-2 bg-gray-600 rounded-lg">
                Back
              </button>
              <button onClick={handleSubmit} className="px-6 py-2 bg-green-600 rounded-lg">
                Generate Resume
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
