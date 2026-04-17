import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../public/logo.jpg";
import toast from "react-hot-toast";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FiGrid, FiPlusSquare, FiHome, FiLogOut, FiBook,
  FiUsers, FiTrendingUp, FiAward, FiArrowRight
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

// ── Stat cards data ──
const stats = [
  { label: "TOTAL COURSES", value: 12, Icon: FiBook, gradient: "from-orange-500 to-amber-500 shadow-orange-500/30" },
  { label: "TOTAL STUDENTS", value: 340, Icon: FiUsers, gradient: "from-sky-400 to-blue-600 shadow-blue-500/30" },
  { label: "REVENUE (₹)", value: 48200, Icon: FiTrendingUp, gradient: "from-emerald-400 to-green-600 shadow-emerald-500/30" },
  { label: "CERTIFICATIONS", value: 198, Icon: FiAward, gradient: "from-fuchsia-500 to-purple-600 shadow-purple-500/30" },
];

function Dashboard() {
  const navigate = useNavigate();
  const adminStr = localStorage.getItem("admin");
  const admin = adminStr && adminStr !== "undefined" ? JSON.parse(adminStr) : null;
  const [activeNav, setActiveNav] = useState("/admin/dashboard");

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
      
      {/* ══ SIDEBAR (Matches Image 2 Style) ═══════════════════════════════════ */}
      <motion.aside 
        className="w-72 border-r border-white/5 bg-[#0f172a]/50 backdrop-blur-2xl flex flex-col z-20"
        initial={{ x: -100 }} animate={{ x: 0 }}
      >
        <div className="flex flex-col items-center pt-12 pb-10">
          <motion.div className="relative mb-6" whileHover={{ scale: 1.05 }}>
            {/* Logo with glow */}
            <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full" />
            <img src={logo} alt="Logo" className="w-20 h-20 rounded-2xl object-contain shadow-2xl border-4 border-white/10 relative z-10" />
            <span className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-4 border-[#020617] rounded-full z-20" />
          </motion.div>
          
          <div className="text-center relative z-10">
            <p className="text-[10px] text-purple-400 font-extrabold uppercase tracking-[0.2em] mb-1">Administrator</p>
            <h2 className="text-xl font-black text-white tracking-tight">
              {admin.firstName} {admin.lastName}
            </h2>
          </div>
        </div>

        <nav className="flex-1 px-8 space-y-3 mt-4">
          {[
            { to: "/admin/our-courses", label: "Our Courses", Icon: FiGrid },
            { to: "/admin/create-course", label: "Create Course", Icon: FiPlusSquare },
            { to: "/", label: "Home", Icon: FiHome },
          ].map(({ to, label, Icon }) => (
            <Link key={to} to={to} onClick={() => setActiveNav(to)}>
              <motion.div 
                className={`flex items-center gap-4 px-6 py-4 rounded-xl cursor-pointer transition-all ${
                  activeNav === to ? "bg-white/10 text-white border border-white/10 shadow-lg" : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className={`text-xl ${activeNav === to ? "text-orange-500" : "text-gray-500"}`} />
                <span className="text-base font-bold tracking-tight">{label}</span>
              </motion.div>
            </Link>
          ))}
        </nav>

        <div className="p-8">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-5 py-4 rounded-xl text-sm font-bold text-red-400 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 transition-all"
          >
            <FiLogOut className="text-lg" />
            Logout
          </button>
        </div>
      </motion.aside>

      {/* ══ MAIN CONTENT ═════════════════════════════════════════════════════ */}
      <main className="flex-1 overflow-y-auto relative bg-[#020617]">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[140px] pointer-events-none" />
        
        {/* Header (Matching Image 2 Layout) */}
        <header className="flex items-center justify-between px-12 py-10 relative z-10">
          <div>
            <p className="text-[10px] text-gray-500 font-extrabold uppercase tracking-[0.2em] mb-1">ADMIN PANEL</p>
            <div className="flex items-center gap-1">
              <span className="text-3xl font-black text-white tracking-tighter">Course</span>
              <span className="text-3xl font-black text-orange-500 tracking-tighter shadow-orange-500/20">Hive</span>
            </div>
          </div>

          <LiveClock />
        </header>

        <div className="px-12 pb-12 relative z-10">
          {/* Greeting with Typewriter */}
          <div className="mb-14">
            <h1 className="text-5xl font-black text-white tracking-tight flex items-baseline gap-2 min-h-[1.2em]">
              {greeting}
              <motion.span 
                className="w-1.5 h-12 bg-orange-500 inline-block align-middle ml-2"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            </h1>
            <p className="text-gray-400 mt-2 text-lg font-medium opacity-80">Here's what's happening in your dashboard today.</p>
          </div>

          {/* Stat Cards (Matching Image 2 Solid Gradients) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map(({ label, value, Icon, gradient }) => (
              <motion.div 
                key={label}
                className={`relative rounded-3xl p-6 text-white overflow-hidden shadow-2xl bg-gradient-to-br ${gradient}`}
                whileHover={{ y: -8, scale: 1.02 }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex flex-col relative z-10">
                  <p className="text-[10px] font-black opacity-80 uppercase tracking-widest mb-3">{label}</p>
                  <span className="text-4xl font-black tracking-tighter">
                    <Counter to={value} />
                  </span>
                </div>
                {/* Large Background Icon */}
                <Icon className="absolute -right-6 -bottom-6 text-[8rem] opacity-10 rotate-12" />
              </motion.div>
            ))}
          </div>

          {/* Quick Actions (Matching Image 2 structure) */}
          <div className="mb-8">
            <p className="text-[10px] text-gray-500 font-extrabold uppercase tracking-[0.2em]">QUICK ACTIONS</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[
              {
                to: "/admin/our-courses",
                title: "Manage Courses",
                desc: "View, edit and delete your existing courses.",
                icon: "📚",
                color: "#22c55e"
              },
              {
                to: "/admin/create-course",
                title: "Create New Course",
                desc: "Publish a brand-new course for your students.",
                icon: "✨",
                color: "#f97316"
              }
            ].map(({ to, title, desc, icon, color }) => (
              <Link key={to} to={to}>
                <motion.div 
                  className="bg-[#0f172a]/30 backdrop-blur-md rounded-[2rem] p-10 border border-white/5 shadow-2xl hover:bg-[#0f172a]/50 hover:border-white/10 transition-all flex items-center justify-between group"
                  whileHover={{ x: 8 }}
                >
                  <div className="flex items-center gap-8">
                    <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform shadow-inner border border-white/5">
                      {icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-white tracking-tight mb-1">{title}</h3>
                      <p className="text-gray-400 font-medium">{desc}</p>
                    </div>
                  </div>
                  <FiArrowRight className="text-3xl group-hover:translate-x-3 transition-transform" style={{ color }} />
                </motion.div>
              </Link>
            ))}
          </div>

        </div>
      </main>
    </div>
  );
}

function LiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="text-right">
      <p className="text-[10px] text-gray-500 font-extrabold uppercase tracking-widest mb-1">
        {time.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
      </p>
      <div className="text-3xl font-black text-white tracking-tighter tabular-nums flex items-baseline justify-end gap-1">
        {time.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
        <span className="text-sm text-orange-500 opacity-60 ml-0.5">{time.toLocaleTimeString("en-IN", { second: "2-digit" })}</span>
        <span className="text-sm text-gray-500 uppercase ml-1">
          {time.toLocaleTimeString("en-IN", { hour12: true }).slice(-2)}
        </span>
      </div>
    </div>
  );
}

export default Dashboard;