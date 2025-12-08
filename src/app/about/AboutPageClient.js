'use client';

import { motion } from "framer-motion";
import Link from "next/link";
import { User, Lightbulb, BookOpen, Users, FileText, Download, Mail } from "lucide-react";

export default function AboutPageClient() {
  return (
    <section className="min-h-screen px-6 sm:px-12 py-20 bg-white text-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="max-w-4xl mx-auto space-y-12"
      >
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold">About Me</h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            I’m a 26-year-old Georgia Tech student and tutor. I’ve worked with younger students for years, 
            helping them excel in math and science. I consistently scored in the 99th percentile and love 
            making learning effective and fun.
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Link href="/worksheets/free-worksheets" className="block group">
            <div className="bg-indigo-50 rounded-xl p-6 shadow-md hover:shadow-xl transition-all border-2 border-transparent group-hover:border-indigo-400">
              <Download className="w-10 h-10 text-indigo-600 mb-3" />
              <h3 className="text-xl font-bold text-indigo-900 mb-1">Free Worksheets</h3>
              <p className="text-gray-700 text-sm">
                Practice anytime with carefully crafted math and science worksheets.
              </p>
            </div>
          </Link>

          <Link href="/contact" className="block group">
            <div className="bg-green-50 rounded-xl p-6 shadow-md hover:shadow-xl transition-all border-2 border-transparent group-hover:border-green-400">
              <Mail className="w-10 h-10 text-green-600 mb-3" />
              <h3 className="text-xl font-bold text-green-900 mb-1">Personalized Tutoring</h3>
              <p className="text-gray-700 text-sm">
                One-on-one or small group sessions tailored to your child’s needs.
              </p>
            </div>
          </Link>
        </div>

        {/* Why Choose Me */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div className="space-y-2">
            <User className="w-10 h-10 text-indigo-600 mx-auto" />
            <h3 className="font-semibold">Experienced</h3>
            <p className="text-gray-700 text-sm">
              Years of tutoring younger students effectively.
            </p>
          </div>

          <div className="space-y-2">
            <Lightbulb className="w-10 h-10 text-yellow-500 mx-auto" />
            <h3 className="font-semibold">Relatable</h3>
            <p className="text-gray-700 text-sm">
              I connect with students, making learning fun and engaging.
            </p>
          </div>

          <div className="space-y-2">
            <BookOpen className="w-10 h-10 text-blue-600 mx-auto" />
            <h3 className="font-semibold">High Achiever</h3>
            <p className="text-gray-700 text-sm">
              99th percentile in school, helping students reach their potential.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Ready to Help Your Child Succeed?</h2>
          <p className="text-gray-700 max-w-xl mx-auto text-sm">
            Personalized tutoring and high-quality worksheets designed to build confidence and mastery.
          </p>
          <div className="flex justify-center gap-4 mt-2 flex-wrap">
            <Link 
              href="/contact" 
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors text-sm"
            >
              Contact Me
            </Link>
            <Link 
              href="/worksheets/free-worksheets" 
              className="bg-white text-green-600 border-2 border-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors text-sm"
            >
              Explore Worksheets
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
