'use client';

import { useState, useRef } from "react";
import { db } from "../../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import Link from "next/link";
import { Calendar, Send, CheckCircle, ChevronRight } from "lucide-react";
import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";

export default function ContactClient() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const formRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = formRef.current;

    const user_name = form.user_name.value.trim();
    const user_email = form.user_email.value.trim();
    const grade = form.grade.value;
    const currentClass = form.currentClass.value.trim();
    const struggles = form.struggles.value.trim();

    if (!user_name || !user_email || !grade) {
      setError("Student name, email, and grade level are required.");
      return;
    }

    setSending(true);
    try {
      await addDoc(collection(db, "contactMessages"), {
        name: user_name,
        email: user_email,
        grade,
        currentClass,
        struggles,
        timestamp: Timestamp.now(),
      });

      await emailjs.sendForm(
        "service_dm26ec6",
        "template_avf8f0f",
        form,
        "lbYksoLilwFR_9FNF"
      );

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError("Submission failed. Please try again or contact us directly.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="min-h-screen px-6 py-24 bg-white text-slate-900">
      <div className="max-w-7xl mx-auto">

        <div className="mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-5xl sm:text-7xl font-black tracking-tighter mb-6 text-slate-950">
              Get Your Free <span className="text-blue-600">Diagnostic Test.</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl leading-relaxed font-medium">
              We'll send a personalized math diagnostic based on your student's grade level — completely free. 
              See exactly where they stand and what to work on next.
            </p>
          </motion.div>
        </div>

        {submitted ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-slate-50 border border-slate-200 rounded-3xl p-16 text-center max-w-3xl">
            <CheckCircle className="w-16 h-16 text-blue-600 mx-auto mb-6" />
            <h3 className="text-3xl font-bold mb-4">You're all set!</h3>
            <p className="text-slate-600 text-lg mb-8 font-medium">
              Check your inbox — the diagnostic test is on its way. We'll follow up with results and next steps once it's completed.
            </p>
            <Link href="/" className="inline-flex items-center gap-2 bg-slate-950 text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm shadow-xl">
              Back to Home <ChevronRight size={18} />
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

            {/* Left: Why it matters */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-6">
                {[
                  { emoji: "📊", title: "See Where They Stand", desc: "Understand your student's current level compared to grade-level expectations." },
                  { emoji: "🎯", title: "Find the Gaps", desc: "Pinpoint exactly which concepts need attention so tutoring is focused and effective." },
                  { emoji: "📝", title: "Get a Custom Plan", desc: "Receive a personalized action plan based on the results — no guesswork." },
                ].map((item, i) => (
                  <div key={i} className="flex gap-5 items-start">
                    <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl">
                      {item.emoji}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-slate-950">{item.title}</h4>
                      <p className="text-slate-500 font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-8 bg-blue-600 rounded-[2rem] text-white shadow-xl shadow-blue-100">
                <p className="text-sm font-bold uppercase tracking-widest mb-3 opacity-80">100% Free</p>
                <p className="text-xl font-semibold leading-relaxed">
                  No credit card. No commitment. Just a clear picture of where your student is and how we can help.
                </p>
              </div>
            </div>

            {/* Right: Form */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-[3rem] p-8 md:p-14 shadow-sm">
              <h2 className="text-3xl font-bold mb-2 text-slate-950">Request the Diagnostic</h2>
              <p className="text-slate-500 font-medium mb-10">Takes less than 2 minutes. Results delivered to your inbox.</p>

              <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
                <input type="hidden" name="title" value="Free Diagnostic Test Request" />
                <input type="hidden" name="time" value={new Date().toLocaleString()} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                      Student's Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="user_name"
                      className="w-full p-4 bg-white rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-0 outline-none transition font-medium"
                      placeholder="e.g. Jamie Smith"
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                      Grade Level <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="grade"
                      required
                      className="w-full p-4 bg-white rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-0 outline-none transition font-medium"
                    >
                      <option value="">Select grade</option>
                      {Array.from({ length: 7 }, (_, i) => (
                        <option key={i} value={`${i + 6}th Grade`}>{i + 6}th Grade</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                    Parent / Student Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="user_email"
                    type="email"
                    className="w-full p-4 bg-white rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-0 outline-none transition font-medium"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Current Math Class</label>
                  <input
                    name="currentClass"
                    className="w-full p-4 bg-white rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-0 outline-none transition font-medium"
                    placeholder="e.g. Algebra I, Geometry, Pre-Calc..."
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">What are they struggling with?</label>
                  <textarea
                    name="struggles"
                    rows={2}
                    className="w-full p-4 bg-white rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-0 outline-none transition font-medium"
                    placeholder="e.g. Word problems, fractions, test anxiety..."
                  />
                </div>

                {error && (
                  <p className="text-red-600 font-bold text-sm bg-red-50 p-4 rounded-xl border border-red-100">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:bg-slate-950 disabled:opacity-60 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-blue-200 group"
                >
                  {sending ? "Sending..." : "Get My Free Diagnostic"}
                  <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>

                <p className="text-center text-xs text-slate-400 font-medium">We respect your privacy. Your info is never shared.</p>
              </form>

              <div className="mt-10 pt-10 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Prefer to book directly?</p>
                <Link href="/booking" className="flex items-center gap-2 bg-slate-950 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-600 transition-colors shadow-lg">
                  <Calendar size={14} /> Book a Session
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}