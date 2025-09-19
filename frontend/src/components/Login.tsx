import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "./store/useUserStore.ts";

function Login() {
  const { login } = useAuthStore();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      }, { withCredentials: true });
      const res = await axios.get("http://localhost:5000/api/auth/profile", { withCredentials: true });
      if (res.data.user) {
        login(res.data.user); // update global state
        navigate("/");
      }
    } catch (err) {
      setError("Invalid credentials or error occurred");
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-gradient-to-b from-black via-[#0a0a1f] to-black text-white">
      {/* Cyber neon grid background */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#1f1f3a_1px,transparent_1px),linear-gradient(to_bottom,#1f1f3a_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Neon glow orbs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-fuchsia-600/30 blur-3xl animate-pulse" />
      <div className="absolute top-40 -right-40 w-96 h-96 rounded-full bg-cyan-500/30 blur-3xl animate-pulse delay-1000" />

      {/* Glass card with animated gradient border */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative w-full max-w-md p-[2px] rounded-2xl bg-gradient-to-r from-fuchsia-500 via-cyan-400 to-fuchsia-500 animate-gradient-x"
      >
        <div className="w-full h-full bg-black/80 backdrop-blur-xl rounded-2xl p-8">
          <h2 className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-fuchsia-400 to-cyan-300 bg-clip-text text-transparent">
            Welcome Back
          </h2>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 text-center text-sm text-red-400 bg-red-500/10 px-3 py-2 rounded-lg"
            >
              {error}
            </motion.p>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="peer w-full px-4 pt-6 pb-2 rounded-lg bg-white/5 border border-white/20 text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="Email"
              />
              <label className="absolute left-4 top-2 text-gray-400 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-sm peer-focus:text-cyan-300">
                Email
              </label>
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="peer w-full px-4 pt-6 pb-2 rounded-lg bg-white/5 border border-white/20 text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
                placeholder="Password"
              />
              <label className="absolute left-4 top-2 text-gray-400 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-sm peer-focus:text-fuchsia-300">
                Password
              </label>
            </div>

            {/* Login button */}
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: "0 0 25px #06b6d4" }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 text-black py-3 rounded-lg font-semibold shadow-lg transition"
            >
              Log In
            </motion.button>
            <div className="mt-6 text-center">
            <a
              href="http://localhost:5000/api/auth/google"
              className="inline-flex items-center justify-center w-full px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white font-semibold transition"
            >
              <img
                src="https://www.citypng.com/public/uploads/preview/google-logo-icon-gsuite-hd-701751694791470gzbayltphh.png?v=2025062016"
                alt="Google"
                className="w-5 h-5 mr-2 rounded-xl"
              />
              Continue with Google
            </a>
          </div>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-cyan-400 cursor-pointer hover:underline"
            >
              Sign up
            </span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;
