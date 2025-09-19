import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, LogOut, Brain } from "lucide-react";
import { useAuthStore } from "./store/useUserStore.ts";
import axios from "axios";

function Navbar() {
  const { user, isLoggedIn, logout, fetchUser } = useAuthStore();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Fetch user on mount (persisted login)
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Logout handler
  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        { withCredentials: true }
      );
      logout(); // update Zustand store
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  // Scroll shadow
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/career", label: "Career" },
    { to: "/skills", label: "Skills" },
    { to: "/internships", label: "Internships" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "backdrop-blur-2xl bg-black/60 shadow-[0_8px_32px_rgba(0,0,0,0.4)] border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <NavLink
            to="/"
            className="relative text-2xl font-extrabold tracking-wide bg-gradient-to-r from-white via-violet-200 to-pink-200 bg-clip-text text-transparent flex items-center gap-2"
          >
            <Brain className="w-7 h-7 text-violet-400" />
            CareerAI
          </NavLink>
        </motion.div>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-2 text-sm items-center">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `px-4 py-2 rounded-xl transition-all duration-300 relative overflow-hidden group ${
                  isActive
                    ? "text-white bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg"
                    : "text-white/80 hover:text-white hover:bg-white/5"
                }`
              }
            >
              <span className="relative z-10">{label}</span>
              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
            </NavLink>
          ))}

          {/* User Section */}
          <div className="ml-4 flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <div className="flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl">
                  <User className="w-4 h-4 text-violet-400" />
                  <span className="text-white/90 text-sm">Hi, {user?.name}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-white/90 bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 hover:border-red-500/50 transition-all duration-200 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </motion.button>
              </>
            ) : (
              <>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <NavLink
                    to="/login"
                    className="px-4 py-2 rounded-xl text-sm font-medium text-white/90 bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-200"
                  >
                    Login
                  </NavLink>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <NavLink
                    to="/register"
                    className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 border border-violet-500/30 hover:border-violet-400/50 transition-all duration-200 shadow-lg"
                  >
                    Register
                  </NavLink>
                </motion.div>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 text-white"
        >
          <AnimatePresence mode="wait">
            {menuOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X size={20} />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu size={20} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="md:hidden bg-black/80 backdrop-blur-2xl border-t border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
          >
            <div className="flex flex-col gap-2 px-6 py-4">
              {navLinks.map(({ to, label }, index) => (
                <motion.div
                  key={to}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.2 }}
                >
                  <NavLink
                    to={to}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `block px-4 py-3 rounded-xl transition-all duration-200 ${
                        isActive
                          ? "text-white bg-white/10 backdrop-blur-xl border border-white/20"
                          : "text-white/80 hover:text-white hover:bg-white/5"
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                </motion.div>
              ))}

              {/* Mobile User Section */}
              <div className="mt-4 pt-4 border-t border-white/10">
                {isLoggedIn ? (
                  <>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: navLinks.length * 0.05, duration: 0.2 }}
                      className="flex items-center gap-2 px-4 py-3 mb-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl"
                    >
                      <User className="w-4 h-4 text-violet-400" />
                      <span className="text-white/90 text-sm">Hi, {user?.name}</span>
                    </motion.div>
                    <motion.button
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (navLinks.length + 1) * 0.05, duration: 0.2 }}
                      onClick={() => {
                        handleLogout();
                        setMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </motion.button>
                  </>
                ) : (
                  <div className="space-y-2">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: navLinks.length * 0.05, duration: 0.2 }}
                    >
                      <NavLink
                        to="/login"
                        onClick={() => setMenuOpen(false)}
                        className="block px-4 py-3 rounded-xl text-white/90 bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-200 text-center"
                      >
                        Login
                      </NavLink>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (navLinks.length + 1) * 0.05, duration: 0.2 }}
                    >
                      <NavLink
                        to="/register"
                        onClick={() => setMenuOpen(false)}
                        className="block px-4 py-3 rounded-xl text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 border border-violet-500/30 hover:border-violet-400/50 transition-all duration-200 text-center shadow-lg"
                      >
                        Register
                      </NavLink>
                    </motion.div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;