"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="pt-48 pb-24 container px-6 flex flex-col items-center text-center space-y-10">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="px-4 py-1.5 rounded-full glass-card border-primary/20 text-primary text-xs font-bold tracking-widest uppercase"
      >
        ✨ Next Gen AI Analysis
      </motion.div>

      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-6xl md:text-8xl font-bold tracking-tight max-w-5xl"
      >
        Optimize your career with <br />
        <span className="text-primary italic">Hiring Intelligence.</span>
      </motion.h1>

      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-muted-foreground text-lg md:text-xl max-w-2xl"
      >
        The premium AI platform for modern candidates. Get instant ATS scores, 
        smart skill gap analysis, and recruiter-level insights to land your dream job.
      </motion.p>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <Link 
          href="/dashboard" 
          className="px-8 py-4 bg-primary rounded-2xl font-bold text-lg hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] transition-all flex items-center gap-2 group"
        >
          Analyze Resume <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
        <button className="px-8 py-4 glass-button rounded-2xl font-bold text-lg flex items-center gap-2">
          <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center">
            <Play className="w-3 h-3 fill-white" />
          </div>
          Watch Demo
        </button>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex items-center gap-8 pt-8 grayscale opacity-50"
      >
        <div className="flex items-center gap-2 text-sm font-semibold">
          <CheckCircle2 className="w-4 h-4 text-green-500" />
          ATS Optimized
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold">
          <CheckCircle2 className="w-4 h-4 text-green-500" />
          AI-Powered Insights
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold">
          <CheckCircle2 className="w-4 h-4 text-green-500" />
          Data Secured
        </div>
      </motion.div>

      {/* Decorative Dashboard Preview */}
      <motion.div 
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 50 }}
        className="w-full max-w-6xl mt-20 relative"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-[2.5rem] blur-2xl opacity-20" />
        <div className="glass-card rounded-[2rem] border-white/10 overflow-hidden shadow-2xl relative aspect-[16/9] flex items-center justify-center">
           <div className="flex flex-col items-center gap-4 text-white/20">
             <div className="w-20 h-20 rounded-full border-4 border-dashed border-current animate-spin-slow" />
             <p className="font-mono text-xs uppercase tracking-widest">Dashboard System Initializing...</p>
           </div>
        </div>
      </motion.div>
    </section>
  );
}
