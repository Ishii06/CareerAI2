import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  MapPin, 
  Building2, 
  ExternalLink, 
  Code, 
  Database, 
  Zap,
  Target,
  Clock,
  Filter
} from "lucide-react";

interface InternshipType {
  title: string;
  company: string;
  location: string;
  skills: string[];
  link: string;
}

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

function Internship() {
  const [skillFilter, setSkillFilter] = useState<string>("");
  const [internships, setInternships] = useState<InternshipType[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchInternships = async (skill: string) => {
    if (!skill.trim()) return;
    setLoading(true);
    setHasSearched(true);
    
    try {
      const response = await fetch(`http://localhost:5000/api/internships?skill=${encodeURIComponent(skill)}`);
      const data = await response.json();
      
      // Map backend data to include skills array if needed
      const mappedInternships: InternshipType[] = data.internships.map((i: any) => ({
        title: i.title,
        company: i.company,
        location: i.location,
        link: i.link,
        skills: skill ? [skill] : [] // just display the searched skill for now
      }));

      setInternships(mappedInternships);
    } catch (err) {
      console.error("Error fetching internships:", err);
      setInternships([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchInternships(skillFilter);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const skillIcon = (skill: string) => {
    switch (skill.toLowerCase()) {
      case "react":
      case "javascript":
        return <Code className="w-4 h-4 text-cyan-400" />;
      case "nodejs":
      case "node":
        return <Zap className="w-4 h-4 text-green-400" />;
      case "python":
        return <Code className="w-4 h-4 text-yellow-400" />;
      case "database":
      case "sql":
        return <Database className="w-4 h-4 text-blue-400" />;
      default: 
        return <Target className="w-4 h-4 text-violet-400" />;
    }
  };

  const suggestedSkills = ["Python", "React", "NodeJS", "JavaScript", "Database", "Machine Learning", "Data Science"];

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
          Internship Finder
        </motion.h1>
        
        <motion.p 
          className="text-base text-white/70 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Discover internships tailored to your skills and career interests
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
              <Search className="w-5 h-5 text-violet-400" />
            </div>
            <h2 className="text-xl font-semibold">Search Internships</h2>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 w-5 h-5" />
            <input
              type="text"
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter a skill (e.g., React, Python, Data Science)..."
              className="w-full pl-12 pr-24 py-3 rounded-xl text-white placeholder-white/50 bg-white/8 backdrop-blur-xl border border-white/15 focus:ring-2 focus:ring-violet-400/50 focus:border-violet-400/50 hover:bg-white/12 hover:border-white/20 transition-all duration-200 text-sm"
            />
            <motion.button
              onClick={handleSearch}
              disabled={!skillFilter.trim() || loading}
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
                "Search"
              )}
            </motion.button>
          </div>

          {/* Suggested Skills */}
          <div>
            <div className="text-sm text-white/60 mb-3 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Quick search suggestions:
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestedSkills.map((skill) => (
                <motion.button
                  key={skill}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSkillFilter(skill);
                    fetchInternships(skill);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/30 transition-all text-sm flex items-center gap-1.5"
                >
                  {skillIcon(skill)}
                  {skill}
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
              <h3 className="text-xl font-semibold text-white/90 mb-2">Searching Internships</h3>
              <p className="text-white/70">
                Finding opportunities matching "<span className="text-violet-400">{skillFilter}</span>"...
              </p>
            </motion.div>
          ) : hasSearched && internships.length > 0 ? (
            /* Results Grid */
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Target className="w-6 h-6 text-violet-400" />
                  Found {internships.length} opportunities for "{skillFilter}"
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {internships.map((internship, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    whileHover={{ y: -4, scale: 1.02 }}
                    className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-2xl border border-white/20 rounded-2xl p-6 shadow-xl ring-1 ring-white/10 group overflow-hidden relative"
                  >
                    {/* Hover glow effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-violet-500/10 via-pink-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      animate={{
                        x: ['-100%', '100%'],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    />

                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-4">
                        <h4 className="text-lg font-semibold text-white leading-tight pr-2">
                          {internship.title}
                        </h4>
                        <motion.a
                          href={internship.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                        >
                          <ExternalLink className="w-4 h-4 text-violet-400" />
                        </motion.a>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center gap-2 text-white/80">
                          <Building2 className="w-4 h-4 text-blue-400" />
                          <span className="text-sm">{internship.company}</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/80">
                          <MapPin className="w-4 h-4 text-green-400" />
                          <span className="text-sm">{internship.location}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {internship.skills.map((skill, skillIndex) => (
                          <motion.span
                            key={skillIndex}
                            whileHover={{ scale: 1.1 }}
                            className="px-3 py-1 rounded-full bg-gradient-to-r from-violet-500/20 to-pink-500/20 border border-violet-400/30 text-violet-200 text-xs font-medium flex items-center gap-1"
                          >
                            {skillIcon(skill)}
                            {skill}
                          </motion.span>
                        ))}
                      </div>

                      {/* Apply button */}
                      <motion.a
                        href={internship.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="mt-4 w-full block text-center px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 rounded-lg transition text-sm font-semibold"
                      >
                        Apply Now
                      </motion.a>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : hasSearched && internships.length === 0 ? (
            /* No Results */
            <motion.div
              key="no-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-gradient-to-b from-white/12 to-white/5 backdrop-blur-2xl border border-white/20 rounded-2xl p-12 text-center shadow-xl ring-1 ring-white/10"
            >
              <div className="text-6xl mb-6">🔍</div>
              <h3 className="text-xl font-semibold text-white/90 mb-2">No Matches Found</h3>
              <p className="text-white/70 mb-6">
                No internships found for "<span className="text-violet-400">{skillFilter}</span>". Try a different skill or check back later.
              </p>
              <div className="text-sm text-white/60">
                Popular searches: <span className="text-pink-400">Python</span>, <span className="text-cyan-400">React</span>, <span className="text-green-400">NodeJS</span>
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
              <div className="text-6xl mb-6">🎯</div>
              <h3 className="text-xl font-semibold text-white/90 mb-2">Ready to Find Your Internship?</h3>
              <p className="text-white/70 mb-6">
                Enter a skill above to discover internship opportunities that match your expertise
              </p>
              <div className="flex items-center justify-center gap-4 text-sm text-white/60">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Real-time results
                </div>
                <div className="flex items-center gap-1">
                  <Target className="w-4 h-4" />
                  Skill-matched
                </div>
                <div className="flex items-center gap-1">
                  <ExternalLink className="w-4 h-4" />
                  Direct apply links
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Internship;