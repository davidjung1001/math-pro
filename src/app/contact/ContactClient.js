'use client';

import { useState } from "react";
import { db } from "../../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import Link from "next/link";
import { Calendar, Gift, Send } from "lucide-react";
import emailjs from "@emailjs/browser";

export default function ContactClient() {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.email) {
      setError("Please fill out all required fields.");
      return;
    }

    setSending(true);

    try {
      // Save to Firestore
      await addDoc(collection(db, "contactMessages"), {
        ...formData,
        timestamp: Timestamp.now(),
      });

      // Send email via EmailJS using hidden inputs
      await emailjs.sendForm(
        "service_dm26ec6",      // Your EmailJS service ID
        "template_avf8f0f",     // Your EmailJS template ID
        e.target,               // The form element
        "lbYksoLilwFR_9FNF"     // Your EmailJS public key
      );

      setSubmitted(true);
      setFormData({ name: "", email: "" });
    } catch (err) {
      console.error(err);
      setError("There was a problem submitting your information. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="min-h-screen px-6 py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-gray-900">Get Started Today</h1>
          <p className="text-xl text-gray-700 mb-6">
            Personalized math and science tutoring that builds confidence and gets results.
          </p>

          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl p-6 mb-8 shadow-lg">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Gift className="w-8 h-8" />
              <h2 className="text-2xl font-bold">Free Trial Available!</h2>
            </div>
            <p className="text-lg">Free trial lessons are offered to see if it is the right fit!</p>
          </div>
        </div>

        {submitted ? (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">Thank You!</h3>
            <p className="text-gray-700 mb-6">
              Your message has been sent! We'll contact you within 24 hours to schedule your free trial session.
            </p>
            <Link 
              href="/"
              className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Back to Home
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">
              Contact for Your Free Trial or Any Questions
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Hidden inputs for EmailJS */}
              <input type="hidden" name="user_name" value={formData.name} />
              <input type="hidden" name="user_email" value={formData.email} />

              <div>
                <label className="block mb-2 font-semibold text-gray-700" htmlFor="name">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none transition"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold text-gray-700" htmlFor="email">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none transition"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              {error && (
                <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={sending}
                className={`w-full bg-indigo-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-indigo-700 transition shadow-lg hover:shadow-xl ${
                  sending ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {sending ? "Sending..." : "Request Free Trial Session"}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-gray-200 text-center">
              <p className="text-gray-600 mb-4">
                Prefer to schedule directly?
              </p>
              <Link 
                href="/booking"
                className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-700 transition"
              >
                <Calendar className="w-5 h-5" />
                View Available Times
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
