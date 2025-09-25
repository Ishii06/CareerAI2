import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { generateResume } from "../api/resumeApi";

export default function ResumeBuilder() {
  const [step, setStep] = useState(0);
  const [template, setTemplate] = useState("classic");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    education: "",
    skills: [""],
    experience: ""
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const handleChange = (field: string, value: any) =>
    setFormData({ ...formData, [field]: value });

  const handleNext = () => setStep(step + 1);
  const handlePrev = () => setStep(step - 1);

  const handleSubmit = async () => {
    setIsGenerating(true);
    try {
      const blob = await generateResume({ ...formData, template });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${formData.name.replace(/\s+/g, '_')}_Resume.pdf`;
      a.click();
    } catch (error) {
      console.error("Error generating resume:", error);
      alert("Failed to generate resume. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const stepTitles = [
    "Personal Details",
    "Education Background", 
    "Experience & Projects",
    "Skills & Template"
  ];

  const stepIcons = ["👤", "🎓", "💼", "⚡"];

  return (
    <div className="min-h-screen bg-gray-950 text-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
            AI Resume Builder
          </h1>
          <p className="text-gray-400">Create a professional resume tailored for Indian job market</p>
        </motion.div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {stepTitles.map((title, index) => (
              <div key={index} className={`flex flex-col items-center ${
                index <= step ? 'text-cyan-400' : 'text-gray-500'
              }`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 mb-2 transition-all ${
                  index <= step 
                    ? 'bg-cyan-500/20 border-cyan-400' 
                    : 'bg-gray-800 border-gray-600'
                }`}>
                  {stepIcons[index]}
                </div>
                <span className="text-xs font-medium hidden md:block">{title}</span>
              </div>
            ))}
          </div>
          
          <div className="w-full bg-gray-800 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${(step / 3) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Main Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-900/70 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 shadow-2xl"
        >
          <AnimatePresence mode="wait">
            {/* Step 0: Personal Info */}
            {step === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Personal Details</h2>
                  <p className="text-gray-400">Enter your basic information</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Full Name *</label>
                    <input
                      type="text"
                      placeholder="Enter your full name (e.g., Rahul Kumar Sharma)"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-600/50 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all outline-none text-white placeholder-gray-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email Address *</label>
                    <input
                      type="email"
                      placeholder="Enter your professional email (e.g., rahul.sharma@gmail.com)"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-600/50 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all outline-none text-white placeholder-gray-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="Enter your phone number (e.g., +91 9876543210)"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-600/50 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all outline-none text-white placeholder-gray-400"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleNext}
                    disabled={!formData.name || !formData.email}
                    className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:shadow-cyan-500/25"
                  >
                    Next Step →
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Step 1: Education */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Education Background</h2>
                  <p className="text-gray-400">Share your educational qualifications</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Education Details</label>
                  <textarea
                    placeholder={`Enter your education details. Example:

B.Tech in Computer Science Engineering
Vivekananda Institute of Professional Studies, Delhi
2021-2025 | CGPA: 8.2/10

Higher Secondary (12th) - CBSE
Delhi Public School, Delhi
2020-2021 | Percentage: 92%

Achievements:
• Dean's List for Academic Excellence (2023)
• Published research paper on Machine Learning in IJCAI
• Winner of Inter-college Coding Competition`}
                    value={formData.education}
                    onChange={(e) => handleChange("education", e.target.value)}
                    className="w-full px-4 py-4 rounded-xl bg-gray-800/50 border border-gray-600/50 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all outline-none text-white placeholder-gray-400 resize-none"
                    rows={10}
                  />
                  <p className="text-xs text-gray-500 mt-2">💡 Include degree, institution, year, CGPA/percentage, and achievements</p>
                </div>

                <div className="flex justify-between pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePrev}
                    className="px-8 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-semibold transition-all"
                  >
                    ← Back
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleNext}
                    className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-cyan-500/25"
                  >
                    Next Step →
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Experience */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Experience & Projects</h2>
                  <p className="text-gray-400">Describe your work experience, internships, and projects</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Experience Details</label>
                  <textarea
                    placeholder={`Enter your experience and projects. Example:

Software Development Intern | Wipro Technologies | June 2024 - August 2024
• Developed REST APIs using Spring Boot and MySQL
• Improved application performance by 25% through code optimization
• Collaborated with senior developers using Agile methodology

PROJECTS:

E-Commerce Website | Personal Project | March 2024
• Built full-stack web application using MERN stack
• Implemented payment gateway integration with Razorpay
• Deployed on AWS with 99% uptime
• GitHub: github.com/username/ecommerce-app

Food Delivery App | Team Project | December 2023
• Led team of 4 developers in building mobile app using React Native
• Integrated real-time tracking and push notifications
• Won 1st prize in college hackathon

LEADERSHIP & ACTIVITIES:

President | Computer Science Society | 2023-2024
• Organized technical workshops for 200+ students
• Managed budget of ₹50,000 for society events`}
                    value={formData.experience}
                    onChange={(e) => handleChange("experience", e.target.value)}
                    className="w-full px-4 py-4 rounded-xl bg-gray-800/50 border border-gray-600/50 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all outline-none text-white placeholder-gray-400 resize-none"
                    rows={12}
                  />
                  <p className="text-xs text-gray-500 mt-2">💡 Include internships, projects, hackathons, leadership roles, and quantifiable achievements</p>
                </div>

                <div className="flex justify-between pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePrev}
                    className="px-8 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-semibold transition-all"
                  >
                    ← Back
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleNext}
                    className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-cyan-500/25"
                  >
                    Next Step →
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Skills & Template */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Skills & Template</h2>
                  <p className="text-gray-400">Add your skills and choose a template</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Technical & Soft Skills</label>
                  <input
                    type="text"
                    placeholder="Enter your key skills (e.g., Java, React, Node.js, MongoDB, Python, Machine Learning, Leadership, Communication, Problem Solving)"
                    value={formData.skills.join(", ")}
                    onChange={(e) =>
                handleChange("skills", e.target.value.split(",").map(s => s.trim()))
              
                    }
                    className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-600/50 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all outline-none text-white placeholder-gray-400"
                  />
                  <p className="text-xs text-gray-500 mt-2">💡 Separate with commas. Include programming languages, frameworks, tools, and soft skills</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-4">Choose Resume Template</label>
                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      { value: "classic", name: "Classic", desc: "Simple & Professional", color: "from-blue-500 to-blue-600" },
                      { value: "modern", name: "Modern", desc: "Stylish & Minimal", color: "from-purple-500 to-purple-600" },
                      { value: "creative", name: "Creative", desc: "Unique & Visual", color: "from-pink-500 to-pink-600" }
                    ].map((temp) => (
                      <motion.div
                        key={temp.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setTemplate(temp.value)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          template === temp.value
                            ? 'border-cyan-400 bg-cyan-400/10'
                            : 'border-gray-600 hover:border-gray-500'
                        }`}
                      >
                        <div className={`w-full h-16 rounded-lg bg-gradient-to-r ${temp.color} mb-3 flex items-center justify-center text-white font-bold text-sm`}>
                          {temp.name}
                        </div>
                        <h3 className="font-semibold text-white mb-1">{temp.name}</h3>
                        <p className="text-gray-400 text-xs">{temp.desc}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePrev}
                    className="px-8 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-semibold transition-all"
                  >
                    ← Back
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    disabled={isGenerating}
                    className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Generating PDF...
                      </>
                    ) : (
                      <>
                        🎉 Generate Resume
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-6"
        >
          <p className="text-gray-500 text-sm">
            💡 Your resume will be ATS-optimized and formatted for Indian job market
          </p>
        </motion.div>
      </div>
    </div>
  );
}