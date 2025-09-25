import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import Particles from "react-tsparticles";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAuthStore } from "./store/useUserStore";

interface SkillProgress {
  name: string;
  completed: boolean;
  month: number;
}

export default function Dashboard() {
  const { user, isLoggedIn, fetchUser } = useAuthStore();
  const [progress, setProgress] = useState<SkillProgress[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (user?._id) {
      axios
        .get(`http://localhost:5000/api/progress/${user._id}`)
        .then((p) => setProgress(p.data.skills || []))
        .catch(() => setProgress([]));
    }
  }, [user]);

  // Default skills if none exist
  const defaultSkills = [
    { name: "React", completed: false, month: 1 },
    { name: "Node.js", completed: false, month: 2 },
    { name: "TypeScript", completed: false, month: 3 },
    { name: "MongoDB", completed: false, month: 4 },
    { name: "Express.js", completed: false, month: 5 },
    { name: "GraphQL", completed: false, month: 6 },
  ];

  const displaySkills = progress.length > 0 ? progress : defaultSkills;

  const toggleSkill = async (skillName: string, completed: boolean) => {
    if (!user?._id) return;
    try {
      const res = await axios.post(
        `http://localhost:5000/api/progress/${user._id}`,
        { skillName, completed }
      );
      setProgress(res.data.skills);
    } catch (err) {
      console.error("Error updating progress", err);
    }
  };

  const chartData = displaySkills.map((s) => ({
    skill: s.name,
    user: s.completed ? 1 : 0,
    required: 1,
  }));

  const renderCustomTick = ({ x, y, payload }: any) => {
    return (
      <text
        x={x}
        y={y}
        textAnchor="middle"
        fill="#d1d5db"
        fontSize="12"
        dy={5}
      >
        {payload.value.length > 12
          ? payload.value.substring(0, 12) + "…"
          : payload.value}
      </text>
    );
  };

  return (
    <div className="relative min-h-screen bg-gray-950 text-white overflow-hidden">
      {/* Animated background */}
      <Particles
        options={{
          background: { color: "#0f0f0f" },
          particles: {
            color: { value: ["#6366f1", "#ec4899", "#22d3ee"] },
            move: { enable: true, speed: 1.5 },
            number: { value: 60 },
            opacity: { value: 0.4 },
            size: { value: { min: 2, max: 5 } },
          },
        }}
        className="absolute inset-0 -z-10"
      />

      {/* Title */}
      <div className="text-center py-8 md:py-12">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent mb-3"
        >
          CareerAI Dashboard
        </motion.h1>
        <motion.p 
          className="text-base text-white/70 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Your Personalized skill tracking dashboard.
        </motion.p>
      </div>

      <div className="max-w-6xl mx-auto p-8 space-y-16">
        {!isLoggedIn ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center space-y-8"
          >
            <p className="text-xl text-gray-300">
              Welcome to <span className="font-semibold text-pink-400">CareerAI</span> 🚀
            </p>
            <p className="text-gray-400 max-w-xl mx-auto">
              Sign in to explore your personalized roadmap and track progress.
            </p>
            <div className="space-x-6">
              <button
                onClick={() => navigate("/login")}
                className="px-8 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 transition text-lg shadow-lg"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="px-8 py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-700 transition text-lg shadow-lg"
              >
                Register
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-12"
          >
            <h2 className="text-4xl font-semibold">
              Hi, <span className="text-pink-400">{user?.name || "User"}</span> 👋
            </h2>

            {/* Resume Builder Card - Moved up and highlighted */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-3xl blur-lg opacity-30 animate-pulse"></div>
              
              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                onClick={() => navigate("/resume-builder")}
                className="relative p-8 rounded-3xl bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-pink-500/30 cursor-pointer overflow-hidden group shadow-2xl"
              >
                {/* Background Animation */}
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                
                <div className="relative z-10 flex items-center justify-between">
                  {/* Left Content */}
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-white text-3xl">📄</span>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                          AI Resume Builder
                        </h3>
                        <div className="px-3 py-1 bg-pink-500/20 rounded-full border border-pink-400/30">
                          <span className="text-pink-300 text-xs font-bold">FEATURED</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-300 text-lg">
                        Create a professional, ATS-optimized resume in minutes with AI assistance
                      </p>
                    </div>
                  </div>
                  
                  {/* Right Action */}
                  <motion.div
                    className="flex items-center gap-3 text-pink-400 group-hover:text-pink-300 transition-colors"
                    whileHover={{ x: 8 }}
                  >
                    <span className="text-lg font-semibold">Build Now</span>
                    <motion.svg 
                      className="w-6 h-6"
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </motion.svg>
                  </motion.div>
                </div>
                
                {/* Quick Features */}
                <div className="grid grid-cols-4 gap-4 mt-6 relative z-10">
                  {[
                    { icon: "🎯", text: "ATS Ready" },
                    { icon: "⚡", text: "AI Powered" },
                    { icon: "📊", text: "Multiple Formats" },
                    { icon: "🔄", text: "Easy Updates" }
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex items-center gap-2 p-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10"
                    >
                      <span className="text-lg">{feature.icon}</span>
                      <span className="text-gray-300 text-sm font-medium">{feature.text}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Roadmap */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold">Your Learning Roadmap</h3>
                {progress.length === 0 && (
                  <span className="text-sm text-gray-500 px-3 py-1 rounded-full bg-gray-800 border border-gray-700">
                    Sample Skills - Click to interact
                  </span>
                )}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {displaySkills.map((skill) => (
                  <motion.div
                    key={skill.name}
                    whileHover={{ scale: 1.05 }}
                    className={`p-6 rounded-2xl shadow-lg cursor-pointer transition relative overflow-hidden
                      ${
                        skill.completed
                          ? "bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500"
                          : "bg-gray-900 ring-1 ring-gray-700"
                      }`}
                    onClick={() => toggleSkill(skill.name, !skill.completed)}
                  >
                    {skill.completed && (
                      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wavecut.png')] opacity-20 animate-pulse" />
                    )}
                    <h4
                      className={`text-xl font-medium relative z-10 ${
                        skill.completed
                          ? "bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
                          : "text-white"
                      }`}
                    >
                      {skill.name}
                    </h4>
                    <p className="text-gray-200 mt-2 relative z-10">Month {skill.month}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-6 rounded-2xl bg-gray-900/60 border border-gray-700/50"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">🎯</span>
                  <h3 className="text-lg font-semibold">Skills Progress</h3>
                </div>
                <div className="text-3xl font-bold text-cyan-400 mb-1">
                  {displaySkills.filter(s => s.completed).length}/{displaySkills.length}
                </div>
                <p className="text-gray-400 text-sm">Skills completed</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-6 rounded-2xl bg-gray-900/60 border border-gray-700/50"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">📈</span>
                  <h3 className="text-lg font-semibold">Completion Rate</h3>
                </div>
                <div className="text-3xl font-bold text-emerald-400 mb-1">
                  {displaySkills.length > 0 ? Math.round((displaySkills.filter(s => s.completed).length / displaySkills.length) * 100) : 0}%
                </div>
                <p className="text-gray-400 text-sm">Overall progress</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="p-6 rounded-2xl bg-gray-900/60 border border-gray-700/50"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">📅</span>
                  <h3 className="text-lg font-semibold">Learning Path</h3>
                </div>
                <div className="text-3xl font-bold text-purple-400 mb-1">
                  {displaySkills.length > 0 ? Math.max(...displaySkills.map(s => s.month)) : 0}
                </div>
                <p className="text-gray-400 text-sm">Months to complete</p>
              </motion.div>
            </div>

            {/* Radar Chart */}
            <div className="p-6 rounded-2xl bg-gray-900 shadow-lg">
              <h3 className="text-2xl font-semibold mb-6">Skill Analytics</h3>
              <div className="flex justify-center">
                <ResponsiveContainer width="100%" height={450}>
                  <RadarChart outerRadius="70%" data={chartData}>
                    <PolarGrid stroke="#374151" />
                    <PolarAngleAxis dataKey="skill" tick={renderCustomTick} />
                    <PolarRadiusAxis angle={30} domain={[0, 1]} tick={false} />
                    <Radar
                      name="You"
                      dataKey="user"
                      stroke="#22d3ee"
                      fill="#22d3ee"
                      fillOpacity={0.6}
                    />
                    <Radar
                      name="Target"
                      dataKey="required"
                      stroke="#a855f7"
                      fill="#a855f7"
                      fillOpacity={0.3}
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}