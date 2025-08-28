import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { useAuthStore } from "./store/useUserStore"; // adjust path if needed

function Home() {
  const { isLoggedIn } = useAuthStore();

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      {/* 🌊 Fullscreen Animated Wave Background */}
      <div className="absolute inset-0 -z-10">
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 800"
          preserveAspectRatio="none"
        >
          <path
            fill="#1e0b44"
            d="M0,320 C480,480 960,160 1440,320 L1440,800 L0,800Z"
          >
            <animate
              attributeName="d"
              dur="12s"
              repeatCount="indefinite"
              values="
                M0,320 C480,480 960,160 1440,320 L1440,800 L0,800Z;
                M0,280 C480,200 960,500 1440,280 L1440,800 L0,800Z;
                M0,320 C480,480 960,160 1440,320 L1440,800 L0,800Z
              "
            />
          </path>

          <path
            fill="#6a0dad"
            fillOpacity="0.6"
            d="M0,360 C480,520 960,200 1440,360 L1440,800 L0,800Z"
          >
            <animate
              attributeName="d"
              dur="10s"
              repeatCount="indefinite"
              values="
                M0,360 C480,520 960,200 1440,360 L1440,800 L0,800Z;
                M0,300 C480,240 960,460 1440,300 L1440,800 L0,800Z;
                M0,360 C480,520 960,200 1440,360 L1440,800 L0,800Z
              "
            />
          </path>

          <path
            fill="#000000"
            fillOpacity="1"
            d="M0,400 C480,560 960,240 1440,400 L1440,800 L0,800Z"
          >
            <animate
              attributeName="d"
              dur="14s"
              repeatCount="indefinite"
              values="
                M0,400 C480,560 960,240 1440,400 L1440,800 L0,800Z;
                M0,340 C480,280 960,500 1440,340 L1440,800 L0,800Z;
                M0,400 C480,560 960,240 1440,400 L1440,800 L0,800Z
              "
            />
          </path>
        </svg>
      </div>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 pt-32 pb-20 relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-fuchsia-500 bg-clip-text text-transparent"
        >
          Welcome to CareerAI
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mt-6 text-lg md:text-xl text-white/70 max-w-3xl"
        >
          CareerAI is your personalized career companion. Track your skills,
          identify gaps, discover career paths, and find internships tailored
          just for you.
        </motion.p>

        <div className="mt-8 flex gap-4">
          {isLoggedIn ? (
            <NavLink
              to="/dashboard"
              className="px-6 py-3 rounded-xl text-lg font-semibold border border-white/20 hover:bg-white/10 shadow-lg transition"
            >
              Go to Dashboard
            </NavLink>
          ) : (
            <>
              <NavLink
                to="/register"
                className="px-6 py-3 rounded-xl text-lg font-semibold bg-gradient-to-r from-cyan-500 to-fuchsia-500 hover:opacity-90 shadow-lg transition"
              >
                Get Started
              </NavLink>
              <NavLink
                to="/login"
                className="px-6 py-3 rounded-xl text-lg font-semibold border border-white/20 hover:bg-white/10 transition"
              >
                Login
              </NavLink>
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20  mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-10 relative z-10 "> 
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="p-6 rounded-2xl bg-white/5 shadow-lg"
        >
          <h3 className="text-2xl font-bold mb-3 text-cyan-400">
            Skill Tracking
          </h3>
          <p className="text-white/70">
            Track your skills and identify gaps to improve your learning journey
            and career growth.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="p-6 rounded-2xl bg-white/5 shadow-lg"
        >
          <h3 className="text-2xl font-bold mb-3 text-fuchsia-400">
            Career Recommendations
          </h3>
          <p className="text-white/70">
            Get AI-powered career recommendations based on your skills,
            interests, and experience.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="p-6 rounded-2xl bg-white/5 shadow-lg"
        >
          <h3 className="text-2xl font-bold mb-3 text-purple-400">
            Skill Roadmaps
          </h3>
          <p className="text-white/70">
            Enter your desired career path and receive a roadmap with courses
            and learning materials.
          </p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} className="p-6 rounded-2xl bg-white/5 shadow-lg">
          <h3 className="text-2xl font-bold mb-3 text-indigo-500">Internships</h3>
          <p className="text-white/70">
            Discover internships tailored to your skill set and career interests
            to gain real-world experience.
          </p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-white/50 border-t border-white/10 relative z-10">
        © {new Date().getFullYear()} CareerAI. All rights reserved.
      </footer>
    </div>
  );
}

export default Home;
