'use client';

import { useState } from "react";
import { db } from "../../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import Link from "next/link";
import { Calendar, Gift, Send, Mail, User, CheckCircle, Sparkles, MessageSquare } from "lucide-react";
import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";

export default function ContactClient() {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [touched, setTouched] = useState({ name: false, email: false });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Mark all fields as touched
    setTouched({ name: true, email: true });

    if (!formData.name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!formData.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!validateEmail(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setSending(true);

    try {
      // Save to Firestore
      await addDoc(collection(db, "contactMessages"), {
        ...formData,
        timestamp: Timestamp.now(),
      });

      // Create a temporary form element for EmailJS
      const tempForm = document.createElement('div');
      tempForm.innerHTML = `
        <input type="hidden" name="user_name" value="${formData.name}" />
        <input type="hidden" name="user_email" value="${formData.email}" />
      `;

      await emailjs.sendForm(
        "service_dm26ec6",
        "template_avf8f0f",
        tempForm,
        "lbYksoLilwFR_9FNF"
      );

      setSubmitted(true);
      setFormData({ name: "", email: "" });
      setTouched({ name: false, email: false });
    } catch (err) {
      console.error(err);
      setError("There was a problem submitting your information. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const isEmailValid = !touched.email || validateEmail(formData.email);
  const isNameValid = !touched.name || formData.name.trim().length > 0;

  return (
    <section className="min-h-screen px-6 py-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-300 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white mb-6">
            <Sparkles className="w-5 h-5" />
            <span className="font-semibold">Transform Your Child's Learning Journey</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold mb-6 text-white">
            Get Started Today
          </h1>
          <p className="text-xl sm:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            Personalized math and science tutoring that builds confidence and delivers real results
          </p>

          {/* Free Trial Banner */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-3xl p-8 mb-8 shadow-2xl max-w-2xl mx-auto transform hover:scale-105 transition-transform"
          >
            <div className="flex items-center justify-center gap-3 mb-3">
              <Gift className="w-10 h-10" />
              <h2 className="text-3xl font-bold">Free Trial Available!</h2>
            </div>
            <p className="text-lg sm:text-xl">Try a session risk-free to see if it's the perfect fit for your child</p>
          </motion.div>
        </motion.div>

        {submitted ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-2xl mx-auto"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h3 className="text-3xl font-bold mb-4 text-gray-900">Thank You!</h3>
            <p className="text-gray-700 text-lg mb-8 leading-relaxed">
              Your message has been received! We'll reach out within 24 hours to schedule your free trial session and answer any questions you have.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link 
                href="/"
                className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg hover:shadow-xl"
              >
                Back to Home
              </Link>
              <Link 
                href="/worksheets/free-worksheets"
                className="bg-gray-100 text-gray-700 px-8 py-4 rounded-xl font-bold hover:bg-gray-200 transition"
              >
                Browse Free Worksheets
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side - Benefits */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="space-y-6"
            >
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 text-white border border-white/20">
                <h3 className="text-2xl font-bold mb-6">What You'll Get:</h3>
                <ul className="space-y-4">
                  {[
                    "Personalized 1-on-1 or small group sessions",
                    "Custom learning plan tailored to your child's needs",
                    "Flexible scheduling that works with your family",
                    "Progress tracking and regular updates",
                    "Access to premium worksheets and resources",
                    "Proven methods from a 99th percentile achiever"
                  ].map((benefit, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + idx * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle className="w-6 h-6 text-green-300 flex-shrink-0 mt-0.5" />
                      <span className="text-lg">{benefit}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 text-white border border-white/20">
                <MessageSquare className="w-10 h-10 mb-3 text-yellow-300" />
                <p className="text-lg italic">
                  "My daughter went from struggling to thriving in just 8 weeks. Best decision we made!"
                </p>
                <p className="mt-2 font-semibold">- Sarah M., Parent</p>
              </div>
            </motion.div>

            {/* Right Side - Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="bg-white rounded-3xl shadow-2xl p-8 md:p-12"
            >
              <h2 className="text-3xl font-bold mb-2 text-gray-900">
                Request Your Free Trial
              </h2>
              <p className="text-gray-600 mb-8">Fill out the form below and we'll be in touch soon!</p>

              <div className="space-y-6">
                <div>
                  <label className="block mb-2 font-semibold text-gray-700 flex items-center gap-2" htmlFor="name">
                    <User className="w-5 h-5 text-indigo-600" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    placeholder="Enter your name"
                    className={`w-full px-4 py-4 border-2 rounded-xl focus:outline-none transition ${
                      !isNameValid
                        ? 'border-red-300 focus:border-red-500'
                        : 'border-gray-300 focus:border-indigo-500'
                    }`}
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={() => handleBlur('name')}
                  />
                  {!isNameValid && (
                    <p className="mt-2 text-sm text-red-600">Please enter your name</p>
                  )}
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-gray-700 flex items-center gap-2" htmlFor="email">
                    <Mail className="w-5 h-5 text-indigo-600" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    placeholder="your.email@example.com"
                    className={`w-full px-4 py-4 border-2 rounded-xl focus:outline-none transition ${
                      !isEmailValid
                        ? 'border-red-300 focus:border-red-500'
                        : 'border-gray-300 focus:border-indigo-500'
                    }`}
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={() => handleBlur('email')}
                  />
                  {!isEmailValid && (
                    <p className="mt-2 text-sm text-red-600">Please enter a valid email address</p>
                  )}
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2"
                  >
                    <span className="font-semibold">⚠️</span>
                    {error}
                  </motion.div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={sending || !isNameValid || !isEmailValid}
                  className={`w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-5 rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-lg hover:shadow-xl flex items-center justify-center gap-3 ${
                    sending || !isNameValid || !isEmailValid ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {sending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Request Free Trial Session
                    </>
                  )}
                </button>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-200 text-center">
                <p className="text-gray-600 mb-4 font-semibold">
                  Prefer to schedule directly?
                </p>
                <Link 
                  href="/booking"
                  className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
                >
                  <Calendar className="w-5 h-5" />
                  View Available Times
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}