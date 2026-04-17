import React, { useEffect, useState } from "react";
import logo from "../../public/logo.jpg";
import coursehiveLogo from "../../public/coursehive_logo.png";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

// ── animation variants ──────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut", delay },
  }),
};

const fadeDown = {
  hidden: { opacity: 0, y: -40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const cardVariant = {
  hidden: { opacity: 0, scale: 0.85, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// floating particle component
function Particle({ style }) {
  return (
    <motion.span
      className="absolute rounded-full bg-blue-400 opacity-20 pointer-events-none"
      style={style}
      animate={{
        y: [0, -30, 0],
        opacity: [0.15, 0.35, 0.15],
        scale: [1, 1.3, 1],
      }}
      transition={{
        duration: style.duration,
        repeat: Infinity,
        delay: style.delay,
        ease: "easeInOut",
      }}
    />
  );
}

const particles = Array.from({ length: 18 }, (_, i) => ({
  width: Math.random() * 10 + 4,
  height: Math.random() * 10 + 4,
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  duration: Math.random() * 4 + 3,
  delay: Math.random() * 4,
}));

// ── component ────────────────────────────────────────────────────────────────
function Home() {
  const [courses, setCourses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("user");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4001/api/v1/user/logout",
        { withCredentials: true }
      );
      toast.success(response.data.message);
      localStorage.removeItem("user");
      setIsLoggedIn(false);
    } catch (error) {
      console.log("Error in logging out", error);
      toast.error(error.response?.data?.errors || "Error in logging out");
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4001/api/v1/course/courses",
          { withCredentials: true }
        );
        setCourses(response.data.courses);
      } catch (error) {
        console.log("error in fetchCourses", error);
      }
    };
    fetchCourses();
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    initialSlide: 0,
    autoplay: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 2, infinite: true, dots: true } },
      { breakpoint: 600, settings: { slidesToShow: 2, slidesToScroll: 2, initialSlide: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  return (
    <div className="bg-[#020617] relative overflow-hidden">

      {/* ── Floating particles ── */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {particles.map((p, i) => (
          <Particle key={i} style={p} />
        ))}
      </div>

      <div className="min-h-screen text-white container mx-auto relative z-10">

        {/* ── HEADER ─────────────────────────────────────────── */}
        <motion.header
          className="flex items-center justify-between p-6"
          variants={fadeDown}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="flex items-center cursor-pointer select-none"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.25 }}
          >
            <span
              className="text-2xl font-black tracking-tight text-white"
              style={{ fontFamily: "'Inter','Segoe UI',sans-serif", letterSpacing: "-0.5px" }}
            >
              Course
            </span>
            <motion.span
              className="text-2xl font-black tracking-tight text-orange-500"
              style={{ fontFamily: "'Inter','Segoe UI',sans-serif", letterSpacing: "-0.5px" }}
              animate={{
                filter: [
                  "drop-shadow(0 0 4px rgba(249,115,22,0.3))",
                  "drop-shadow(0 0 12px rgba(249,115,22,0.8))",
                  "drop-shadow(0 0 4px rgba(249,115,22,0.3))",
                ],
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            >
              Hive
            </motion.span>
          </motion.div>

          <motion.div
            className="space-x-4"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <AnimatePresence mode="wait">
              {isLoggedIn ? (
                <motion.button
                  key="logout"
                  onClick={handleLogout}
                  className="bg-transparent text-white py-2 px-4 border border-white rounded hover:bg-white hover:text-black transition-colors duration-300"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Logout
                </motion.button>
              ) : (
                <motion.span
                  key="auth-links"
                  className="space-x-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {[{ to: "/login", label: "Login" }, { to: "/signup", label: "Signup" }].map(
                    ({ to, label }) => (
                      <motion.span
                        key={label}
                        whileHover={{ scale: 1.06 }}
                        whileTap={{ scale: 0.95 }}
                        style={{ display: "inline-block" }}
                      >
                        <Link
                          to={to}
                          className="bg-transparent text-white py-2 px-4 border border-white rounded hover:bg-white hover:text-black transition-colors duration-300"
                        >
                          {label}
                        </Link>
                      </motion.span>
                    )
                  )}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.header>

        {/* ── HERO ───────────────────────────────────────────── */}
        <section className="text-center py-20">
          {/* Premium hero title */}
          <motion.div
            className="flex items-center justify-center gap-0 flex-wrap"
            variants={fadeUp}
            custom={0.1}
            initial="hidden"
            animate="visible"
          >
            <motion.span
              className="text-6xl md:text-7xl font-black tracking-tight text-white"
              style={{
                fontFamily: "'Inter', 'Segoe UI', sans-serif",
                letterSpacing: "-2px",
                textShadow: "0 0 40px rgba(255,255,255,0.15)",
              }}
              animate={{
                textShadow: [
                  "0 0 10px rgba(255,255,255,0.1)",
                  "0 0 40px rgba(255,255,255,0.3)",
                  "0 0 10px rgba(255,255,255,0.1)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              Course
            </motion.span>
            <motion.span
              className="text-6xl md:text-7xl font-black tracking-tight text-orange-500"
              style={{
                fontFamily: "'Inter', 'Segoe UI', sans-serif",
                letterSpacing: "-2px",
                filter: "drop-shadow(0 0 18px rgba(249,115,22,0.7))",
              }}
              animate={{
                filter: [
                  "drop-shadow(0 0 10px rgba(249,115,22,0.4))",
                  "drop-shadow(0 0 30px rgba(249,115,22,0.9))",
                  "drop-shadow(0 0 10px rgba(249,115,22,0.4))",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
              Hive
            </motion.span>
          </motion.div>

          {/* Animated underline accent */}
          <motion.div
            className="flex justify-center mt-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <motion.div
              className="h-1 rounded-full bg-gradient-to-r from-white via-orange-500 to-blue-400"
              initial={{ width: 0 }}
              animate={{ width: "220px" }}
              transition={{ delay: 0.8, duration: 0.9, ease: "easeOut" }}
            />
          </motion.div>

          <motion.p
            className="text-gray-400 mt-6 text-lg"
            variants={fadeUp}
            custom={0.3}
            initial="hidden"
            animate="visible"
          >
            Upgrade Your Skills, Unlock Your Future
          </motion.p>

          <motion.div
            className="mt-10"
            variants={fadeUp}
            custom={0.5}
            initial="hidden"
            animate="visible"
          >
            <motion.span
              whileHover={{ scale: 1.08, boxShadow: "0 0 20px rgba(34,197,94,0.6)" }}
              whileTap={{ scale: 0.95 }}
              style={{ display: "inline-block", borderRadius: "0.25rem" }}
              animate={{ boxShadow: ["0 0 0px rgba(34,197,94,0)", "0 0 18px rgba(34,197,94,0.5)", "0 0 0px rgba(34,197,94,0)"] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Link
                to="/courses"
                className="bg-green-500 text-white py-3 px-8 rounded font-semibold hover:bg-white hover:text-black duration-300 inline-block"
              >
                Explore Courses
              </Link>
            </motion.span>
          </motion.div>
        </section>

        {/* ── COURSE SLIDER ──────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
        >
          <Slider {...sliderSettings}>
            {courses.map((course, index) => (
              <motion.div
                key={course._id}
                className="p-4"
                variants={cardVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={index}
              >
                <motion.div
                  className="relative flex-shrink-0 transition-transform duration-300"
                  whileHover={{ scale: 1.06, y: -6 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-blue-900/50 transition-shadow duration-300">
                    <motion.img
                      className="h-32 w-full object-contain"
                      src={course.image.url}
                      alt=""
                      whileHover={{ scale: 1.08 }}
                      transition={{ duration: 0.4 }}
                    />
                    <div className="p-6 text-center">
                      <h2 className="text-xl font-bold text-white">{course.title}</h2>
                      <motion.button
                        className="mt-4 bg-orange-500 text-white py-2 px-4 rounded-full hover:bg-blue-500 duration-300"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.92 }}
                      >
                        Enroll Now
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </Slider>
        </motion.section>

        <motion.hr
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ originX: 0 }}
          className="mt-8"
        />

        {/* ── TESTIMONIALS ──────────────────────────────────── */}
        <section className="py-24 px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Student <span className="text-orange-500">Success Stories</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Join thousands of learners who have transformed their careers with CourseHive.
              Here is what our students have to say about their learning experience.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {[
              { name: "Rahul Sharma", role: "Python Developer", review: "The Python course was life-changing! The way concepts like decorators were explained made it so simple.", rating: 5, img: "https://randomuser.me/api/portraits/men/32.jpg" },
              { name: "Ananya Iyer", role: "Full Stack Dev", review: "Incredible React content. I went from knowing nothing to building complex apps in just 4 weeks.", rating: 5, img: "https://randomuser.me/api/portraits/women/44.jpg" },
              { name: "Vikram Singh", role: "Software Engineer", review: "Deep dive into Java was exactly what I needed. The projects were challenging and real-world oriented.", rating: 4, img: "https://randomuser.me/api/portraits/men/67.jpg" },
              { name: "Priya Patel", role: "Frontend Lead", review: "The best platform for mastering C++. The memory management modules were exceptionally well-structured.", rating: 5, img: "https://randomuser.me/api/portraits/women/12.jpg" },
              { name: "Amit Verma", role: "Data Scientist", review: "I learned data analysis with Python here. The support team is also very responsive to doubts.", rating: 5, img: "https://randomuser.me/api/portraits/men/45.jpg" },
              { name: "Sneha Roy", role: "Backend Developer", review: "The Node.js masterclass was phenomenal. I finally understood how asynchronous programming works under the hood.", rating: 4, img: "https://randomuser.me/api/portraits/women/22.jpg" },
              { name: "Arjun Gupta", role: "UI Designer", review: "Even as a designer, learning HTML/CSS basics here helped me collaborate better with developers.", rating: 5, img: "https://randomuser.me/api/portraits/men/85.jpg" },
              { name: "Meera Das", role: "Student", review: "Started with C language. It's the perfect foundation for any beginner looking to enter tech.", rating: 5, img: "https://randomuser.me/api/portraits/women/68.jpg" },
            ].map((review, i) => (
              <motion.div
                key={i}
                variants={cardVariant}
                whileHover={{
                  scale: 1.05,
                  y: -10,
                  boxShadow: "0 0 30px rgba(249, 115, 22, 0.2)"
                }}
                className="glass-card p-6 rounded-3xl relative overflow-hidden group border border-white/5"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={review.img}
                    alt={review.name}
                    className="w-14 h-14 rounded-full border-2 border-orange-500/30 group-hover:border-orange-500 transition-colors"
                  />
                  <div>
                    <h3 className="font-bold text-white text-lg leading-tight">{review.name}</h3>
                    <p className="text-orange-500 text-xs font-medium">{review.role}</p>
                  </div>
                </div>

                <p className="text-gray-400 text-sm leading-relaxed mb-4 italic">
                  "{review.review}"
                </p>

                <div className="flex gap-1 text-yellow-500">
                  {Array.from({ length: 5 }).map((_, starIdx) => (
                    <span key={starIdx}>{starIdx < review.rating ? "★" : "☆"}</span>
                  ))}
                </div>

                {/* Decorative element */}
                <div className="absolute -bottom-2 -right-2 text-white/5 text-6xl font-serif pointer-events-none group-hover:text-orange-500/10 transition-colors">
                  "
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <motion.hr
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ originX: 0 }}
          className="mt-8"
        />

        {/* ── FOOTER ─────────────────────────────────────────── */}
        <motion.footer
          className="my-8 pb-12"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Brand */}
            <motion.div
              className="flex flex-col items-center md:items-start"
              variants={fadeUp}
              custom={0}
            >
              <motion.div
                className="flex items-center cursor-pointer select-none"
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.25 }}
              >
                <span
                  className="text-xl font-black tracking-tight text-white"
                  style={{ fontFamily: "'Inter','Segoe UI',sans-serif", letterSpacing: "-0.5px" }}
                >
                  Course
                </span>
                <motion.span
                  className="text-xl font-black tracking-tight text-orange-500"
                  style={{ fontFamily: "'Inter','Segoe UI',sans-serif", letterSpacing: "-0.5px" }}
                  animate={{
                    filter: [
                      "drop-shadow(0 0 3px rgba(249,115,22,0.3))",
                      "drop-shadow(0 0 10px rgba(249,115,22,0.8))",
                      "drop-shadow(0 0 3px rgba(249,115,22,0.3))",
                    ],
                  }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  Hive
                </motion.span>
              </motion.div>
              <div className="mt-3 md:ml-8">
                <p className="mb-2">Follow Us</p>
                <div className="flex space-x-4">
                  {[
                    { Icon: FaFacebook, hover: "text-blue-400", url: "https://www.facebook.com" },
                    { Icon: FaInstagram, hover: "text-pink-500", url: "https://www.instagram.com" },
                    { Icon: FaTwitter, hover: "text-sky-400", url: "https://www.twitter.com" },
                  ].map(({ Icon, hover, url }, i) => (
                    <motion.a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.3, y: -4 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <Icon className={`text-2xl transition-colors duration-300 hover:${hover}`} />
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Connects */}
            <motion.div
              className="items-center flex flex-col"
              variants={fadeUp}
              custom={0.15}
            >
              <h3 className="text-lg font-semibold mb-4">Connects</h3>
              <ul className="space-y-2 text-gray-400">
                {["Youtube- learn coding", "Telegram- learn coding", "Github- learn coding"].map(
                  (item, i) => (
                    <motion.li
                      key={i}
                      className="hover:text-white cursor-pointer duration-300"
                      whileHover={{ x: 6, color: "#ffffff" }}
                    >
                      {item}
                    </motion.li>
                  )
                )}
              </ul>
            </motion.div>

            {/* Copyrights */}
            <motion.div
              className="items-center flex flex-col"
              variants={fadeUp}
              custom={0.3}
            >
              <h3 className="text-lg font-semibold mb-4">Copyrights &#169; 2024</h3>
              <ul className="space-y-2 text-gray-400">
                {["Terms & Condition", "Privacy Policy", "Refund & Cancellation"].map(
                  (item, i) => (
                    <motion.li
                      key={i}
                      className="hover:text-white cursor-pointer duration-300"
                      whileHover={{ x: 6, color: "#ffffff" }}
                    >
                      {item}
                    </motion.li>
                  )
                )}
              </ul>
            </motion.div>

          </div>
        </motion.footer>

      </div>
    </div>
  );
}

export default Home;