import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCircleUser } from "react-icons/fa6";
import { RiHome2Fill } from "react-icons/ri";
import { FaDiscourse } from "react-icons/fa";
import { FaDownload } from "react-icons/fa6";
import { IoLogIn, IoLogOut } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import { HiMenu, HiX } from "react-icons/hi";
import logo from "../../public/logo.jpg";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// ── Animation Variants ────────────────────────────────────────────────────────
const sidebarVariants = {
  open: { x: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  closed: { x: "-100%", transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const navItemVariants = {
  hover: { x: 5, color: "#3b82f6", transition: { duration: 0.2 } }
};

function Courses() {
  const [courses, setCourses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("user");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:4001/api/v1/course/courses", {
          withCredentials: true,
        });
        setCourses(response.data.courses);
      } catch (error) {
        console.log("error in fetchCourses ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.get("http://localhost:4001/api/v1/user/logout", {
        withCredentials: true,
      });
      toast.success(response.data.message);
      localStorage.removeItem("user");
      setIsLoggedIn(false);
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.errors || "Error in logging out");
    }
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex bg-white text-gray-900 overflow-hidden min-h-screen">
      {/* Hamburger for mobile */}
      <motion.button
        className="md:hidden fixed top-5 left-5 z-50 p-2 bg-white shadow-lg rounded-full text-2xl text-gray-800"
        whileTap={{ scale: 0.9 }}
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <HiX /> : <HiMenu />}
      </motion.button>

      {/* ── Sidebar ────────────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.aside
          key="sidebar"
          variants={sidebarVariants}
          initial={false}
          animate={(isSidebarOpen || window.innerWidth >= 768) ? "open" : "closed"}
          className="fixed md:static top-0 left-0 h-screen bg-gray-50/80 backdrop-blur-md border-r border-gray-100 w-64 p-6 z-40"
        >
          <motion.div
            className="flex items-center mb-10"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <img src={logo} alt="Logo" className="rounded-2xl h-12 w-12 shadow-sm border border-gray-200" />
            <span className="ml-3 font-black text-xl tracking-tight text-gray-800">Course<span className="text-orange-500">Hive</span></span>
          </motion.div>

          <nav>
            <ul className="space-y-4">
              {[
                { to: "/", label: "Home", Icon: RiHome2Fill },
                { to: "/courses", label: "Courses", Icon: FaDiscourse, active: true },
                { to: "/purchases", label: "Purchases", Icon: FaDownload },
              ].map(({ to, label, Icon, active }) => (
                <li key={label}>
                  <Link to={to}>
                    <motion.div
                      variants={navItemVariants}
                      whileHover="hover"
                      className={`flex items-center p-3 rounded-xl transition-all duration-200 ${active ? "bg-blue-50 text-blue-600 shadow-sm" : "text-gray-500 hover:bg-gray-100"
                        }`}
                    >
                      <Icon className="text-xl mr-3" />
                      <span className="font-semibold text-sm">{label}</span>
                    </motion.div>
                  </Link>
                </li>
              ))}

              <li>
                {isLoggedIn ? (
                  <motion.button
                    whileHover={{ x: 5, color: "#ef4444" }}
                    className="flex items-center w-full p-3 text-gray-500 font-semibold text-sm rounded-xl hover:bg-red-50"
                    onClick={handleLogout}
                  >
                    <IoLogOut className="text-xl mr-3" /> Logout
                  </motion.button>
                ) : (
                  <Link to="/login">
                    <motion.div
                      whileHover={{ x: 5, color: "#3b82f6" }}
                      className="flex items-center w-full p-3 text-gray-500 font-semibold text-sm rounded-xl hover:bg-blue-50"
                    >
                      <IoLogIn className="text-xl mr-3" /> Login
                    </motion.div>
                  </Link>
                )}
              </li>
            </ul>
          </nav>
        </motion.aside>
      </AnimatePresence>

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <main className="flex-1 min-h-screen bg-white p-6 md:p-10 relative">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-black text-gray-900">Explore Courses</h1>
            <p className="text-gray-400 text-sm mt-1">Unlock your potential with our expert-led programs.</p>
          </motion.div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <motion.div
              className="relative flex-1 md:w-80"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="text"
                placeholder="Search for anything..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-100/50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300 text-sm text-gray-900"
              />
            </motion.div>

            <motion.div
              whileHover={{ rotate: 10, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="hidden md:block"
            >
              <FaCircleUser className="text-4xl text-blue-600 cursor-pointer" />
            </motion.div>
          </div>
        </header>

        {/* ── Course Grid ───────────────────────────────────────────────── */}
        <div className="overflow-y-auto pr-2 custom-scrollbar" style={{ maxHeight: "calc(100vh - 180px)" }}>
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3">
              <motion.div
                className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <p className="text-gray-400 text-sm font-medium">Fetching courses...</p>
            </div>
          ) : filteredCourses.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200"
            >
              <p className="text-gray-400 font-semibold">
                {searchTerm ? "Opps! We couldn't find any match." : "No courses available at the moment."}
              </p>
            </motion.div>
          ) : (
            <motion.div
              className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {filteredCourses.map((course) => (
                <motion.div
                  key={course._id}
                  variants={cardVariants}
                  whileHover={{ y: -8, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.08)" }}
                  className="group bg-white border border-gray-100 rounded-3xl p-5 transition-all duration-300 flex flex-col h-full"
                >
                  <div className="relative overflow-hidden rounded-2xl mb-5 aspect-video bg-gray-50 flex items-center justify-center">
                    <motion.img
                      src={course.image.url}
                      alt={course.title}
                      className="w-full h-full object-contain"
                      whileHover={{ scale: 1.08 }}
                      transition={{ duration: 0.4 }}
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold text-green-600 shadow-sm border border-green-100">
                      20% OFF
                    </div>
                  </div>

                  <h2 className="font-extrabold text-gray-900 text-lg mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {course.title}
                  </h2>
                  <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed flex-1">
                    {course.description}
                  </p>

                  <div className="flex justify-between items-end mb-6">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">Lifetime Access</p>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-2xl text-gray-900">₹{course.price}</span>
                        <span className="text-gray-400 line-through text-xs italic">₹5999</span>
                      </div>
                    </div>
                  </div>

                  <Link to={`/buy/${course._id}`}>
                    <motion.button
                      whileHover={{ scale: 1.02, backgroundColor: "#ea580c" }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-orange-500 text-white py-3.5 rounded-2xl font-black text-sm shadow-lg shadow-orange-500/20 transition-all duration-200"
                    >
                      Enroll Now
                    </motion.button>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </main>

      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d1d5db; }
      `}} />
    </div>
  );
}

export default Courses;