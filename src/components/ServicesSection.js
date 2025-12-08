"use client";

import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import { useEffect } from "react";

export default function OfferedServicesSection() {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [inView, controls]);

  const containerVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const services = [
    {
      title: "SAT Math Expertise",
      description: "Master SAT Math with targeted strategies and drills.",
      link: "/services/sat-math",
    },
    {
      title: "Subject Tutoring",
      description: "Get help in Algebra, Geometry, Pre-Calc, and more.",
      link: "/services/subject-tutoring",
    },
    {
      title: "Summer Programs",
      description: "Stay sharp or get ahead during the summer break.",
      link: "/services/summer-programs",
    },
    {
      title: "Urgent Homework & Test Help",
      description:
        "Quick assistance when you need it most—homework, quizzes, or tests.",
      link: "/services/last-second-help",
    },
  ];

  return (
    <section
      ref={ref}
      className="relative py-20 px-6 sm:px-12 bg-gradient-to-b from-gray-100 via-gray-200 to-gray-100"
    >
      {/* Background Fade Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={controls}
        variants={containerVariants}
        className="absolute inset-0 bg-black/5 pointer-events-none"
      />

      <motion.div
        initial="hidden"
        animate={controls}
        variants={containerVariants}
        className="relative max-w-5xl mx-auto text-center z-10"
      >
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Have Something Specific?
        </h2>
        <p className="text-lg text-gray-700 mb-12 max-w-2xl mx-auto">
          Whether you're prepping for the SAT, need help in school subjects, or
          want to boost your skills over the summer, we've got a program
          tailored for you.
        </p>

        <div className="grid gap-8 sm:grid-cols-2">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-between transition-transform duration-300 ease-in-out hover:shadow-lg hover:scale-[1.03]"
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 250, damping: 20 }}
            >
              <div>
                <h3 className="text-2xl font-semibold mb-3 text-gray-900">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </div>

              <Link
                href={service.link}
                className="mt-6 inline-block text-blue-600 hover:text-blue-800 font-semibold"
              >
                Learn more →
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
