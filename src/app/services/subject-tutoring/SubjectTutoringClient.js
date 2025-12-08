"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaCalculator, FaFlask, FaStopwatch, FaArrowLeft } from "react-icons/fa";
import Link from "next/link";

const subjects = [
  {
    title: "Math",
    description:
      "From Algebra to AP Calculus and college-level Linear Algebra — get step-by-step guidance and problem-solving strategies from someone who mastered them.",
    icon: <FaCalculator className="text-indigo-500 text-4xl" />,
  },
  {
    title: "Chemistry",
    description:
      "Clear, conceptual explanations for AP Chemistry or general chemistry. Learn how to approach equations, lab questions, and complex reactions with confidence.",
    icon: <FaFlask className="text-green-500 text-4xl" />,
  },
  {
    title: "Physics (Mechanics)",
    description:
      "Focus on AP Physics 1/2 or college mechanics. Master concepts like kinematics, forces, energy, and momentum — master pure Newtonian motion.",
    icon: <FaStopwatch className="text-orange-500 text-4xl" />,
  },
];

export default function SubjectTutoringClient() {
  const router = useRouter();

  return (
    <section className="min-h-screen py-16 px-6 bg-white text-gray-800">
      <div className="max-w-5xl mx-auto">
        {/* Back Arrow */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-indigo-600 hover:text-indigo-800 mb-6"
        >
          <FaArrowLeft className="mr-2" />
          <span>Back</span>
        </button>

        <div className="text-center">
          <motion.h1
            className="text-4xl sm:text-5xl font-extrabold mb-6"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Master Math, Chemistry, and Physics with a Proven Success Plan
          </motion.h1>
          <p className="text-lg sm:text-xl mb-12 max-w-3xl mx-auto">
            What better way to learn than from someone who excelled in AP and
            college-level courses? With a carefully crafted success plan, over
            50 students have already reached their goals — and you can too.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-16">
          {subjects.map((subject, idx) => (
            <motion.div
              key={subject.title}
              className="bg-gray-100 rounded-lg p-6 shadow hover:shadow-lg transition"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.2 }}
            >
              <div className="mb-4 flex justify-center">{subject.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{subject.title}</h3>
              <p>{subject.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/booking"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Schedule a Free Consultation
          </Link>
        </div>
      </div>
    </section>
  );
}
