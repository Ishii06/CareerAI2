import { useMemo, useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { Brain, Zap, Target, Rocket, Globe, Code, RefreshCw, Copy, ArrowRight } from 'lucide-react';

type IconRenderer = (props: { className?: string }) => React.JSX.Element;

// Create a context or use localStorage to persist state
const STORAGE_KEY = 'career-analysis-data';

// Load data from localStorage
const loadFromStorage = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : { interest: '', skill: '', experience: '', result: '', showResult: false };
  } catch {
    return { interest: '', skill: '', experience: '', result: '', showResult: false };
  }
};

// Save data to localStorage
const saveToStorage = (data: any) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Handle localStorage errors silently
  }
};

// Smaller floating particles
function FloatingParticles() {
  const particles = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 4 + Math.random() * 3,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-violet-400/20 rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -15, 0],
            opacity: [0, 0.6, 0],
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

// Simple input without dropdown suggestions
function SimpleInput({
  label,
  value,
  onChange,
  icon: Icon,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (e: { target: { value: string } }) => void;
  icon: IconRenderer;
  placeholder?: string;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -1 }}
      transition={{ duration: 0.2 }}
    >
      <label className="block text-sm text-white/80 mb-2 flex items-center gap-2">
        <motion.div 
          className="size-6 rounded-lg bg-white/10 grid place-items-center backdrop-blur-sm border border-white/10"
          animate={{ 
            scale: isHovered || isFocused ? 1.1 : 1,
            backgroundColor: isHovered || isFocused ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.1)'
          }}
          transition={{ duration: 0.2 }}
        >
          <Icon className="w-3.5 h-3.5" />
        </motion.div>
        {label}
      </label>

      <motion.input
        type="text"
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className={`
          w-full px-4 py-3 rounded-xl text-white placeholder-white/50 
          bg-white/8 backdrop-blur-xl border border-white/15 
          focus:ring-2 focus:ring-violet-400/50 focus:border-violet-400/50 
          hover:bg-white/12 hover:border-white/20
          transition-all duration-200
          text-sm
        `}
        animate={{
          boxShadow: isFocused 
            ? '0 0 0 2px rgba(139,92,246,0.3), 0 4px 20px rgba(139,92,246,0.1)'
            : isHovered 
            ? '0 2px 15px rgba(0,0,0,0.1)' 
            : '0 2px 10px rgba(0,0,0,0.05)'
        }}
        transition={{ duration: 0.2 }}
      />

      {/* Smaller glow effect on hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-pink-500/10 rounded-xl blur-lg -z-10"
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Career() {
  // Initialize state from localStorage for persistence
  const [state, setState] = useState(() => loadFromStorage());
  const [loading, setLoading] = useState(false);

  const { interest, skill, experience, result, showResult } = state;

  // Update localStorage whenever state changes
  useEffect(() => {
    saveToStorage(state);
  }, [state]);

  // Helper function to update state
  const updateState = (updates: Partial<typeof state>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const progress = useMemo(
    () => Math.round(([interest, skill, experience].filter(Boolean).length / 3) * 100),
    [interest, skill, experience]
  );

  const isFormComplete = Boolean(interest && skill && experience);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isFormComplete) return;
    
    setLoading(true);
    updateState({ showResult: false });
    
    try {
      const res = await axios.post('http://localhost:5000/api/ai/career', {
        skills: [skill],
        experience,
        interests: [interest],
      });
      updateState({ 
        result: res.data?.advice || '',
        showResult: true 
      });
    } catch (err) {
      updateState({ 
        result: '⚠️ Failed to fetch career advice. Please try again.',
        showResult: true 
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Floating particles */}
      <FloatingParticles />
      
      {/* Simplified gradient background */}
      <div className="fixed inset-0 -z-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(139,92,246,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(236,72,153,0.06),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.06),transparent_70%)]" />
      </div>

      {/* Header */}
      <div className="text-center py-8 md:py-12">
        <motion.h1 
          className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent mb-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Career Analysis
        </motion.h1>
        
        <motion.p 
          className="text-base text-white/70 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          AI-powered career insights tailored to your unique profile and goals
        </motion.p>
      </div>

      {/* Split Layout Container */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-8">
        <div className="grid lg:grid-cols-2 gap-8 h-[calc(100vh-200px)]">
          
          {/* LEFT SIDE - Input Form */}
          <motion.section
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-b from-white/12 to-white/5 backdrop-blur-2xl border border-white/20 rounded-2xl p-6 shadow-xl ring-1 ring-white/10 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-violet-500/20 rounded-lg">
                  <Brain className="w-5 h-5 text-violet-400" />
                </div>
                <h2 className="text-xl font-semibold">Your Profile</h2>
              </div>
              
              {/* Progress indicator */}
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/20 px-3 py-1.5 rounded-full">
                <Target className="w-4 h-4 text-violet-300" />
                <span className="text-xs text-white/90">{progress}%</span>
                <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-violet-500 to-pink-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <SimpleInput
                label="Your Passion"
                value={interest}
                onChange={(e) => updateState({ interest: e.target.value })}
                icon={Globe}
                placeholder="What interests you? (e.g., Web Development, Data Science)"
              />
              
              <SimpleInput
                label="Core Skill"
                value={skill}
                onChange={(e) => updateState({ skill: e.target.value })}
                icon={Code}
                placeholder="Your main skill? (e.g., React, Python, Design)"
              />
              
              <SimpleInput
                label="Experience Level"
                value={experience}
                onChange={(e) => updateState({ experience: e.target.value })}
                icon={Rocket}
                placeholder="How much experience? (e.g., 2 years, Beginner)"
              />

              <div className="pt-4 space-y-3">
                <motion.button
                  type="submit"
                  disabled={loading || !isFormComplete}
                  whileHover={{ scale: isFormComplete ? 1.01 : 1, y: isFormComplete ? -1 : 0 }}
                  whileTap={{ scale: isFormComplete ? 0.99 : 1 }}
                  className={`
                    w-full relative overflow-hidden
                    ${isFormComplete 
                      ? 'bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 cursor-pointer' 
                      : 'bg-gray-600 cursor-not-allowed'
                    }
                    text-white font-semibold py-3 px-6 rounded-xl
                    shadow-lg hover:shadow-xl
                    disabled:opacity-50
                    flex items-center justify-center gap-2 text-sm
                    transition-all duration-200
                  `}
                >
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4" />
                      {isFormComplete ? 'Generate Career Analysis' : 'Fill All Fields to Continue'}
                      {isFormComplete && <ArrowRight className="w-4 h-4" />}
                    </>
                  )}
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => {
                    updateState({
                      interest: '',
                      skill: '',
                      experience: '',
                      result: '',
                      showResult: false
                    });
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 hover:bg-white/15 text-white/90 hover:text-white transition-all duration-200 backdrop-blur-xl text-sm"
                >
                  <div className="flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Clear All Fields
                  </div>
                </motion.button>
              </div>
            </form>

            {/* Data persistence indicator */}
            <div className="mt-4 text-xs text-white/50 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Your data is automatically saved
            </div>
          </motion.section>

          {/* RIGHT SIDE - AI Results */}
          <motion.section
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-gradient-to-b from-white/12 to-white/5 backdrop-blur-2xl border border-white/20 rounded-2xl p-6 shadow-xl ring-1 ring-white/10 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-pink-500/20 rounded-lg">
                  <Zap className="w-5 h-5 text-pink-400" />
                </div>
                <h2 className="text-xl font-semibold">AI Insights</h2>
              </div>
              
              {showResult && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigator.clipboard.writeText(result || '')}
                  className="px-3 py-1.5 rounded-lg border border-white/20 bg-white/10 hover:bg-white/15 transition-all duration-200 backdrop-blur-xl text-xs"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="flex items-center gap-1.5">
                    <Copy className="w-3 h-3" />
                    Copy
                  </div>
                </motion.button>
              )}
            </div>

            <div className="h-full">
              <AnimatePresence mode="wait">
                {loading ? (
                  /* Loading state */
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center h-full text-center"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-12 h-12 border-4 border-violet-400/20 border-t-violet-400 rounded-full mb-6"
                    />
                    <h3 className="text-lg font-semibold text-white/90 mb-2">Analyzing Your Profile</h3>
                    <p className="text-sm text-white/70 max-w-sm">
                      Our AI is processing your information to generate personalized career insights...
                    </p>
                    <div className="text-xs text-violet-400 mt-4 space-y-1">
                      <div>✓ Processing: {interest}</div>
                      <div>✓ Analyzing: {skill}</div>
                      <div>✓ Evaluating: {experience}</div>
                    </div>
                  </motion.div>
                ) : showResult ? (
                  /* Results display */
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-4"
                  >
                    
                    {(result || '')
                      .split('\n')
                      .filter((line: string) => line.trim() !== '')
                      .map((line: string, idx: number) => {
                        const delay = idx * 0.03;
                        
                        if (line.toLowerCase().includes('career path')) {
                          return (
                            <motion.h3
                              key={idx}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay }}
                              className="text-lg font-bold text-violet-300 mt-4 mb-2 flex items-center gap-2"
                            >
                              <div className="p-1 rounded bg-violet-500/20">
                                <Rocket className="w-3 h-3" />
                              </div>
                              {line}
                            </motion.h3>
                          );
                        } else if (
                          line.toLowerCase().includes('job roles') ||
                          line.toLowerCase().includes('skills') ||
                          line.toLowerCase().includes('roadmap')
                        ) {
                          return (
                            <motion.h4
                              key={idx}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay }}
                              className="text-base font-semibold text-blue-300 mt-3 mb-2 flex items-center gap-2"
                            >
                              <div className="p-0.5 rounded bg-blue-500/20">
                                <Target className="w-3 h-3" />
                              </div>
                              {line}
                            </motion.h4>
                          );
                        } else if (line.startsWith('-') || line.startsWith('•')) {
                          return (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay }}
                              className="flex items-start gap-2 my-2 pl-2 p-2 rounded-lg bg-white/5 hover:bg-white/8 transition-colors"
                            >
                              <div className="w-1 h-1 bg-gradient-to-r from-pink-400 to-violet-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-white/90 leading-relaxed text-sm">{line.replace(/^[-•]\s*/, '')}</span>
                            </motion.div>
                          );
                        } else {
                          return (
                            <motion.p
                              key={idx}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay }}
                              className="text-white/85 leading-relaxed my-2 text-sm"
                            >
                              {line}
                            </motion.p>
                          );
                        }
                      })}
                  </motion.div>
                ) : (
                  /* Initial empty state */
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center h-full text-center"
                  >
                    <div className="mb-6">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-violet-500/20 to-pink-500/20 flex items-center justify-center mb-4">
                        <Brain className="w-8 h-8 text-violet-400" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-white/90 mb-2">Awaiting Your Profile</h3>
                    <p className="text-sm text-white/70 max-w-sm">
                      Complete all three fields on the left and click "Generate Career Analysis" to receive your personalized insights.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}