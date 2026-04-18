import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaDiscourse, FaDownload, FaCertificate } from "react-icons/fa";
import { IoLogIn, IoLogOut } from "react-icons/io5";
import { RiHome2Fill } from "react-icons/ri";
import { HiMenu, HiX } from "react-icons/hi";
import { FiPlayCircle, FiArrowRight } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { jsPDF } from "jspdf";
import logo from "../../public/logo.jpg";

const BACKEND_URL = "http://localhost:4001/api/v1";

// ── Variants ──────────────────────────────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
};

const sidebarVariants = {
  open: { x: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  closed: { x: "-100%", transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }
};

function Purchases() {
  const [purchases, setPurchase] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [completedCourses, setCompletedCourses] = useState(() => {
    const saved = localStorage.getItem("course_progress");
    return saved ? JSON.parse(saved) : [];
  });

  const navigate = useNavigate();
  const userStr = localStorage.getItem("user");
  const user = userStr && userStr !== "undefined" ? JSON.parse(userStr) : null;

  useEffect(() => {
    setIsLoggedIn(!!user);
    if (!user) navigate("/login");
  }, [user, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchPurchases = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/user/purchases`, {
          withCredentials: true,
        });
        setPurchase(response.data.courseData || []);
      } catch (error) {
        setErrorMessage("Failed to fetch purchase data");
      } finally {
        setLoading(false);
      }
    };
    fetchPurchases();
  }, [user]);

  const handleLogout = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/user/logout`, {
        withCredentials: true,
      });
      toast.success(response.data.message);
      localStorage.removeItem("user");
      navigate("/login");
      setIsLoggedIn(false);
    } catch (error) {
      toast.error(error.response?.data?.errors || "Error in logging out");
    }
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const toggleCompletion = (courseId) => {
    const isCompleted = completedCourses.includes(courseId);
    let updated;
    if (isCompleted) {
      updated = completedCourses.filter((id) => id !== courseId);
      toast.error("Marked as In Progress");
    } else {
      updated = [...completedCourses, courseId];
      toast.success("Course Completed! 🎉");
    }
    setCompletedCourses(updated);
    localStorage.setItem("course_progress", JSON.stringify(updated));
  };

  const generateCertificate = (courseTitle) => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    // ── Certificate Design ──
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Background
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    // Decorative Borders
    doc.setDrawColor(37, 99, 235); // Blue-600
    doc.setLineWidth(5);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

    doc.setDrawColor(249, 115, 22); // Orange-500
    doc.setLineWidth(1);
    doc.rect(15, 15, pageWidth - 30, pageHeight - 30);

    // Header Text
    doc.setTextColor(30, 41, 59);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(48);
    doc.text("CERTIFICATE", pageWidth / 2, 60, { align: "center" });
    
    doc.setFontSize(22);
    doc.setFont("helvetica", "normal");
    doc.text("OF COMPLETION", pageWidth / 2, 75, { align: "center" });

    // Body
    doc.setFontSize(18);
    doc.text("This is to certify that", pageWidth / 2, 100, { align: "center" });

    // Recipient Name
    console.log("Certificate Generation - Current User Data:", user);
    
    const firstName = user?.firstName || user?.user?.firstName || "";
    const lastName = user?.lastName || user?.user?.lastName || "";
    const recipientName = (firstName || lastName) ? `${firstName} ${lastName}`.trim() : "Learner";
    
    console.log("Extracted Name for Certificate:", recipientName);

    doc.setTextColor(37, 99, 235);
    doc.setFontSize(36);
    doc.setFont("helvetica", "bolditalic");
    doc.text(recipientName, pageWidth / 2, 120, { align: "center" });

    // Achievement
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(18);
    doc.setFont("helvetica", "normal");
    doc.text("has successfully completed the professional course", pageWidth / 2, 140, { align: "center" });

    // Course Title
    doc.setTextColor(249, 115, 22);
    doc.setFontSize(26);
    doc.setFont("helvetica", "bold");
    doc.text(courseTitle, pageWidth / 2, 155, { align: "center" });

    // Footer Info
    const date = new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(14);
    doc.text(`Completed on ${date}`, pageWidth / 2, 175, { align: "center" });

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("CourseHive Academy", pageWidth / 2, 190, { align: "center" });

    // Save
    doc.save(`${courseTitle.replace(/\s+/g, '_')}_Certificate.pdf`);
    toast.success("Certificate downloaded! Congratulations! 🎓");
  };

  // Filter completedCourses to only include those that are actually in the purchases list
  const validCompletedCount = purchases.filter(p => completedCourses.includes(p._id)).length;
  const progressPercentage = purchases.length > 0
    ? Math.round((validCompletedCount / purchases.length) * 100)
    : 0;

  if (!user) return null;

  return (
    <div className="flex bg-white text-gray-900 min-h-screen overflow-hidden">
      {/* Mobile Toggle */}
      <motion.button
        className="md:hidden fixed top-5 left-5 z-50 p-2 bg-white shadow-lg rounded-full text-2xl text-gray-800"
        whileTap={{ scale: 0.9 }}
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <HiX /> : <HiMenu />}
      </motion.button>

      {/* ── Sidebar ────────────────────────────────────────────────────────── */}
      <motion.aside
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
          <img src={logo} alt="Logo" className="rounded-2xl h-12 w-12 border border-gray-200 shadow-sm" />
          <span className="ml-3 font-black text-xl tracking-tight text-gray-800">Course<span className="text-orange-500">Hive</span></span>
        </motion.div>

        <nav>
          <ul className="space-y-4">
            {[
              { to: "/", label: "Home", Icon: RiHome2Fill },
              { to: "/courses", label: "Courses", Icon: FaDiscourse },
              { to: "/purchases", label: "Purchases", Icon: FaDownload, active: true },
            ].map(({ to, label, Icon, active }) => (
              <li key={label}>
                <Link to={to}>
                  <motion.div
                    whileHover={{ x: 5, color: "#3b82f6" }}
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
              <motion.button
                whileHover={{ x: 5, color: "#ef4444" }}
                className="flex items-center w-full p-3 text-gray-500 font-semibold text-sm rounded-xl hover:bg-red-50"
                onClick={handleLogout}
              >
                <IoLogOut className="text-xl mr-3" /> Logout
              </motion.button>
            </li>
          </ul>
        </nav>
      </motion.aside>

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <main className="flex-1 min-h-screen bg-white p-6 md:p-10 relative">
        <header className="mb-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-black text-gray-900">My Learning</h1>
            <p className="text-gray-400 text-sm mt-1">Review all your purchased courses and continue learning.</p>

            {/* Progress Bar */}
            {purchases.length > 0 && (
              <div className="mt-8 bg-gray-50 p-6 rounded-3xl border border-gray-100 max-w-2xl">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-bold text-gray-700">Total Progress</span>
                  <span className="text-blue-600 font-black text-sm">{progressPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="bg-blue-600 h-full rounded-full shadow-sm"
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-2 font-medium">
                  {validCompletedCount} of {purchases.length} courses completed
                </p>
              </div>
            )}
          </motion.div>
        </header>

        {/* Error message */}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-red-500 bg-red-50 border border-red-100 p-4 rounded-2xl text-center mb-8"
          >
            {errorMessage}
          </motion.div>
        )}

        {/* Loading state */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-3">
            <motion.div
              className="w-10 h-10 border-4 border-blue-50 border-t-blue-600 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <p className="text-gray-400 text-sm font-medium">Loading your library...</p>
          </div>
        ) : purchases.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {purchases.map((purchase, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ y: -8, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.08)" }}
                className="group bg-white border border-gray-100 rounded-3xl p-5 shadow-sm transition-all duration-300 flex flex-col h-full"
              >
                <div className="relative overflow-hidden rounded-2xl mb-4 aspect-video bg-gray-50 flex items-center justify-center">
                  <motion.img
                    className="w-full h-full object-cover"
                    src={purchase.image?.url || "https://via.placeholder.com/200"}
                    alt={purchase.title}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                  />
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <FiPlayCircle className="text-white text-5xl opacity-80" />
                  </div>
                </div>

                <div className="flex-1 flex flex-col">
                  <h3 className="text-lg font-black text-gray-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-1">
                    {purchase.title}
                  </h3>
                  <p className="text-gray-500 text-xs mb-4 line-clamp-2 leading-relaxed">
                    {purchase.description}
                  </p>

                  <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-blue-600 font-black text-sm">
                      ₹{purchase.price}
                    </span>
                    <div className="flex gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        completedCourses.includes(purchase._id) 
                          ? "bg-blue-50 text-blue-600" 
                          : "bg-orange-50 text-orange-600"
                      }`}>
                        {completedCourses.includes(purchase._id) ? "Completed" : "In Progress"}
                      </span>
                      <span className="bg-green-50 text-green-600 text-[10px] font-bold px-2 py-0.5 rounded-md">
                        Purchased
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 mt-4">
                    <Link
                      to={purchase.youtubeLink}
                      target="_blank"
                      className="w-full"
                    >
                      <motion.button
                        whileHover={{ scale: 1.02, backgroundColor: "#2563eb" }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-blue-600 text-white py-3 rounded-2xl font-black text-sm shadow-md shadow-blue-500/10 flex items-center justify-center gap-2"
                      >
                        <FiPlayCircle /> Watch Course
                      </motion.button>
                    </Link>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleCompletion(purchase._id)}
                      className={`w-full py-3 rounded-2xl font-black text-sm border-2 transition-colors ${
                        completedCourses.includes(purchase._id)
                          ? "border-blue-100 bg-blue-50 text-blue-600 hover:bg-blue-100"
                          : "border-gray-100 bg-white text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {completedCourses.includes(purchase._id) ? "Mark as In Progress" : "Mark as Completed"}
                    </motion.button>

                    {completedCourses.includes(purchase._id) && (
                      <motion.button
                        whileHover={{ scale: 1.02, backgroundColor: "#0f172a" }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => generateCertificate(purchase.title)}
                        className="w-full bg-slate-800 text-white py-3 rounded-2xl font-black text-sm shadow-md flex items-center justify-center gap-2"
                      >
                        <FaCertificate className="text-orange-500" /> Download Certificate
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200"
          >
            <div className="text-5xl mb-4">📖</div>
            <p className="text-gray-500 font-bold text-lg">Your library is empty.</p>
            <p className="text-gray-400 text-sm mb-6">Explore our courses and start learning today!</p>
            <Link to="/courses">
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "#ea580c" }}
                whileTap={{ scale: 0.95 }}
                className="bg-orange-500 text-white px-8 py-3 rounded-2xl font-black text-sm shadow-lg shadow-orange-500/20 flex items-center mx-auto gap-2"
              >
                Go to Courses <FiArrowRight />
              </motion.button>
            </Link>
          </motion.div>
        )}
      </main>
    </div>
  );
}

export default Purchases;