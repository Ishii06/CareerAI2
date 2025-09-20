import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  BookOpen, 
  Target,
  PlayCircle,
  ExternalLink,
  TrendingUp,
  Clock,
  CheckCircle,
  Lightbulb
} from "lucide-react";
import { useSkillsStore } from "./store/useSkillsStore.ts";

// Floating particles background
function FloatingParticles() {
  const particles = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 3 + Math.random() * 2,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-violet-400/30 rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function Skills({ userId: propUserId }: { userId?: string }) {
  const {
    career,
    suggestedSkills,
    roadmap,
    videos,
    setCareer,
    setSuggestedSkills,
    setRoadmap,
    setVideos,
    reset,
  } = useSkillsStore();

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<{ id: string; name: string } | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Fetch current user if userId not passed as prop
  useEffect(() => {
    if (!propUserId) {
      axios
        .get("http://localhost:5000/api/auth/profile", { withCredentials: true })
        .then((res) => setUser(res.data.user))
        .catch(() => setUser(null));
    }
  }, [propUserId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setHasSearched(true);

    try {
      // 1️⃣ Get skills & roadmap from backend
      const res = await axios.post(
        "http://localhost:5000/api/ai/skills",
        { career },
        { withCredentials: true }
      );

      const skills = res.data.suggestedSkills || [];
      const roadmapData = res.data.roadmap || [];

      setSuggestedSkills(skills);
      setRoadmap(roadmapData);

      // 2️⃣ Fetch YouTube videos for each skill
      const videosMap: Record<string, any[]> = {};

      await Promise.all(
        skills.map(async (skill) => {
          try {
            const videoRes = await axios.get(
              `http://localhost:5000/api/courses/youtube/${encodeURIComponent(
                skill
              )}`,
              { withCredentials: true }
            );
            videosMap[skill] = videoRes.data.courses || [];
          } catch (err: any) {
            console.error(`Failed to fetch videos for ${skill}:`, err.message);
            videosMap[skill] = [];
          }
        })
      );

      setVideos(videosMap);
    } catch (err) {
      console.error(err);
      reset();
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e as any);
    }
  };

  const suggestedCareers = [
    "Data Scientist", 
    "Product Manager", 
    "Software Engineer", 
    "UX Designer", 
    "DevOps Engineer", 
    "Machine Learning Engineer"
  ];

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Floating particles */}
      <FloatingParticles />
      
      {/* Enhanced background */}
      <div className="fixed inset-0 -z-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(139,92,246,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(236,72,153,0.06),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.06),transparent_70%)]" />
      </div>

      {/* Header */}
      <div className="text-center py-8 md:py-12">
        <motion.h1 
          className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-violet-200 to-pink-200 bg-clip-text text-transparent mb-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Skill Development Hub
        </motion.h1>
        
        <motion.p 
          className="text-base text-white/70 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Get personalized skill roadmaps and curated learning resources for your career
        </motion.p>
      </div>

      <div className="max-w-6xl mx-auto px-5 md:px-8 pb-20">
        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="bg-gradient-to-b from-white/12 to-white/5 backdrop-blur-2xl border border-white/20 rounded-2xl p-6 shadow-xl ring-1 ring-white/10 mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-violet-500/20 rounded-lg">
              <BookOpen className="w-5 h-5 text-violet-400" />
            </div>
            <h2 className="text-xl font-semibold">Generate Skill Roadmap</h2>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 w-5 h-5" />
            <input
              type="text"
              value={career}
              onChange={(e) => setCareer(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your target career (e.g., Data Scientist, Product Manager)..."
              className="w-full pl-12 pr-24 py-3 rounded-xl text-white placeholder-white/50 bg-white/8 backdrop-blur-xl border border-white/15 focus:ring-2 focus:ring-violet-400/50 focus:border-violet-400/50 hover:bg-white/12 hover:border-white/20 transition-all duration-200 text-sm"
            />
            <motion.button
              onClick={handleSubmit}
              disabled={!career.trim() || loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition text-sm font-semibold"
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                "Generate"
              )}
            </motion.button>
          </div>

          {/* Suggested Careers */}
          <div>
            <div className="text-sm text-white/60 mb-3 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Quick career suggestions:
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestedCareers.map((careerOption) => (
                <motion.button
                  key={careerOption}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setCareer(careerOption);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/30 transition-all text-sm flex items-center gap-1.5"
                >
                  <Target className="w-4 h-4 text-violet-400" />
                  {careerOption}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Results Section */}
        <AnimatePresence mode="wait">
          {loading ? (
            /* Loading State */
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-gradient-to-b from-white/12 to-white/5 backdrop-blur-2xl border border-white/20 rounded-2xl p-12 text-center shadow-xl ring-1 ring-white/10"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-violet-400/20 border-t-violet-400 rounded-full mb-6 mx-auto"
              />
              <h3 className="text-xl font-semibold text-white/90 mb-2">Generating Roadmap</h3>
              <p className="text-white/70">
                Creating personalized skill development plan for "<span className="text-violet-400">{career}</span>"...
              </p>
            </motion.div>
          ) : hasSearched && suggestedSkills.length > 0 ? (
            /* Results */
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {/* Suggested Skills */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-gradient-to-b from-white/12 to-white/5 backdrop-blur-2xl border border-white/20 rounded-2xl p-6 shadow-xl ring-1 ring-white/10"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-cyan-500/20 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-cyan-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-cyan-400">Essential Skills</h3>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {suggestedSkills.map((skill, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 hover:bg-white/15 hover:border-cyan-400/30 transition-all duration-300 flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                      <span className="text-white/90 font-medium">{skill}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Roadmap */}
              {roadmap.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="bg-gradient-to-b from-white/12 to-white/5 backdrop-blur-2xl border border-white/20 rounded-2xl p-6 shadow-xl ring-1 ring-white/10"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-pink-500/20 rounded-lg">
                      <Clock className="w-5 h-5 text-pink-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-pink-400">6-Month Learning Path</h3>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {roadmap.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.4 }}
                        className={`p-4 rounded-xl border transition-all duration-300 ${
                          item.completed 
                            ? 'bg-green-500/10 border-green-400/30 hover:bg-green-500/15' 
                            : 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-pink-400/30'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                            item.completed ? 'bg-green-500 text-white' : 'bg-pink-500/20 text-pink-400'
                          }`}>
                            {item.completed ? '✓' : item.month}
                          </div>
                          <span className="text-white/80 font-medium">Month {item.month}</span>
                        </div>
                        <h4 className="text-white font-semibold mb-1">{item.name}</h4>
                        {item.completed && (
                          <span className="text-green-400 text-sm">✅ Completed</span>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* YouTube Videos */}
              {Object.keys(videos).length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="bg-gradient-to-b from-white/12 to-white/5 backdrop-blur-2xl border border-white/20 rounded-2xl p-6 shadow-xl ring-1 ring-white/10"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-red-500/20 rounded-lg">
                      <PlayCircle className="w-5 h-5 text-red-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-red-400">Learning Resources</h3>
                  </div>
                  
                  <div className="space-y-8">
                    {Object.entries(videos).map(([skill, skillVideos]) => (
                      <div key={skill}>
                        <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                          <Target className="w-5 h-5 text-violet-400" />
                          {skill}
                        </h4>
                        <div className="grid md:grid-cols-2 gap-4">
                          {skillVideos.map((video, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.1, duration: 0.3 }}
                              whileHover={{ y: -4, scale: 1.02 }}
                              className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
                            >
                              <div className="flex gap-4">
                                <div className="relative flex-shrink-0">
                                  <img
                                    src={video.thumbnail}
                                    alt={video.title}
                                    className="w-24 h-16 rounded-lg object-cover"
                                  />
                                  <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <PlayCircle className="w-6 h-6 text-white" />
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <a
                                    href={video.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block font-semibold text-white hover:text-red-400 transition-colors duration-300 mb-2 line-clamp-2"
                                  >
                                    {video.title}
                                  </a>
                                  <p className="text-white/60 text-sm line-clamp-2 mb-2">
                                    {video.description}
                                  </p>
                                  <div className="flex items-center justify-between">
                                    <span className="text-white/40 text-xs">YouTube</span>
                                    <motion.a
                                      href={video.link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      className="p-1 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors duration-300"
                                    >
                                      <ExternalLink className="w-4 h-4 text-red-400" />
                                    </motion.a>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          ) : hasSearched && suggestedSkills.length === 0 ? (
            /* No Results */
            <motion.div
              key="no-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-gradient-to-b from-white/12 to-white/5 backdrop-blur-2xl border border-white/20 rounded-2xl p-12 text-center shadow-xl ring-1 ring-white/10"
            >
              <div className="text-6xl mb-6">🤔</div>
              <h3 className="text-xl font-semibold text-white/90 mb-2">No Results Found</h3>
              <p className="text-white/70 mb-6">
                Couldn't generate a roadmap for "<span className="text-violet-400">{career}</span>". Try a more specific career title.
              </p>
              <div className="text-sm text-white/60">
                Popular careers: <span className="text-pink-400">Data Scientist</span>, <span className="text-cyan-400">Product Manager</span>, <span className="text-green-400">Software Engineer</span>
              </div>
            </motion.div>
          ) : (
            /* Initial State */
            <motion.div
              key="initial"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-gradient-to-b from-white/12 to-white/5 backdrop-blur-2xl border border-white/20 rounded-2xl p-12 text-center shadow-xl ring-1 ring-white/10"
            >
              <div className="text-6xl mb-6">📚</div>
              <h3 className="text-xl font-semibold text-white/90 mb-2">Ready to Build Your Skills?</h3>
              <p className="text-white/70 mb-6">
                Enter your target career above to get a personalized learning roadmap and curated resources
              </p>
              <div className="flex items-center justify-center gap-4 text-sm text-white/60">
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  Personalized roadmaps
                </div>
                <div className="flex items-center gap-1">
                  <PlayCircle className="w-4 h-4" />
                  Curated videos
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  Skills tracking
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Skills;