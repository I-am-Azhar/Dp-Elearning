import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Herosection() {
  return (
    <section className="bg-[#FFDDD2] min-h-screen min-w-full w-screen h-screen flex items-center justify-center py-8 relative overflow-hidden">
      <div className="z-[1] flex flex-col items-center justify-center w-full max-w-[600px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full flex flex-col items-center text-center"
        >
          <h1 className="text-[2.5rem] font-extrabold mb-4 text-slate-800 leading-tight text-center">
            Empower Your Future with Digital{" "}
            <span className="text-blue-500">Pa</span> E-
            <span className="text-blue-500">Learning</span>
          </h1>
          <h2 className="text-[1.3rem] font-medium mb-8 text-slate-700 text-center">
            Master in-demand skills with expert-led courses.
          </h2>

          <div className="flex gap-3 justify-center">
            <button
              className="bg-black text-white border border-white px-5 py-2 rounded-full font-bold text-base no-underline shadow"
              type="button"
            >
              Get Started
            </button>
            <div>
              <button
                className="bg-white text-black border border-black px-5 py-2 rounded-full font-bold text-base no-underline shadow flex items-center justify-center"
                type="button"
              >
                Browse Courses
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
