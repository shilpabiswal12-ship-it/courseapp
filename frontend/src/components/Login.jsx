import React, { useState } from 'react';
import axios from "axios";
import logo from "../../public/logo.jpg";
import { Link, useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import { motion } from "framer-motion";



function Login() {


  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:4001/api/v1/user/login",
        {

          email,
          password,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Login successfull: ", response.data);
      toast.success(response.data.message);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/");
    } catch (error) {
      if (error.response) {
        console.log("BACKEND ERROR:", error.response.data);
        setErrorMessage(error.response.data.errors || "Login failed!!!");
        alert(error.response.data.errors)
      }

    }

  };


  return (
    <div className='relative min-h-screen bg-[#f8fafc] overflow-hidden'>
      <div className="animated-bg" />
      
      <div className="min-h-screen container mx-auto flex items-center justify-center text-[#0f172a] px-4">
        <header className="absolute top-0 left-0 w-full flex justify-between items-center p-6 md:p-10">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <img src={logo} alt="logo" className="w-12 h-12 rounded-2xl shadow-lg shadow-orange-500/10" />
            <Link to={"/"} className="text-2xl font-black text-[#0f172a] tracking-tight">
              Course<span className="text-orange-500">Hive</span>
            </Link>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-4"
          >
            <Link to={"/signup"}
              className="font-bold text-sm text-slate-600 hover:text-slate-900 transition-colors">
              Signup
            </Link>
            <Link to={"/courses"}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-6 rounded-xl shadow-lg shadow-orange-500/20 transition-all text-sm">
              Explore
            </Link>
          </motion.div>
        </header>

        <motion.div 
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="glass-card p-8 md:p-12 rounded-[2.5rem] shadow-2xl w-full max-w-[480px] mt-10 relative overflow-hidden bg-white/70 backdrop-blur-2xl border border-white"
        >
          {/* Subtle glow artifact */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center mb-10">
            <h2 className="text-3xl font-black mb-2 text-slate-900 tracking-tight">
              Welcome Back
            </h2>
            <p className="text-slate-500 font-medium text-sm leading-relaxed">
              Log in to your account to continue your learning journey.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 rounded-2xl bg-white border border-slate-200 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all outline-none text-slate-900 shadow-sm"
                placeholder="name@email.com"
                required />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-4 rounded-2xl bg-white border border-slate-200 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all outline-none text-slate-900 shadow-sm"
                  placeholder="••••••••"
                  required />
              </div>
            </div>

            {errorMessage && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="text-red-600 text-sm font-bold bg-red-50 p-3 rounded-xl border border-red-100 text-center"
              >
                {errorMessage}
              </motion.div>
            )}

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="Submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-4 px-6 rounded-2xl shadow-xl shadow-orange-500/20 transition-all text-base tracking-tight"
            >
              Log In
            </motion.button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 text-center">
            <p className="text-slate-500 text-sm font-medium">
              Don't have an account? {" "}
              <Link to="/signup" className="text-orange-600 font-black hover:underline underline-offset-4">
                Create one for free
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;
