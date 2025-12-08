"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, BarChart3, Target, TrendingUp, CheckCircle2, Sparkles } from "lucide-react";
import emailjs from "@emailjs/browser";

export default function DiagnosticForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_dm26ec6",
        "template_avf8f0f",
        e.target,
        "lbYksoLilwFR_9FNF"
      )
      .then(
        (result) => {
          console.log(result.text);
          setSubmitted(true);
        },
        (error) => {
          console.error(error.text);
          alert("Something went wrong. Please try again later.");
        }
      );
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 sm:px-6 py-12 sm:py-20">
      <div className="max-w-5xl mx-auto">

        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4" />
            100% Free - No Credit Card Required
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight">
            Discover Where Your Student <span className="text-blue-600">Really Stands</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Get a personalized diagnostic test tailored to your student's grade level — and receive a detailed report showing their strengths, gaps, and how they compare to peers.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid sm:grid-cols-3 gap-6 mb-12">
          {[{
            icon: BarChart3,
            title: "See How They Compare",
            description: "Understand where your student ranks against peers in their grade and get percentile scores.",
            color: "bg-blue-500"
          },{
            icon: Target,
            title: "Identify Key Gaps",
            description: "Pinpoint exactly which concepts need reinforcement to build a stronger foundation.",
            color: "bg-green-500"
          },{
            icon: TrendingUp,
            title: "Get the Help They Need",
            description: "Receive a personalized action plan with targeted resources and next steps for improvement.",
            color: "bg-purple-500"
          }].map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow border border-gray-200 transition-all hover:shadow-md">
              <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center mb-4`}>
                <item.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Form Section */}
        {!submitted ? (
          <div className="bg-white rounded-3xl shadow border border-gray-200 overflow-hidden">
            <div className="bg-gray-100 px-8 py-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Request Your Free Diagnostic Test</h2>
              <p className="text-gray-700 mt-2">Takes less than 2 minutes • Results delivered instantly</p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block font-semibold text-gray-900 mb-2" htmlFor="name">Student's Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-gray-500 focus:ring-1 focus:ring-gray-300 outline-none"
                    placeholder="e.g. Jamie Smith"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-900 mb-2" htmlFor="grade">Current Grade Level</label>
                  <select
                    id="grade"
                    name="grade"
                    required
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-gray-500 focus:ring-1 focus:ring-gray-300 outline-none"
                  >
                    <option value="">Select grade</option>
                    {Array.from({ length: 7 }, (_, i) => <option key={i}>{i+6}th Grade</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-900 mb-2" htmlFor="currentClass">Current Math Class</label>
                <input
                  type="text"
                  id="currentClass"
                  name="currentClass"
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-gray-500 focus:ring-1 focus:ring-gray-300 outline-none"
                  placeholder="e.g. Algebra I, Geometry, Precalculus"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-900 mb-2" htmlFor="email">Parent/Student Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-gray-500 focus:ring-1 focus:ring-gray-300 outline-none"
                  placeholder="you@example.com"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold text-lg py-4 px-8 rounded-xl flex items-center justify-center gap-3 transition-all shadow-md hover:shadow-lg"
              >
                Get My Free Diagnostic Test
                <ArrowRight className="w-5 h-5" />
              </button>

              <p className="text-center text-sm text-gray-500">We respect your privacy. Your information will never be shared.</p>
            </form>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow border border-gray-200 overflow-hidden">
            <div className="bg-gray-100 px-8 py-12 text-center">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-3">You're All Set!</h2>
              <p className="text-gray-700 text-lg max-w-xl mx-auto">
                Your personalized diagnostic test has been sent to your email. Check your inbox (and spam folder) within the next few minutes.
              </p>
            </div>
            <div className="p-8 text-center">
              <p className="text-gray-600 mb-6">
                We'll follow up with a detailed report and personalized action plan once the test is completed.
              </p>
              <Link
                href="/worksheets/free-worksheets"
                className="inline-flex items-center gap-2 text-gray-900 hover:text-gray-700 font-semibold"
              >
                Browse Free Worksheets
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Trust Signals */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm mb-4">Trusted by parents and students nationwide</p>
          <div className="flex justify-center gap-8 text-gray-400 text-xs">
            {["No Credit Card","Instant Delivery","Privacy Protected"].map((label, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* CTA Outside Container */}
      <div className="max-w-5xl mx-auto mt-16 px-4 sm:px-6">
        <div className="bg-gray-900 rounded-3xl shadow-2xl p-8 sm:p-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Want More Than a Test?</h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Get tailored help from our expert tutors — trusted by hundreds of students to achieve their math goals.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-white text-gray-900 font-bold text-lg py-4 px-8 rounded-xl hover:bg-gray-100 transition-all shadow-md hover:shadow-lg"
          >
            Contact Us for Personalized Tutoring
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </main>
  );
}
