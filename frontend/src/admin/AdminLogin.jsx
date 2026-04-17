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
        setErrorMessage(error.response.data.errors || "Authentication failed!");
        toast.error(error.response.data.errors || "Authentication failed!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen relative overflow-hidden">
      {/* ── Animated Background ── */}
      <div className="animated-bg opacity-30" />

      {/* ── Header ── */}
      <motion.header
        className="absolute top-0 left-0 w-full flex justify-between items-center px-10 py-8 z-20"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Brand */}
        <Link to="/">
          <motion.div
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-2xl font-black tracking-tighter text-slate-900">
              Course
            </span>
            <span className="text-2xl font-black tracking-tighter text-orange-500">
              Hive
            </span>
          </motion.div>
        </Link>

        {/* Action badge */}
        <motion.div 
           initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
           className="bg-white/80 backdrop-blur-md px-5 py-2.5 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center gap-3"
        >
            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Secure Protocol</span>
        </motion.div>
      </motion.header>

      {/* ── Login Card ── */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <motion.div
          className="w-full max-w-lg"
          variants={cardVariant}
          initial="hidden"
          animate="visible"
        >
          <div className="bg-white/70 backdrop-blur-3xl rounded-[3rem] p-12 shadow-2xl shadow-slate-200/50 border border-white">

            {/* Title */}
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {/* Shield icon */}
                <motion.div
                  className="w-20 h-20 mx-auto mb-8 rounded-3xl flex items-center justify-center text-4xl"
                  style={{ background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.1)" }}
                >
                  🛡️
                </motion.div>

                <h2 className="text-4xl font-black text-slate-900 tracking-tighter">
                  Authorize <span className="text-orange-500">Access</span>
                </h2>
                <p className="text-slate-500 font-medium mt-2">Initialize your administrative session to proceed.</p>
              </motion.div>
            </div>

            {/* Form */}
            <motion.form onSubmit={handleSubmit} variants={stagger} initial="hidden" animate="visible" className="space-y-8">

              {/* Email */}
              <motion.div variants={fieldVariant}>
                <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-3 ml-1 block">Encryption ID (Email)</label>
                <div className="relative group">
                  <FiMail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-lg transition-colors group-focus-within:text-orange-500" />
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 bg-slate-50/50 border border-slate-100 rounded-[1.5rem] text-slate-900 placeholder-slate-300 text-sm font-medium transition-all duration-300 focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5"
                    placeholder="admin@coursehive.com"
                    required
                  />
                </div>
              </motion.div>

              {/* Password */}
              <motion.div variants={fieldVariant}>
                <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-3 ml-1 block">Security Passphrase</label>
                <div className="relative group">
                  <FiLock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-lg transition-colors group-focus-within:text-orange-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-14 pr-14 py-4 bg-slate-50/50 border border-slate-100 rounded-[1.5rem] text-slate-900 placeholder-slate-300 text-sm font-medium transition-all duration-300 focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5"
                    placeholder="••••••••"
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-orange-500 transition-colors duration-200">
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </motion.div>

              {/* Error */}
              <AnimatePresence>
                {errorMessage && (
                  <motion.div
                    className="text-red-600 text-[10px] font-black uppercase tracking-widest text-center bg-red-50 border border-red-100 rounded-xl py-3"
                    initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}>
                    {errorMessage}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <motion.div variants={fieldVariant} className="pt-4">
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 rounded-[1.5rem] font-black text-white text-sm bg-[#0f172a] shadow-2xl shadow-black/10 flex items-center justify-center gap-3 transition-all hover:bg-slate-800 disabled:opacity-50 overflow-hidden relative"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <motion.span
                        className="w-5 h-5 border-[3px] border-white border-t-transparent rounded-full inline-block"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                      />
                      Validating Protocol…
                    </span>
                  ) : "Initiate Login"}
                </motion.button>
              </motion.div>

              <motion.p className="text-center text-slate-400 text-[10px] font-black uppercase tracking-widest mt-8" variants={fieldVariant}>
                Restricted Terminal Access
              </motion.p>
            </motion.form>

          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default AdminLogin;
