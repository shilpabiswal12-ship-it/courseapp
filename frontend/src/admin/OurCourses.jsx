import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowLeft, FiTrash2, FiEdit3, FiBook, FiTag, FiPercent } from "react-icons/fi";

// ── variants ──────────────────────────────────────────────────────────────────
const pageVariant = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
};

const headerVariant = {
  hidden: { opacity: 0, y: -30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const gridVariant = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 40, scale: 0.94 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  },
  exit: {
    opacity: 0, scale: 0.85, y: -20,
    transition: { duration: 0.35 }
  },
};

// ── component ─────────────────────────────────────────────────────────────────
function OurCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  const adminStr = localStorage.getItem("admin");
  const admin = adminStr && adminStr !== "undefined" ? JSON.parse(adminStr) : null;

  if (!admin) {
    toast.error("Please login to admin");
    navigate("/admin/login");
  }

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:4001/api/v1/course/courses", {
          withCredentials: true,
        });
        setCourses(response.data.courses);
      } catch (error) {
        console.log("error in fetchCourses", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleDelete = async (courseId) => {
    setDeletingId(courseId);
    try {
      const response = await axios.delete(
        `http://localhost:4001/api/v1/course/delete/${courseId}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
        }
      );
      toast.success(response.data.message);
      setCourses((prev) => prev.filter((c) => c._id !== courseId));
    } catch (error) {
      toast.error(error.response?.data?.errors || "Error deleting course");
    } finally {
      setDeletingId(null);
    }
  };

  // ── Loading skeleton ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #0f172a 0%, #1a1040 50%, #0f172a 100%)" }}>
        <motion.div className="flex flex-col items-center gap-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <motion.div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
            style={{ background: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.3)" }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          >
            📚
          </motion.div>
          <p className="text-gray-400 text-sm tracking-widest uppercase">Loading courses…</p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen pb-16 px-6 pt-8"
      style={{ background: "#020617" }}
      variants={pageVariant}
      initial="hidden"
      animate="visible"
    >
      {/* ── Top bar ── */}
      <motion.div
        className="flex items-center justify-between mb-10"
        variants={headerVariant}
        initial="hidden"
        animate="visible"
      >
        {/* Brand + back */}
        <div>
          <Link to="/admin/dashboard">
            <motion.div
              className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-3 transition-colors duration-200"
              whileHover={{ x: -4 }}
            >
              <FiArrowLeft /> Back to Dashboard
            </motion.div>
          </Link>
          <div className="flex items-center gap-1">
            <span className="text-3xl font-black text-white tracking-tight"
              style={{ fontFamily: "'Inter','Segoe UI',sans-serif" }}>
              Our
            </span>
            <motion.span
              className="text-3xl font-black text-orange-500 tracking-tight ml-2"
              style={{ fontFamily: "'Inter','Segoe UI',sans-serif" }}
              animate={{ filter: ["drop-shadow(0 0 4px rgba(249,115,22,0.3))", "drop-shadow(0 0 16px rgba(249,115,22,0.9))", "drop-shadow(0 0 4px rgba(249,115,22,0.3))"] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              Courses
            </motion.span>
          </div>
          {/* Animated underline */}
          <motion.div
            className="mt-2 h-0.5 rounded-full bg-gradient-to-r from-orange-500 via-purple-500 to-blue-400"
            initial={{ width: 0 }} animate={{ width: "160px" }}
            transition={{ delay: 0.4, duration: 0.7, ease: "easeOut" }}
          />
        </div>

        {/* Course count badge */}
        <motion.div
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
          style={{ background: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.3)" }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <FiBook className="text-orange-400" />
          {courses.length} {courses.length === 1 ? "Course" : "Courses"}
        </motion.div>
      </motion.div>

      {/* ── Grid ── */}
      {courses.length === 0 ? (
        <motion.div className="flex flex-col items-center justify-center mt-24 gap-4"
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-6xl">📂</div>
          <p className="text-gray-400 text-lg">No courses yet.</p>
          <Link to="/admin/create-course">
            <motion.button
              className="mt-2 px-6 py-3 rounded-xl text-white font-semibold text-sm"
              style={{ background: "linear-gradient(135deg, #f97316, #ea580c)" }}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
              Create your first course →
            </motion.button>
          </Link>
        </motion.div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
          variants={gridVariant}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {courses.map((course) => (
              <motion.div
                key={course._id}
                variants={cardVariant}
                exit="exit"
                layout
                className="relative group rounded-2xl overflow-hidden flex flex-col"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
                whileHover={{
                  y: -6,
                  border: "1px solid rgba(249,115,22,0.35)",
                  boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
                }}
                transition={{ duration: 0.25 }}
              >
                {/* Image */}
                <div className="relative overflow-hidden h-44">
                  <motion.img
                    src={course?.image?.url}
                    alt={course.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.4 }}
                  />
                  {/* Discount badge */}
                  <motion.div
                    className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold text-white"
                    style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)" }}
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <FiPercent className="text-xs" /> 10 off
                  </motion.div>

                  {/* Gradient overlay bottom of image */}
                  <div className="absolute inset-0 pointer-events-none"
                    style={{ background: "linear-gradient(to top, rgba(15,23,42,0.85) 0%, transparent 50%)" }} />
                </div>

                {/* Card body */}
                <div className="p-5 flex flex-col flex-1">
                  <h2 className="text-lg font-bold text-white mb-1 leading-tight">
                    {course.title}
                  </h2>
                  <p className="text-gray-400 text-sm leading-relaxed flex-1">
                    {course.description.length > 100
                      ? `${course.description.slice(0, 100)}…`
                      : course.description}
                  </p>

                  {/* Price row */}
                  <div className="flex items-center gap-3 mt-4">
                    <FiTag className="text-orange-400 text-sm" />
                    <span className="text-orange-400 font-extrabold text-lg">₹{course.price}</span>
                    <span className="line-through text-gray-600 text-sm">₹300</span>
                  </div>

                  {/* Divider */}
                  <div className="my-4 h-px"
                    style={{ background: "rgba(255,255,255,0.07)" }} />

                  {/* Action buttons */}
                  <div className="flex gap-3">
                    <Link to={`/admin/update-course/${course._id}`} className="flex-1">
                      <motion.button
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors duration-200"
                        style={{ background: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.35)" }}
                        whileHover={{ background: "rgba(249,115,22,0.35)", scale: 1.02 }}
                        whileTap={{ scale: 0.96 }}
                      >
                        <FiEdit3 className="text-orange-400" /> Update
                      </motion.button>
                    </Link>

                    <motion.button
                      onClick={() => handleDelete(course._id)}
                      disabled={deletingId === course._id}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors duration-200"
                      style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)" }}
                      whileHover={{ background: "rgba(239,68,68,0.3)", scale: 1.02 }}
                      whileTap={{ scale: 0.96 }}
                    >
                      {deletingId === course._id ? (
                        <motion.span
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                        />
                      ) : (
                        <><FiTrash2 className="text-red-400" /> Delete</>
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  );
}

export default OurCourses;