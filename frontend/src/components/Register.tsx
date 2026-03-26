import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Register() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post("https://careerai-laww.onrender.com/api/auth/signup", {
        name,
        email,
        password,
      });
      navigate("/login");
    } catch (err) {
      setError("User already exists or error occurred");
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-black text-white">
      {/* Animated background orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-cyan-500/30 blur-3xl animate-pulse" />
      <div className="absolute top-40 -right-32 w-96 h-96 rounded-full bg-fuchsia-500/30 blur-3xl animate-pulse delay-1000" />
      <div className="absolute bottom-10 left-1/3 w-72 h-72 rounded-full bg-blue-600/20 blur-3xl animate-pulse delay-500" />

      {/* Glassmorphic card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8 relative z-10"
      >
        <h2 className="text-3xl font-extrabold text-center mb-6 bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent">
          Create Account
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

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="relative">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="peer w-full px-4 pt-6 pb-2 rounded-lg bg-white/5 border border-white/20 text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="Full Name"
            />
            <label className="absolute left-4 top-2 text-gray-400 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-sm peer-focus:text-cyan-300">
              Full Name
            </label>
          </div>

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

          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="peer w-full px-4 pt-6 pb-2 rounded-lg bg-white/5 border border-white/20 text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="Password"
            />
            <label className="absolute left-4 top-2 text-gray-400 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-sm peer-focus:text-cyan-300">
              Password
            </label>
          </div>

          <motion.button
            whileHover={{ scale: 1.03, boxShadow: "0 0 20px #22d3ee" }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-black py-3 rounded-lg font-semibold shadow-lg transition"
          >
            Sign Up
          </motion.button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-cyan-400 cursor-pointer hover:underline"
          >
            Log in
          </span>
        </p>
      </motion.div>
    </div>
  );
}

export default Register;
