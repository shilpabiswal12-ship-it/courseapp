import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser } from "react-icons/fi";

// ── Floating particles ────────────────────────────────────────────────────────
const particles = Array.from({ length: 25 }, () => ({
  width: Math.random() * 8 + 2,
  height: Math.random() * 8 + 2,
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  duration: Math.random() * 8 + 4,
  delay: Math.random() * 5,
}));

function Particle({ style }) {
  return (
    <motion.span
      className="absolute rounded-full bg-orange-500/20 pointer-events-none"
      style={{ width: style.width, height: style.height, top: style.top, left: style.left }}
      animate={{ y: [0, -40, 0], opacity: [0.1, 0.4, 0.1], scale: [1, 1.5, 1] }}
      transition={{ duration: style.duration, repeat: Infinity, delay: style.delay, ease: "easeInOut" }}
    />
  );
}

// ── Motion Variants ───────────────────────────────────────────────────────────
const cardVariant = {
  hidden: { opacity: 0, y: 40, scale: 0.98 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const fieldVariant = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

// ── Component ─────────────────────────────────────────────────────────────────
function AdminSignup() {
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
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
        "http://localhost:4001/api/v1/admin/signup",
        { firstName: firstname, lastName: lastname, email, password },
        { withCredentials: true, headers: { "Content-Type": "application/json" } }
      );
      toast.success(response.data.message);
      navigate("/admin/login");
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.errors || "Signup failed!");
        toast.error(error.response.data.errors || "Signup failed!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#020617] min-h-screen relative overflow-hidden flex items-center justify-center font-inter selection:bg-orange-500/30">
      
      {/* ── Visual Backdrop ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-orange-600/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[140px]" />
        {particles.map((p, i) => <Particle key={i} style={p} />)}
      </div>

      {/* ── Header Logo ── */}
      <motion.header
        className="absolute top-0 left-0 w-full flex justify-between items-center px-12 py-10 z-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Link to="/">
          <motion.div className="flex items-center gap-1" whileHover={{ scale: 1.05 }}>
            <span className="text-3xl font-black tracking-tighter text-white">Course</span>
            <span className="text-3xl font-black tracking-tighter text-orange-500">Hive</span>
          </motion.div>
        </Link>
        <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/5 shadow-2xl">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Registry Gateway</span>
        </div>
      </motion.header>

      {/* ── Signup Container ── */}
      <div className="relative z-10 w-full max-w-2xl px-6 py-32">
        <motion.div
          className="bg-[#0f172a]/40 backdrop-blur-3xl rounded-[3rem] p-12 md:p-16 border border-white/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]"
          variants={cardVariant}
          initial="hidden"
          animate="visible"
        >
          {/* Top Visual */}
          <div className="text-center mb-12">
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
              <div className="w-24 h-24 mx-auto mb-8 rounded-[2rem] bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-5xl shadow-2xl shadow-blue-500/20">
                🚀
              </div>
              <h2 className="text-4xl font-black text-white tracking-tighter">
                Expand <span className="text-blue-500">Operations</span>
              </h2>
              <p className="text-gray-400 font-medium mt-3">Provision a new administrative account on the network.</p>
            </motion.div>
          </div>

          {/* Form */}
          <motion.form onSubmit={handleSubmit} variants={stagger} initial="hidden" animate="visible" className="space-y-6">
            
            {/* Name fields row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {[
                  { label: "Given Name", value: firstname, setter: setFirstName, placeholder: "John", id: "firstname", icon: FiUser },
                  { label: "Family Name", value: lastname, setter: setLastName, placeholder: "Doe", id: "lastname", icon: FiUser },
                ].map(({ label, value, setter, placeholder, id, icon: Icon }) => (
                  <motion.div key={id} variants={fieldVariant}>
                    <label className="text-[10px] uppercase font-black tracking-[0.2em] text-gray-500 mb-2.5 ml-2 block">{label}</label>
                    <div className="relative group">
                      <Icon className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-lg transition-colors group-focus-within:text-blue-500" />
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => setter(e.target.value)}
                        className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/5 rounded-[1.5rem] text-white placeholder-gray-600 text-sm font-medium focus:outline-none focus:bg-white/[0.08] focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300"
                        placeholder={placeholder} required
                      />
                    </div>
                  </motion.div>
               ))}
            </div>

            {/* Email Field */}
            <motion.div variants={fieldVariant}>
              <label className="text-[10px] uppercase font-black tracking-[0.2em] text-gray-500 mb-2.5 ml-2 block">Authentication Email</label>
              <div className="relative group">
                <FiMail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 text-lg transition-colors group-focus-within:text-blue-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-16 pr-6 py-4 bg-white/5 border border-white/5 rounded-[1.5rem] text-white placeholder-gray-600 text-sm font-medium focus:outline-none focus:bg-white/[0.08] focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300"
                  placeholder="name@email.com"
                  required
                />
              </div>
            </motion.div>

            {/* Password Field */}
            <motion.div variants={fieldVariant}>
              <label className="text-[10px] uppercase font-black tracking-[0.2em] text-gray-500 mb-2.5 ml-2 block">Security Keycode</label>
              <div className="relative group">
                <FiLock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 text-lg transition-colors group-focus-within:text-blue-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-16 pr-16 py-4 bg-white/5 border border-white/5 rounded-[1.5rem] text-white placeholder-gray-600 text-sm font-medium focus:outline-none focus:bg-white/[0.08] focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300"
                  placeholder="••••••••"
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-500 transition-colors"
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
            </motion.div>

            {/* Error Message */}
            <AnimatePresence>
              {errorMessage && (
                <motion.div
                  className="text-red-400 text-[11px] font-black uppercase tracking-[0.15em] text-center bg-red-500/10 border border-red-500/20 rounded-2xl py-4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  {errorMessage}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.div variants={fieldVariant} className="pt-4">
              <motion.button
                type="submit"
                disabled={loading}
                className="w-full py-5 rounded-[1.75rem] font-black text-white text-lg bg-[#0f172a] border border-white/10 shadow-2xl relative overflow-hidden group disabled:opacity-50"
                whileHover={{ scale: 1.02, background: "#1e293b", borderColor: "rgba(59,130,246,0.3)" }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {loading ? (
                    <>
                      <motion.span
                        className="w-6 h-6 border-[3px] border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                      />
                      Provisioning...
                    </>
                  ) : "Register Administrator"}
                </span>
              </motion.button>
            </motion.div>

            <motion.p 
              className="text-center text-gray-500 text-[10px] font-black uppercase tracking-[0.25em] mt-12"
              variants={fieldVariant}
            >
              Joined existing network?{" "}
              <Link to="/admin/login" className="text-orange-500 hover:underline underline-offset-8 transition-all">
                Authorize Session
              </Link>
            </motion.p>
          </motion.form>
        </motion.div>
      </div>
    </div>
  );
}

export default AdminSignup;
