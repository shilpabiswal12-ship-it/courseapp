import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { FiMail, FiLock, FiEye, FiEyeOff, FiShield } from "react-icons/fi";

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
    <div className="min-h-screen bg-slate-950 flex shadow-inner items-center justify-center p-6 relative overflow-hidden selection:bg-orange-500/30">
      
      {/* ── Background Gradients ── */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-slate-950 to-black pointer-events-none" />
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-[450px] relative group"
      >
        {/* Subtle Glowing Border Wrapper */}
        <div className="absolute -inset-[1px] bg-gradient-to-r from-orange-500/50 via-blue-500/50 to-orange-500/50 rounded-[20px] blur-[2px] opacity-30 group-hover:opacity-60 transition duration-1000" />
        
        <div className="relative bg-white/[0.03] backdrop-blur-2xl rounded-[20px] p-10 border border-white/10 shadow-2xl flex flex-col">
          
          {/* Header Section */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex p-4 rounded-xl bg-gradient-to-br from-white/5 to-white/10 border border-white/5 mb-6 text-blue-400"
            >
              <FiShield size={32} />
            </motion.div>
            
            <motion.h1 
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-white text-3xl font-black tracking-tight"
            >
              Welcome to <span className="bg-gradient-to-r from-orange-400 to-yellow-300 bg-clip-text text-transparent">CourseHive</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-slate-400 text-sm mt-2 font-medium"
            >
              Login to access the Admin Dashboard
            </motion.p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-slate-500 text-xs font-bold uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group/input">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 transition-colors group-focus-within/input:text-orange-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin.login@coursehive.com"
                  className="w-full bg-white/5 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-white text-sm transition-all focus:outline-none focus:bg-white/[0.08] focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 placeholder:text-slate-600"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-slate-500 text-xs font-bold uppercase tracking-widest ml-1">Password</label>
              <div className="relative group/input">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 transition-colors group-focus-within/input:text-orange-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/5 rounded-xl py-4 pl-12 pr-12 text-white text-sm transition-all focus:outline-none focus:bg-white/[0.08] focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 placeholder:text-slate-600"
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-xs text-center font-bold"
                >
                  {errorMessage}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-black py-4 rounded-xl shadow-lg shadow-orange-500/20 transition-all hover:shadow-orange-500/40 relative overflow-hidden group disabled:opacity-70"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                    Logging in...
                  </>
                ) : "Log In"}
              </span>
            </motion.button>

            {/* Footer */}
            <div className="text-center pt-4">
              <p className="text-slate-500 text-xs font-medium">
                Don't have an account?{" "}
                <Link to="/admin/signup" className="text-orange-400 hover:text-orange-300 font-bold transition-colors">
                  Sign up
                </Link>
              </p>
            </div>

          </form>
        </div>
      </motion.div>
    </div>
  );
}

export default AdminLogin;
