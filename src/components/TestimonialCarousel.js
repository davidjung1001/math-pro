'use client';

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah M.",
    role: "Parent of 7th grader",
    text: "My daughter went from struggling with algebra to actually enjoying it! Her confidence has skyrocketed in just 2 months.",
    rating: 5,
    subject: "Math"
  },
  {
    name: "James P.",
    role: "Parent of 5th grader",
    text: "The worksheets are perfect for practice at home. Clear, engaging, and my son actually asks to do them!",
    rating: 5,
    subject: "Science"
  },
  {
    name: "Emily R.",
    role: "Parent of 9th grader",
    text: "Best tutor we've ever had. Patient, knowledgeable, and knows exactly how to explain complex concepts in simple terms.",
    rating: 5,
    subject: "Chemistry"
  },
  {
    name: "Michael T.",
    role: "Parent of 6th grader",
    text: "Test scores improved dramatically. More importantly, my son now believes he's good at math!",
    rating: 5,
    subject: "Math"
  },
  {
    name: "Linda K.",
    role: "Parent of 8th grader",
    text: "The personalized approach made all the difference. My daughter finally understands physics concepts she'd been struggling with all year.",
    rating: 5,
    subject: "Physics"
  },
  {
    name: "David H.",
    role: "Parent of 4th grader",
    text: "Engaging and fun sessions that keep my son interested. He looks forward to tutoring every week!",
    rating: 5,
    subject: "Math & Science"
  }
];

// Triple the testimonials for seamless infinite scroll
const extendedTestimonials = [...testimonials, ...testimonials, ...testimonials];

export default function TestimonialCarousel() {
  // Each card is 320px (w-80) + 24px gap = 344px per card
  const cardWidth = 344;
  const totalWidth = testimonials.length * cardWidth;

  return (
    <div className="w-full overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-16">
      <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            What Parents Say
          </h2>
          <p className="text-gray-600 text-lg">
            Real results from real families
          </p>
          <div className="flex items-center justify-center gap-1 mt-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
            ))}
            <span className="ml-2 text-gray-700 font-semibold">5.0 Average Rating</span>
          </div>
        </motion.div>
      </div>

      {/* Infinite Scroll Container */}
      <div className="relative">
        <motion.div
          className="flex gap-6"
          animate={{
            x: [-totalWidth, 0],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 60,
              ease: "linear",
            },
          }}
        >
          {extendedTestimonials.map((testimonial, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-80 bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <Quote className="w-8 h-8 text-indigo-400 opacity-50" />
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
              
              <p className="text-gray-700 mb-4 leading-relaxed">
                "{testimonial.text}"
              </p>
              
              <div className="border-t border-gray-100 pt-4">
                <p className="font-semibold text-gray-900">{testimonial.name}</p>
                <p className="text-sm text-gray-600">{testimonial.role}</p>
                <span className="inline-block mt-2 px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full">
                  {testimonial.subject}
                </span>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Gradient Overlays */}
        <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-indigo-50 via-purple-50 to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-pink-50 via-purple-50 to-transparent pointer-events-none" />
      </div>

      {/* Trust Indicators */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="max-w-4xl mx-auto px-6 mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center"
      >
        <div className="bg-white rounded-xl p-6 shadow-md">
          <p className="text-3xl font-bold text-indigo-600">50+</p>
          <p className="text-gray-600 font-medium">Students Helped</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md">
          <p className="text-3xl font-bold text-green-600">95%</p>
          <p className="text-gray-600 font-medium">Grade Improvement</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md">
          <p className="text-3xl font-bold text-purple-600">100%</p>
          <p className="text-gray-600 font-medium">Parent Satisfaction</p>
        </div>
      </motion.div>
    </div>
  );
}