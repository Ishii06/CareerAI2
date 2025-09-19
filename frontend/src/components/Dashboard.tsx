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

  const chartData = progress.map((s) => ({
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
      <div className="flex justify-center items-center py-16">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-6xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg"
        >
          CareerAI Dashboard
        </motion.h1>
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
              Hi, <span className="text-pink-400">{user?.name}</span> 👋
            </h2>

            {/* Roadmap */}
            <div>
              <h3 className="text-2xl font-semibold mb-6">Your Roadmap</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {progress.map((skill) => (
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
                          ? "bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent truncate"
                          : "text-white"
                      }`}
                    >
                      {skill.name}
                    </h4>
                    <p className="text-gray-200 mt-2 relative z-10">Month {skill.month}</p>
                  </motion.div>
                ))}

                {/* 🚀 Build Resume Card */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  onClick={() => navigate("/resume-builder")}
                  className="p-6 rounded-2xl shadow-lg cursor-pointer bg-gray-900 ring-1 ring-gray-700 hover:bg-gray-800 transition relative overflow-hidden"
                >
                  <h4 className="text-xl font-medium text-white">📄 Build Your Resume</h4>
                  <p className="text-gray-400 mt-2">Quickly generate a professional resume.</p>
                </motion.div>
              </div>
            </div>

            {/* Radar Chart */}
            {progress.length > 0 && (
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
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
