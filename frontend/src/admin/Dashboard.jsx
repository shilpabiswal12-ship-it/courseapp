import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../public/logo.jpg";
import toast from "react-hot-toast";
import axios from "axios";
import { BACKEND_URL } from "../utils/utils";

function Dashboard() {
  const navigate = useNavigate();
  const adminStr = localStorage.getItem("admin");
  const admin = adminStr && adminStr !== "undefined" ? JSON.parse(adminStr) : null;

  React.useEffect(() => {
    if (!admin) {
      navigate("/admin/login");
    }
  }, [admin, navigate]);

  if (!admin) return null;

   const handleLogout = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4001/api/v1/admin/logout",
        {
          withCredentials: true,
        }
      );

      toast.success(response.data.message);
      localStorage.removeItem("admin");
      localStorage.removeItem("adminToken");
    } catch (error) {
      console.log("Error in logging out", error);
      toast.error(error.response?.data?.errors || "Error in logging out");
    }
  };
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-gray-100 p-8 flex flex-col shadow-lg">
        <div className="flex flex-col items-center mb-12">
          <img 
            src={logo} 
            alt="Profile" 
            className="rounded-full h-24 w-24 object-cover border-4 border-white shadow-sm" 
          />
          <h2 className="text-xl font-bold mt-6 text-gray-800">I'm Admin</h2>
        </div>

        <nav className="flex flex-col space-y-5">
          <Link to="/admin/our-courses" className="w-full">
            <button className="w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded-lg font-semibold transition duration-200">
              Our Courses
            </button>
          </Link>
          <Link to="/admin/create-course" className="w-full">
            <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition duration-200">
              Create Course
            </button>
          </Link>
          <Link to="/" className="w-full">
            <button className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold transition duration-200">
              Home
            </button>
          </Link>
          <Link to="/admin/login" className="w-full">
            <button
              onClick={handleLogout}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-lg font-semibold transition duration-200"
            >
              Logout
            </button>
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center bg-white">
        <h1 className="text-4xl font-bold text-gray-400">Welcome!!!</h1>
      </div>
    </div>
  );
}
export default Dashboard;

 