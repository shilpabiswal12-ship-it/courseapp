import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FiCreditCard, FiCheckCircle, FiShield, FiArrowLeft, FiShoppingCart, FiInfo } from "react-icons/fi";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

function Buy() {
  const { courseId } = useParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [course, setCourse] = useState({});
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState("");

  const userStr = localStorage.getItem("user");
  const user = userStr && userStr !== "undefined" ? JSON.parse(userStr) : null;

  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState("")

  useEffect(() => {
    const fetchBuyCourseData = async () => {
      if (!user) {
        navigate("/login");
        return;
      }
      try {
        const response = await axios.post(`http://localhost:4001/api/v1/course/buy/${courseId}`, {}, {
          withCredentials: true,
        });
        setCourse(response.data.course)
        setClientSecret(response.data.clientSecret)
        setLoading(false);
      } catch (error) {
        setLoading(false);
        if (error?.response?.status === 400) {
          setError("You have already purchased this course");
          // navigate("/purchases"); // Let user see the message first
        } else {
          setError(error?.response?.data?.errors || "Error fetching course data");
        }
      }
    }
    fetchBuyCourseData()
  }, [courseId])

  const handlePurchase = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      console.log("Stripe or Element not found")
      return;
    }

    setLoading(true)
    const card = elements.getElement(CardElement);

    if (card == null) {
      setLoading(false)
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card,
    });

    if (error) {
      setLoading(false)
      setCardError(error.message)
      return;
    }

    if (!clientSecret) {
      setLoading(false)
      return
    }

    const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: card,
          billing_details: {
            name: user?.firstName,
            email: user?.email,
          },
        },
      },
    );

    if (confirmError) {
      setCardError(confirmError.message)
    } else if (paymentIntent.status === "succeeded") {
      const paymentInfo = {
        email: user?.email,
        userId: user?._id,
        courseId: courseId,
        paymentId: paymentIntent.id,
        amount: paymentIntent.amount,
        status: paymentIntent.status,
      };
      
      await axios.post("http://localhost:4001/api/v1/order", paymentInfo, {
        withCredentials: true,
      })
      .then((response) => {
        toast.success("Payment Successful")
        navigate("/purchases");
      })
      .catch((error) => {
        toast.error("Error finalizing order, please contact support.");
      })
    }
    setLoading(false)
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] py-12 px-6 overflow-x-hidden relative">
      {/* Background blobs */}
      <div className="fixed top-0 -left-20 w-96 h-96 bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 -right-20 w-96 h-96 bg-orange-600/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Back to courses */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="max-w-5xl mx-auto mb-8"
      >
        <Link to="/courses" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors group">
          <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold text-sm">Back to Courses</span>
        </Link>
      </motion.div>

      <AnimatePresence mode="wait">
        {error ? (
          <motion.div 
            key="error"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="max-w-md mx-auto mt-20"
          >
            <div className="glass-card p-8 rounded-[2.5rem] border border-red-500/20 bg-white/70 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 text-3xl mx-auto mb-6">
                <FiInfo />
              </div>
              <h2 className="text-xl font-black mb-3 text-slate-900">Oops!</h2>
              <p className="text-slate-600 mb-8">{error}</p>
              <Link
                to="/purchases"
                className="w-full bg-orange-500 text-white py-4 rounded-2xl font-black shadow-lg shadow-orange-500/20 hover:scale-[1.02] transition-transform flex items-center justify-center"
              >
                View My Purchases
              </Link>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="content"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-start"
          >
            {/* Purchase Details */}
            <motion.div variants={itemVariants} className="space-y-6">
              <header>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2 text-slate-900">
                  Complete Your <span className="text-orange-500">Purchase</span>
                </h1>
                <p className="text-slate-500 font-medium">Secure checkout for your next learning journey.</p>
              </header>

              <div className="glass-card p-8 rounded-[2.5rem] border border-white space-y-6 bg-white/50 backdrop-blur-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 text-xl font-black">
                    <FiShoppingCart />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-400 text-xs uppercase tracking-widest">Selected Course</h3>
                    <p className="text-slate-900 text-xl font-black tracking-tight">{course.title || "Loading..."}</p>
                  </div>
                </div>

                <hr className="border-slate-100" />

                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-medium">Original Price</span>
                    <span className="text-slate-400 line-through">₹3,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-700 font-bold">Total Amount</span>
                    <span className="text-3xl font-black text-orange-600 tracking-tighter">₹{course.price || "0"}</span>
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-start gap-3">
                  <FiShield className="text-emerald-600 text-xl shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest">Secure Payment</p>
                    <p className="text-xs text-emerald-600/80 mt-1 leading-relaxed">Your transaction is protected with 256-bit SSL encryption. We never store your card details.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Payment Form */}
            <motion.div variants={itemVariants}>
              <div className="glass-card p-8 md:p-10 rounded-[2.5rem] border border-white bg-white/80 shadow-2xl relative overflow-hidden">
                {/* Visual decoration */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-500/5 rounded-full blur-3xl" />

                <h2 className="text-2xl font-black mb-1 flex items-center gap-3 text-slate-900">
                  <FiCreditCard className="text-orange-500" /> Payment Info
                </h2>
                <p className="text-slate-400 text-sm mb-8 font-medium">Powered by Stripe</p>

                <form onSubmit={handlePurchase} className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Card Details</label>
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 focus-within:border-orange-500/50 transition-all shadow-inner">
                      <CardElement
                        options={{
                          style: {
                            base: {
                              fontSize: "16px",
                              color: "#0f172a",
                              fontFamily: "'Inter', sans-serif",
                              "::placeholder": { color: "#94a3b8" },
                            },
                          },
                        }}
                      />
                    </div>
                  </div>

                  <AnimatePresence>
                    {cardError && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-bold"
                      >
                        {cardError}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={!stripe || loading}
                    className={`w-full py-5 rounded-2xl font-black text-white text-lg shadow-xl flex items-center justify-center gap-3 transition-all relative overflow-hidden ${
                      loading ? "bg-slate-300 pointer-events-none" : "bg-gradient-to-r from-orange-500 to-orange-600 shadow-orange-500/20"
                    }`}
                  >
                    {!loading && (
                      <motion.div
                        className="absolute inset-0 bg-white/10"
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      />
                    )}
                    {loading ? (
                      <>
                        <motion.div
                          className="w-5 h-5 border-2 border-slate-400 border-t-slate-600 rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                        />
                        <span className="text-slate-600">Processing...</span>
                      </>
                    ) : (
                      <>
                        <FiCheckCircle /> Pay ₹{course.price}
                      </>
                    )}
                  </motion.button>
                </form>

                <div className="mt-8 flex items-center justify-center gap-6 opacity-60 grayscale hover:grayscale-0 transition-all">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4" alt="Visa" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-6" alt="Mastercard" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" className="h-4" alt="Stripe" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Buy;