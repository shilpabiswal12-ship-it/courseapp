import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiType, FiAlignLeft, FiDollarSign, FiYoutube,
  FiImage, FiSave, FiArrowLeft,
} from "react-icons/fi";

// ── variants ──────────────────────────────────────────────────────────────────
const cardVariant = {
  hidden: { opacity: 0, y: 50, scale: 0.97 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.25 } },
};

const fieldVariant = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

// ── field config ──────────────────────────────────────────────────────────────
const fieldConfig = [
  { id: "title", label: "Course Title", placeholder: "Enter course title", type: "text", Icon: FiType },
  { id: "description", label: "Description", placeholder: "Enter course description", type: "text", Icon: FiAlignLeft },
  { id: "price", label: "Price (₹)", placeholder: "Enter course price", type: "number", Icon: FiDollarSign },
  { id: "youtubeLink", label: "YouTube Preview Link", placeholder: "https://youtube.com/...", type: "text", Icon: FiYoutube },
];

// ── component ─────────────────────────────────────────────────────────────────
function UpdateCourse() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [values, setValues] = useState({
    title: "", description: "", price: "", youtubeLink: "",
  });
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch existing course data
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const { data } = await axios.get(`http://localhost:4001/api/v1/course/${id}`, {
          withCredentials: true,
        });
        const c = data.course;
        setValues({
          title: c.title,
          description: c.description,
          price: c.price,
          youtubeLink: c.youtubeLink || "",
        });
        setImage(c.image.url);
        setImagePreview(c.image.url);
        setLoading(false);
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch course data");
        setLoading(false);
      }
    };
    fetchCourseData();
  }, [id]);

  const handleChange = (key) => (e) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  const changePhotoHandler = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => { setImagePreview(reader.result); setImage(file); };
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    setSaving(true);

    const adminStr = localStorage.getItem("admin");
    const admin = adminStr && adminStr !== "undefined" ? JSON.parse(adminStr) : null;
    if (!admin) { toast.error("Please login to admin"); return; }

    const formData = new FormData();
    Object.entries(values).forEach(([k, v]) => formData.append(k, v));
    if (image instanceof File) formData.append("image", image);

    try {
      const response = await axios.put(
        `http://localhost:4001/api/v1/course/update/${id}`,
        formData,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
        }
      );
      toast.success(response.data.message || "Course updated successfully!");
      navigate("/admin/our-courses");
    } catch (error) {
      toast.error(error.response?.data?.errors || "Error updating course");
    } finally {
      setSaving(false);
    }
  };

  // ── Loading state ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #0f172a 0%, #1a1040 50%, #0f172a 100%)" }}>
        <motion.div className="flex flex-col items-center gap-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <motion.div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
            style={{ background: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.3)" }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          >
            ✏️
          </motion.div>
          <p className="text-gray-400 text-sm tracking-widest uppercase">Loading course data…</p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen py-10 px-4"
      style={{ background: "#020617" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Back button */}
      <motion.button
        onClick={() => navigate("/admin/our-courses")}
        className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-8 ml-2 transition-colors duration-200"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        whileHover={{ x: -4 }}
      >
        <FiArrowLeft /> Back to Courses
      </motion.button>

      <motion.div
        className="max-w-2xl mx-auto"
        variants={cardVariant}
        initial="hidden"
        animate="visible"
      >
        {/* Glowing border card */}
        <div className="rounded-2xl p-[1.5px]"
          style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.5), rgba(139,92,246,0.4), rgba(249,115,22,0.3))" }}>
          <div className="rounded-2xl p-8"
            style={{ background: "rgba(15,23,42,0.95)", backdropFilter: "blur(12px)" }}>

            {/* Header */}
            <div className="mb-8">
              <motion.div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-4"
                style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.2))", border: "1px solid rgba(59,130,246,0.35)" }}
                animate={{ boxShadow: ["0 0 0px rgba(59,130,246,0)", "0 0 20px rgba(59,130,246,0.45)", "0 0 0px rgba(59,130,246,0)"] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                initial={{ scale: 0, rotate: -90 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
              >
                ✏️
              </motion.div>

              <h2 className="text-2xl font-extrabold text-white">Update Course</h2>
              <p className="text-gray-400 text-sm mt-1">Edit the details below and save your changes.</p>

              {/* Animated underline — blue/purple for update (different from create's orange) */}
              <motion.div
                className="mt-3 h-0.5 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-400"
                initial={{ width: 0 }} animate={{ width: "160px" }}
                transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
              />
            </div>

            {/* Current thumbnail preview */}
            <AnimatePresence>
              {imagePreview && (
                <motion.div
                  className="mb-6 rounded-xl overflow-hidden"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Course preview"
                      className="w-full h-48 object-cover rounded-xl"
                      style={{ border: "1px solid rgba(59,130,246,0.3)" }}
                    />
                    {/* Overlay label */}
                    <div className="absolute top-3 left-3 px-2 py-1 rounded-lg text-xs text-white font-semibold"
                      style={{ background: "rgba(15,23,42,0.75)", backdropFilter: "blur(6px)" }}>
                      Current Thumbnail
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <motion.form
              onSubmit={handleUpdateCourse}
              className="space-y-5"
              variants={stagger}
              initial="hidden"
              animate="visible"
            >
              {/* Text fields */}
              {fieldConfig.map(({ id: fid, label, placeholder, type, Icon }) => (
                <motion.div key={fid} variants={fieldVariant}>
                  <label className="block text-gray-300 text-sm font-semibold mb-1.5">
                    {label}
                  </label>
                  <div className="relative">
                    <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-base" />
                    <input
                      type={type}
                      placeholder={placeholder}
                      value={values[fid]}
                      onChange={handleChange(fid)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder-gray-600 text-sm transition-colors duration-300 focus:outline-none"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                      onFocus={(e) => { e.target.style.borderColor = "rgba(99,102,241,0.8)"; }}
                      onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; }}
                    />
                  </div>
                </motion.div>
              ))}

              {/* Image upload */}
              <motion.div variants={fieldVariant}>
                <label className="block text-gray-300 text-sm font-semibold mb-1.5">
                  Replace Thumbnail
                </label>
                <label
                  className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer text-gray-400 text-sm transition-all duration-300 hover:text-white"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px dashed rgba(255,255,255,0.15)" }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = "rgba(99,102,241,0.5)"}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"}
                >
                  <FiImage className="text-blue-400 text-xl shrink-0" />
                  <span>
                    {image instanceof File ? image.name : "Click to replace image…"}
                  </span>
                  <input type="file" onChange={changePhotoHandler} className="hidden" accept="image/*" />
                </label>
              </motion.div>

              {/* Submit */}
              <motion.div variants={fieldVariant} className="pt-2">
                <motion.button
                  type="submit"
                  disabled={saving}
                  className="w-full py-3.5 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 relative overflow-hidden"
                  style={{ background: "linear-gradient(135deg, #6366f1, #4f46e5)" }}
                  whileHover={{ scale: 1.02, boxShadow: "0 0 28px rgba(99,102,241,0.55)" }}
                  whileTap={{ scale: 0.97 }}
                  animate={{ boxShadow: ["0 0 0px rgba(99,102,241,0)", "0 0 18px rgba(99,102,241,0.4)", "0 0 0px rgba(99,102,241,0)"] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                >
                  {/* Shimmer sweep */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%)" }}
                    initial={{ x: "-100%" }}
                    animate={{ x: "200%" }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
                  />
                  {saving ? (
                    <>
                      <motion.span
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                      />
                      Saving changes…
                    </>
                  ) : (
                    <><FiSave className="text-lg" /> Save Changes</>
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

export default UpdateCourse;
