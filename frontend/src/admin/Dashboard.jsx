import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../public/logo.jpg";
import toast from "react-hot-toast";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiGrid, FiPlusSquare, FiHome, FiLogOut, FiBook,
  FiUsers, FiTrendingUp, FiAward,
} from "react-icons/fi";

// ── Typewriter hook ───────────────────────────────────────────────────────────
function useTypewriter(text, speed = 60) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return displayed;
}

// ── Animated counter ──────────────────────────────────────────────────────────
function Counter({ to, duration = 1.5 }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = to / (duration * 60);
    const id = setInterval(() => {
      start += step;
      if (start >= to) { setCount(to); clearInterval(id); }
      else setCount(Math.floor(start));
    }, 1000 / 60);
    return () => clearInterval(id);
  }, [to, duration]);
  return <span>{count.toLocaleString()}</span>;
}

// ── Nav items ─────────────────────────────────────────────────────────────────
const navItems = [
  { to: "/admin/our-courses", label: "Our Courses", Icon: FiGrid, color: "#22c55e" },
  { to: "/admin/create-course", label: "Create Course", Icon: FiPlusSquare, color: "#f97316" },
  { to: "/", label: "Home", Icon: FiHome, color: "#3b82f6" },
];

// ── Stat cards ────────────────────────────────────────────────────────────────
const stats = [
  { label: "Total Courses", value: 12, Icon: FiBook, gradient: "from-orange-500 to-amber-400" },
  { label: "Total Students", value: 340, Icon: FiUsers, gradient: "from-blue-500  to-cyan-400" },
  { label: "Revenue (₹)", value: 48200, Icon: FiTrendingUp, gradient: "from-green-500 to-emerald-400" },
  { label: "Certifications", value: 198, Icon: FiAward, gradient: "from-purple-500 to-pink-400" },
];

// ── Component ─────────────────────────────────────────────────────────────────
function Dashboard() {
  const navigate = useNavigate();
  const adminStr = localStorage.getItem("admin");
  const admin = adminStr && adminStr !== "undefined" ? JSON.parse(adminStr) : null;
  const [activeNav, setActiveNav] = useState(null);

  useEffect(() => { if (!admin) navigate("/admin/login"); }, [admin, navigate]);
  if (!admin) return null;

  const greeting = useTypewriter(`Welcome back, ${admin.firstName || "Admin"} 👋`, 55);

  const handleLogout = async () => {
    try {
      const res = await axios.get("http://localhost:4001/api/v1/admin/logout", { withCredentials: true });
      toast.success(res.data.message);
      localStorage.removeItem("admin");
      localStorage.removeItem("adminToken");
      navigate("/admin/login");
    } catch (err) {
      toast.error(err.response?.data?.errors || "Error logging out");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#020617] text-white">

      {/* ══ SIDEBAR ══════════════════════════════════════════════════════════ */}
      <motion.aside
        className="relative flex flex-col w-64 shrink-0 overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #0f172a 0%, #020617 100%)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}
        initial={{ x: -260 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Sidebar glow blob */}
        <div className="absolute -top-16 -left-16 w-48 h-48 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)" }} />

        {/* Profile */}
        <div className="flex flex-col items-center pt-10 pb-8 px-6">
          <motion.div
            className="relative"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.7, delay: 0.3, type: "spring", stiffness: 200 }}
          >
            <img src={logo} alt="Admin"
              className="w-20 h-20 rounded-2xl object-cover"
              style={{ border: "2px solid rgba(139,92,246,0.6)", boxShadow: "0 0 20px rgba(139,92,246,0.4)" }}
            />
            {/* Online dot */}
            <motion.span
              className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-gray-900"
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>

          <motion.div className="text-center mt-4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.45 }}
          >
            <p className="text-xs text-purple-400 font-semibold uppercase tracking-widest mb-1">Administrator</p>
            <h2 className="text-base font-bold text-white">
              {admin.firstName} {admin.lastName}
            </h2>
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div className="mx-6 mb-6 h-px bg-gradient-to-r from-transparent via-purple-700 to-transparent"
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }} />

        {/* Nav */}
        <nav className="flex flex-col gap-2 px-4 flex-1">
          {navItems.map(({ to, label, Icon, color }, i) => (
            <motion.div key={to}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + i * 0.1, duration: 0.4, ease: "easeOut" }}
            >
              <Link to={to} onClick={() => setActiveNav(to)}>
                <motion.div
                  className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer relative overflow-hidden"
                  style={{
                    background: activeNav === to
                      ? `linear-gradient(135deg, ${color}22, ${color}11)`
                      : "transparent",
                    border: activeNav === to
                      ? `1px solid ${color}44`
                      : "1px solid transparent",
                  }}
                  whileHover={{
                    x: 6,
                    background: `linear-gradient(135deg, ${color}22, ${color}11)`,
                    border: `1px solid ${color}44`,
                  }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.2 }}
                >
                  <Icon style={{ color }} className="text-lg shrink-0" />
                  <span className="text-sm font-medium text-gray-200">{label}</span>

                  {/* Hover shimmer */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: `linear-gradient(90deg, transparent, ${color}18, transparent)` }}
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.5 }}
                  />
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-4 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.4 }}
          >
            <motion.button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-400 relative overflow-hidden"
              style={{ border: "1px solid rgba(239,68,68,0.2)" }}
              whileHover={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.4)",
                x: 6,
              }}
              whileTap={{ scale: 0.96 }}
              transition={{ duration: 0.2 }}
            >
              <FiLogOut className="text-lg" />
              Logout
            </motion.button>
          </motion.div>
        </div>
      </motion.aside>

      {/* ══ MAIN CONTENT ═════════════════════════════════════════════════════ */}
      <main className="flex-1 overflow-y-auto"
        style={{ background: "#020617" }}>

        {/* Top bar */}
        <motion.div
          className="flex items-center justify-between px-10 py-6 sticky top-0 z-10"
          style={{
            background: "rgba(2,6,23,0.8)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Admin Panel</p>
            <div className="flex items-center gap-1">
              <span className="text-2xl font-black tracking-tight text-white"
                style={{ fontFamily: "'Inter','Segoe UI',sans-serif" }}>Course</span>
              <motion.span className="text-2xl font-black tracking-tight text-orange-500"
                style={{ fontFamily: "'Inter','Segoe UI',sans-serif" }}
                animate={{ filter: ["drop-shadow(0 0 4px rgba(249,115,22,0.3))", "drop-shadow(0 0 14px rgba(249,115,22,0.9))", "drop-shadow(0 0 4px rgba(249,115,22,0.3))"] }}
                transition={{ duration: 2.5, repeat: Infinity }}>Hive</motion.span>
            </div>
          </div>

          {/* Live clock */}
          <LiveClock />
        </motion.div>

        {/* Body */}
        <div className="px-10 py-8">

          {/* Typewriter greeting */}
          <motion.div className="mb-10"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
            <h1 className="text-3xl font-extrabold text-white min-h-[2.5rem]">
              {greeting}
              <motion.span
                className="inline-block w-0.5 h-7 bg-orange-500 ml-1 align-middle"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.6, repeat: Infinity }}
              />
            </h1>
            <p className="text-gray-400 mt-2 text-sm">Here's what's happening in your dashboard today.</p>
          </motion.div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
            {stats.map(({ label, value, Icon, gradient }, i) => (
              <motion.div key={label}
                className={`relative rounded-2xl p-6 overflow-hidden bg-gradient-to-br ${gradient}`}
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.7 + i * 0.12, duration: 0.5, type: "spring", stiffness: 200 }}
                whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }}
              >
                {/* big faded icon background */}
                <Icon className="absolute -right-4 -bottom-4 text-8xl opacity-10 text-white" />

                <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-2">{label}</p>
                <p className="text-3xl font-extrabold text-white">
                  <Counter to={value} />
                </p>

                {/* shimmer sweep */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.12) 50%, transparent 60%)" }}
                  initial={{ x: "-100%" }}
                  animate={{ x: "200%" }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4, ease: "linear" }}
                />
              </motion.div>
            ))}
          </div>

          {/* Quick action cards */}
          <motion.h2 className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
            Quick Actions
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                to: "/admin/our-courses",
                title: "Manage Courses",
                desc: "View, edit and delete your existing courses.",
                icon: "📚",
                color: "#22c55e",
              },
              {
                to: "/admin/create-course",
                title: "Create New Course",
                desc: "Publish a brand-new course for your students.",
                icon: "✨",
                color: "#f97316",
              },
            ].map(({ to, title, desc, icon, color }, i) => (
              <motion.div key={to}
                initial={{ opacity: 0, x: i === 0 ? -40 : 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 + i * 0.15, duration: 0.5, ease: "easeOut" }}
                whileHover={{ y: -4, boxShadow: `0 16px 40px ${color}22` }}
              >
                <Link to={to}>
                  <div className="rounded-2xl p-6 cursor-pointer relative overflow-hidden"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: `1px solid ${color}33`,
                    }}>
                    <div className="text-4xl mb-3">{icon}</div>
                    <h3 className="text-white font-bold text-lg mb-1">{title}</h3>
                    <p className="text-gray-400 text-sm">{desc}</p>

                    {/* Arrow */}
                    <motion.div
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-2xl"
                      style={{ color }}
                      animate={{ x: [0, 6, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      →
                    </motion.div>

                    {/* corner glow */}
                    <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full pointer-events-none"
                      style={{ background: `radial-gradient(circle, ${color}22 0%, transparent 70%)` }} />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

        </div>
      </main>
    </div>
  );
}

// ── Live clock component ───────────────────────────────────────────────────────
function LiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <motion.div className="text-right"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      <p className="text-xs text-gray-500">
        {time.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
      </p>
      <p className="text-lg font-bold text-white font-mono tracking-wider">
        {time.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
      </p>
    </motion.div>
  );
}

export default Dashboard;