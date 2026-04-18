import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiUsers, FiTrash2, FiSearch, FiArrowLeft, FiUserCheck, FiMail } from "react-icons/fi";
import toast from "react-hot-toast";
import axios from "axios";

const pageVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const BACKEND_URL = "http://localhost:4001/api/v1/admin";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const adminStr = localStorage.getItem("admin");
    const admin = adminStr && adminStr !== "undefined" ? JSON.parse(adminStr) : null;
    if (!admin) {
      toast.error("Please login to admin dashboard");
      navigate("/admin/login");
      return;
    }

    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const response = await axios.get(`${BACKEND_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setUsers(response.data.users || []);
        console.log("Fetched users:", response.data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to fetch users from system");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  const deleteUser = (email) => {
    // Note: In a real system, you'd call a backend delete endpoint here
    const updatedUsers = users.filter((user) => user.email !== email);
    setUsers(updatedUsers);
    toast.success("User removed from view (Backend delete not yet implemented)!");
  };

  const filteredUsers = users.filter(
    (user) =>
      (user.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      className="min-h-screen bg-[#020617] text-white px-8 pt-10 pb-20"
      variants={pageVariant}
      initial="hidden"
      animate="visible"
    >
      {/* ── Top Navigation / Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <Link to="/admin/dashboard">
            <motion.div
              className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-3 transition-colors duration-200 cursor-pointer w-fit"
              whileHover={{ x: -4 }}
            >
              <FiArrowLeft /> Back to Dashboard
            </motion.div>
          </Link>
          <h1 className="text-4xl font-black tracking-tight flex items-baseline gap-3">
            Manage <span className="text-orange-500">Users</span>
          </h1>
          <p className="text-gray-400 mt-2 text-sm font-medium opacity-80">
            Review and manage registered students in your system.
          </p>
        </div>

        {/* Total Users Badge */}
        <motion.div
          className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-orange-500/10 border border-orange-500/20 shadow-lg shadow-orange-500/5 group"
          whileHover={{ scale: 1.05 }}
        >
          <div className="p-2 rounded-lg bg-orange-500/20 text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-all">
            <FiUsers className="text-xl" />
          </div>
          <div>
            <p className="text-[10px] font-black text-orange-500/60 uppercase tracking-widest leading-none mb-1">Total Users</p>
            <p className="text-2xl font-black text-white leading-none tabular-nums">{users.length}</p>
          </div>
        </motion.div>
      </div>

      {/* ── Search Bar ── */}
      <div className="relative max-w-md mb-8 group">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-orange-500 transition-colors z-10" />
        <input
          type="text"
          placeholder="Search by name or email..."
          className="w-full bg-[#0f172a]/50 border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-sm focus:outline-none focus:border-orange-500/50 focus:bg-[#0f172a]/80 transition-all backdrop-blur-md relative"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* ── Users Table ── */}
      <div className="rounded-[2rem] overflow-hidden border border-white/5 bg-[#0f172a]/30 backdrop-blur-xl shadow-2xl relative">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-center gap-4">
            <motion.div
              className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <p className="text-gray-400 font-medium animate-pulse">Synchronizing user database...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center text-4xl mb-6">
              {searchTerm ? "🔍" : "📫"}
            </div>
            <h3 className="text-2xl font-black text-white tracking-tight">
              {searchTerm ? "No results found" : "No registered students"}
            </h3>
            <p className="text-gray-400 mt-2 max-w-xs mx-auto">
              {searchTerm 
                ? `We couldn't find any users matching "${searchTerm}". Try a different term.`
                : "It looks like there are no registered students in the system yet."}
            </p>
            {!searchTerm && (
              <Link to="/admin/dashboard">
                <button className="mt-8 px-8 py-3 rounded-xl bg-orange-500 text-white font-bold text-sm hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/25">
                  RETURN TO DASHBOARD
                </button>
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 uppercase tracking-widest text-[12px] font-bold text-white bg-[#0f172a]">
                  <th className="px-8 py-6">MEMBER NAME</th>
                  <th className="px-8 py-6">CONTACT EMAIL</th>
                  <th className="px-8 py-6">ACCOUNT ROLE</th>
                  <th className="px-8 py-6 text-right">DELETE ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <AnimatePresence mode="popLayout">
                  {filteredUsers.map((user, idx) => (
                    <motion.tr
                      key={user.email || idx}
                      layout
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20, scale: 0.95 }}
                      className="group hover:bg-white/[0.04] transition-colors"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-500/5 border border-orange-500/20 flex items-center justify-center text-orange-400 font-bold">
                            {(user.name || "U").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-white font-bold tracking-tight">{user.name || "Unknown User"}</p>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Student ID: #{(1000 + idx).toString()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-gray-300">
                          <FiMail className="opacity-40" />
                          <span className="text-sm font-medium">{user.email}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest">
                          <FiUserCheck className="text-xs" />
                          {user.role || "Student"}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <motion.button
                          onClick={() => deleteUser(user.email)}
                          className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          whileTap={{ scale: 0.9 }}
                          title="Delete User"
                        >
                          <FiTrash2 className="text-lg" />
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Decorative ambient highlights */}
      <div className="fixed top-1/4 -right-1/4 w-[600px] h-[600px] bg-orange-600/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="fixed -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none -z-10" />
    </motion.div>
  );
}

export default ManageUsers;
