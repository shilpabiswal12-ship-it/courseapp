import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiType, FiAlignLeft, FiDollarSign, FiYoutube,
  FiImage, FiPlusCircle, FiArrowLeft,
} from "react-icons/fi";

// ── animation variants ────────────────────────────────────────────────────────
const pageVariant = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 50, scale: 0.97 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.3 } },
};

const fieldVariant = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

// ── field config ──────────────────────────────────────────────────────────────
const fields = [
  { id: "title", label: "Course Title", placeholder: "e.g. Advanced React Masterclass", type: "text", Icon: FiType },
  { id: "description", label: "Description", placeholder: "What will students learn?", type: "text", Icon: FiAlignLeft },
  { id: "price", label: "Price (₹)", placeholder: "e.g. 999", type: "number", Icon: FiDollarSign },
  { id: "youtubeLink", label: "YouTube Preview Link", placeholder: "https://youtube.com/...", type: "text", Icon: FiYoutube },
];

// ── component ─────────────────────────────────────────────────────────────────
function CourseCreate() {
  const [values, setValues] = useState({
    title: "", description: "", price: "", youtubeLink: "",
  });
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (id) => (e) =>
    setValues((v) => ({ ...v, [id]: e.target.value }));

  const changePhotoHandler = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => { setImagePreview(reader.result); setImage(file); };
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    setLoading(true);

    const adminStr = localStorage.getItem("admin");
    const admin = adminStr && adminStr !== "undefined" ? JSON.parse(adminStr) : null;
    if (!admin) { navigate("/admin/login"); return; }

    const formData = new FormData();
    Object.entries(values).forEach(([k, v]) => formData.append(k, v));
    formData.append("image", image);

    try {
      const response = await axios.post(
        "http://localhost:4001/api/v1/course/create",
        formData,
        { withCredentials: true, headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` } }
      );
      toast.success(response.data.message || "Course created successfully!");
      navigate("/admin/our-courses");
    } catch (error) {
      toast.error(error.response?.data?.errors || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen py-10 px-4"
      style={{ background: "#020617" }}
      variants={pageVariant}
      initial="hidden"
      animate="visible"
    >
      {/* Back button */}
      <motion.button
        onClick={() => navigate("/admin/dashboard")}
        className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-8 ml-2 transition-colors duration-200"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        whileHover={{ x: -4 }}
      >
        <FiArrowLeft /> Back to Dashboard
      </motion.button>

      <motion.div
        className="max-w-2xl mx-auto"
        variants={cardVariant}
        initial="hidden"
        animate="visible"
      >
        {/* Glowing card border */}
        <div className="rounded-2xl p-[1.5px]"
          style={{ background: "linear-gradient(135deg, rgba(249,115,22,0.5), rgba(139,92,246,0.4), rgba(59,130,246,0.3))" }}>
          <div className="rounded-2xl p-8"
            style={{ background: "rgba(15,23,42,0.95)", backdropFilter: "blur(12px)" }}>

            {/* Header */}
            <div className="mb-8">
              <motion.div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-4"
                style={{ background: "linear-gradient(135deg, rgba(249,115,22,0.2), rgba(139,92,246,0.2))", border: "1px solid rgba(249,115,22,0.3)" }}
                animate={{ boxShadow: ["0 0 0px rgba(249,115,22,0)", "0 0 20px rgba(249,115,22,0.4)", "0 0 0px rgba(249,115,22,0)"] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                initial={{ scale: 0, rotate: -90 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
              >
                📖
              </motion.div>

              <h2 className="text-2xl font-extrabold text-white">Create a New Course</h2>
              <p className="text-gray-400 text-sm mt-1">Fill in the details below to publish your course.</p>

              {/* Animated underline */}
              <motion.div className="mt-3 h-0.5 rounded-full bg-gradient-to-r from-orange-500 via-purple-500 to-blue-400"
                initial={{ width: 0 }} animate={{ width: "160px" }}
                transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }} />
            </div>

            {/* Form */}
            <motion.form
              onSubmit={handleCreateCourse}
              className="space-y-5"
              variants={stagger}
              initial="hidden"
              animate="visible"
            >
              {/* Dynamic text fields */}
              {fields.map(({ id, label, placeholder, type, Icon }) => (
                <motion.div key={id} variants={fieldVariant}>
                  <label className="block text-gray-300 text-sm font-semibold mb-1.5">
                    {label}
                  </label>
                  <div className="relative">
                    <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-base" />
                    <input
                      type={type}
                      placeholder={placeholder}
                      value={values[id]}
                      onChange={handleChange(id)}
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder-gray-600 text-sm transition-colors duration-300 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                      onFocus={(e) => { e.target.style.borderColor = "rgba(249,115,22,0.8)"; }}
                      onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; }}
                    />
                  </div>
                </motion.div>
              ))}

              {/* Image upload */}
              <motion.div variants={fieldVariant}>
                <label className="block text-gray-300 text-sm font-semibold mb-1.5">
                  Course Thumbnail
                </label>

                {/* Preview */}
                <AnimatePresence>
                  {imagePreview && (
                    <motion.div
                      className="mb-3 rounded-xl overflow-hidden"
                      initial={{ opacity: 0, scale: 0.9, height: 0 }}
                      animate={{ opacity: 1, scale: 1, height: "auto" }}
                      exit={{ opacity: 0, scale: 0.9, height: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <img src={imagePreview} alt="Preview"
                        className="w-full max-h-48 object-cover rounded-xl"
                        style={{ border: "1px solid rgba(249,115,22,0.3)" }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* File input styled */}
                <label
                  className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer text-gray-400 text-sm transition-colors duration-300 hover:text-white"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px dashed rgba(255,255,255,0.15)" }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = "rgba(249,115,22,0.5)"}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"}
                >
                  <FiImage className="text-orange-400 text-xl shrink-0" />
                  <span>{image ? image.name : "Click to upload an image…"}</span>
                  <input type="file" onChange={changePhotoHandler} className="hidden" accept="image/*" />
                </label>
              </motion.div>

              {/* Submit */}
              <motion.div variants={fieldVariant} className="pt-2">
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 relative overflow-hidden"
                  style={{ background: "linear-gradient(135deg, #f97316, #ea580c)" }}
                  whileHover={{ scale: 1.02, boxShadow: "0 0 28px rgba(249,115,22,0.55)" }}
                  whileTap={{ scale: 0.97 }}
                  animate={{ boxShadow: ["0 0 0px rgba(249,115,22,0)", "0 0 18px rgba(249,115,22,0.4)", "0 0 0px rgba(249,115,22,0)"] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                >
                  {/* Shimmer sweep on button */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%)" }}
                    initial={{ x: "-100%" }}
                    animate={{ x: "200%" }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
                  />
                  {loading ? (
                    <>
                      <motion.span
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                      />
                      Publishing…
                    </>
                  ) : (
                    <><FiPlusCircle className="text-lg" /> Create Course</>
                  )}
                </motion.button>
              </motion.div>
            </motion.form>

          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default CourseCreate;