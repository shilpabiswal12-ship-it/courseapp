import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

// ── Floating particle ────────────────────────────────────────────────────────
const particles = Array.from({ length: 20 }, (_, i) => ({
  width: Math.random() * 10 + 4,
  height: Math.random() * 10 + 4,
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  duration: Math.random() * 5 + 3,
  delay: Math.random() * 4,
}));

function Particle({ style }) {
  return (
    <motion.span
      className="absolute rounded-full bg-blue-400 opacity-20 pointer-events-none"
      style={{ width: style.width, height: style.height, top: style.top, left: style.left }}
      animate={{ y: [0, -28, 0], opacity: [0.12, 0.3, 0.12], scale: [1, 1.3, 1] }}
      transition={{ duration: style.duration, repeat: Infinity, delay: style.delay, ease: "easeInOut" }}
    />
  );
}

// ── Variants ─────────────────────────────────────────────────────────────────
const cardVariant = {
  hidden: { opacity: 0, y: 60, scale: 0.95 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fieldVariant = {
  hidden: { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

// ── Component ─────────────────────────────────────────────────────────────────
function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:4001/api/v1/admin/login",
        { email, password },
        { withCredentials: true, headers: { "Content-Type": "application/json" } }
      );
      toast.success(response.data.message);
      localStorage.setItem("admin", JSON.stringify(response.data.admin));
      localStorage.setItem("adminToken", response.data.token);
      navigate("/admin/dashboard");
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.errors || "Login failed!");
        toast.error(error.response.data.errors || "Login failed!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#020617] min-h-screen relative overflow-hidden">

      {/* Particles */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {particles.map((p, i) => <Particle key={i} style={p} />)}
      </div>

      {/* Radial glow behind card */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(59,130,246,0.12) 0%, transparent 70%)" }}
      />

      {/* ── Header ── */}
      <motion.header
        className="absolute top-0 left-0 w-full flex justify-between items-center px-8 py-5 z-20"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Brand */}
        <Link to="/">
          <motion.div
            className="flex items-center cursor-pointer select-none"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-2xl font-black tracking-tight text-white"
              style={{ fontFamily: "'Inter','Segoe UI',sans-serif", letterSpacing: "-0.5px" }}>
              Course
            </span>
            <motion.span
              className="text-2xl font-black tracking-tight text-orange-500"
              style={{ fontFamily: "'Inter','Segoe UI',sans-serif", letterSpacing: "-0.5px" }}
              animate={{ filter: ["drop-shadow(0 0 4px rgba(249,115,22,0.3))", "drop-shadow(0 0 14px rgba(249,115,22,0.9))", "drop-shadow(0 0 4px rgba(249,115,22,0.3))"] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            >
              Hive
            </motion.span>
          </motion.div>
        </Link>

        {/* Nav links */}
        <motion.div className="flex items-center space-x-3"
          initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}>
          {[
            { to: "/admin/signup", label: "Signup", outline: true },
          ].map(({ to, label, outline }) => (
            <motion.span key={label} whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.95 }}
              style={{ display: "inline-block" }}>
              <Link to={to}
                className={`py-2 px-5 rounded-md text-sm font-semibold transition-colors duration-300 ${outline
                  ? "border border-gray-500 text-white hover:border-orange-400 hover:text-orange-400"
                  : "bg-orange-500 text-white hover:bg-orange-600"
                  }`}>
                {label}
              </Link>
            </motion.span>
          ))}
        </motion.div>
      </motion.header>

      {/* ── Login Card ── */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <motion.div
          className="w-full max-w-md"
          variants={cardVariant}
          initial="hidden"
          animate="visible"
        >
          {/* Glowing border wrapper */}
          <div className="relative rounded-2xl p-[1.5px]"
            style={{ background: "linear-gradient(135deg, rgba(249,115,22,0.6), rgba(59,130,246,0.4), rgba(249,115,22,0.2))" }}>
            <div className="bg-gray-950 bg-opacity-90 rounded-2xl p-8 backdrop-blur-sm">

              {/* Title */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  {/* Shield icon */}
                  <motion.div
                    className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center text-3xl"
                    style={{ background: "linear-gradient(135deg, rgba(249,115,22,0.2), rgba(59,130,246,0.2))", border: "1px solid rgba(249,115,22,0.3)" }}
                    animate={{ boxShadow: ["0 0 0px rgba(249,115,22,0)", "0 0 20px rgba(249,115,22,0.4)", "0 0 0px rgba(249,115,22,0)"] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  >
                    🛡️
                  </motion.div>

                  <h2 className="text-2xl font-extrabold text-white">
                    Welcome to{" "}
                    <motion.span
                      className="text-orange-500"
                      animate={{ filter: ["drop-shadow(0 0 4px rgba(249,115,22,0.3))", "drop-shadow(0 0 16px rgba(249,115,22,0.8))", "drop-shadow(0 0 4px rgba(249,115,22,0.3))"] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                    >
                      CourseHive
                    </motion.span>
                  </h2>
                  <p className="text-gray-400 mt-2 text-sm">Login to access the Admin Dashboard</p>

                  {/* Animated underline */}
                  <motion.div className="flex justify-center mt-3">
                    <motion.div
                      className="h-0.5 rounded-full bg-gradient-to-r from-orange-500 via-blue-400 to-orange-500"
                      initial={{ width: 0 }} animate={{ width: "140px" }}
                      transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
                    />
                  </motion.div>
                </motion.div>
              </div>

              {/* Form */}
              <motion.form onSubmit={handleSubmit} variants={stagger} initial="hidden" animate="visible">

                {/* Email */}
                <motion.div className="mb-4" variants={fieldVariant}>
                  <label className="text-gray-400 text-sm mb-1 block">Email</label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors duration-300"
                      placeholder="name@email.com"
                      required
                    />
                  </div>
                </motion.div>

                {/* Password */}
                <motion.div className="mb-5" variants={fieldVariant}>
                  <label className="text-gray-400 text-sm mb-1 block">Password</label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-12 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors duration-300"
                      placeholder="••••••••"
                      required
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-400 transition-colors duration-200">
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </motion.div>

                {/* Error */}
                <AnimatePresence>
                  {errorMessage && (
                    <motion.div
                      className="mb-4 text-red-400 text-sm text-center bg-red-900/20 border border-red-800/40 rounded-lg py-2"
                      initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}>
                      {errorMessage}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit */}
                <motion.div variants={fieldVariant}>
                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl font-bold text-white text-base transition-colors duration-300 relative overflow-hidden"
                    style={{ background: "linear-gradient(135deg, #f97316, #ea580c)" }}
                    whileHover={{ scale: 1.02, boxShadow: "0 0 24px rgba(249,115,22,0.5)" }}
                    whileTap={{ scale: 0.97 }}
                    animate={{ boxShadow: ["0 0 0px rgba(249,115,22,0)", "0 0 18px rgba(249,115,22,0.4)", "0 0 0px rgba(249,115,22,0)"] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <motion.span
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full inline-block"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                        />
                        Logging in…
                      </span>
                    ) : "Login"}
                  </motion.button>
                </motion.div>

                <motion.p className="text-center text-gray-500 text-sm mt-5" variants={fieldVariant}>
                  Don't have an account?{" "}
                  <Link to="/admin/signup" className="text-orange-400 hover:text-orange-300 font-semibold transition-colors">
                    Sign up
                  </Link>
                </motion.p>
              </motion.form>

            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default AdminLogin;
