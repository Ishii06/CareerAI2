import { useState, ChangeEvent, FormEvent } from "react";
import { generateResume } from "../api/resumeApi";
import type { ResumeData } from "../api/resumeApi";

export default function ResumeBuilder() {
  const [formData, setFormData] = useState<ResumeData>({
  name: "",
  email: "",
  phone: "",
  education: [{ degree: "", institution: "", year: "" }],
  skills: [""],
  experience: [{ role: "", company: "", years: "", details: "" }],
});

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const blob = await generateResume(formData);

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
          Resume Builder
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-pink-400">Personal Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>
          </section>

          {/* Education */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-pink-400">Education</h2>
            <textarea
              name="education"
              placeholder="E.g., B.Tech CSE - VIPS, 2025"
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-cyan-500"
            />
          </section>

          {/* Skills */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-pink-400">Skills</h2>
            <input
              type="text"
              name="skills"
              placeholder="E.g., React, Node.js, MongoDB"
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-cyan-500"
            />
          </section>

          {/* Experience */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-pink-400">Experience</h2>
            <textarea
              name="experience"
              placeholder="E.g., Software Intern @ ABC Corp (2024-2025) - Worked on..."
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-cyan-500"
            />
          </section>

          {/* Submit */}
          <div className="text-center">
            <button
              type="submit"
              className="px-8 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 transition text-lg shadow-lg"
            >
              Download Resume
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
