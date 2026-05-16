"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Zap, Brain, Target, BarChart3, Shield, Globe, Play } from "lucide-react";
import Link from "next/link";

const features = [
  { title: "ATS Scoring", desc: "Instant industry-standard scoring.", icon: <Zap /> },
  { title: "AI Insights", desc: "Recruiter-level hiring readiness.", icon: <Brain /> },
  { title: "Skill Matching", desc: "Detect missing keywords automatically.", icon: <Target /> },
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Navbar */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl glass-card rounded-2xl px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white"><Sparkles size={18} /></div>
          <span className="text-xl font-bold">HireSense</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-muted-foreground">
          <Link href="#features" className="hover:text-white">Features</Link>
          <Link href="/login" className="hover:text-white">Login</Link>
        </div>
        <Link href="/signup" className="px-5 py-2 bg-white text-black text-sm font-bold rounded-xl hover:bg-white/90">Sign Up</Link>
      </nav>

      {/* Hero */}
      <section className="relative z-10 pt-48 pb-24 container px-6 mx-auto flex flex-col items-center text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-6xl md:text-8xl font-bold tracking-tight mb-8">
          Optimize your career with <br /><span className="text-primary italic">Hiring Intelligence.</span>
        </motion.div>
        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mb-12">
          The premium AI platform for modern candidates. Get instant ATS scores, 
          smart skill gap analysis, and recruiter-level insights.
        </p>
        <div className="flex gap-4">
          <Link href="/dashboard" className="px-8 py-4 bg-primary rounded-2xl font-bold text-lg flex items-center gap-2 group shadow-[0_0_30px_rgba(139,92,246,0.3)]">
            Analyze Resume <ArrowRight className="group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Dashboard Preview */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="w-full max-w-5xl mt-24 glass-card rounded-3xl aspect-video border-white/10 overflow-hidden relative">
          <div className="absolute inset-0 flex items-center justify-center text-white/10 font-mono text-xs tracking-widest animate-pulse">SYSTEM_INITIALIZING...</div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 py-24 container px-6 mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((f, i) => (
          <div key={i} className="glass-card p-8 rounded-3xl space-y-4 hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">{f.icon}</div>
            <h3 className="text-xl font-bold">{f.title}</h3>
            <p className="text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 border-t border-white/5 container px-6 mx-auto flex justify-between items-center text-sm text-muted-foreground">
        <div className="flex items-center gap-2 font-bold text-white"><Sparkles size={16} className="text-primary" /> HireSense AI</div>
        <div>© 2024. All rights reserved.</div>
      </footer>
    </div>
  );
}
