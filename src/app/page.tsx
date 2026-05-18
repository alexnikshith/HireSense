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
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl bg-white/80 backdrop-blur-md shadow-sm border border-border rounded-2xl px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground"><Sparkles size={18} /></div>
          <span className="text-xl font-bold text-foreground">HireSense</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-muted-foreground">
          <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
          <Link href="/login" className="hover:text-foreground transition-colors">Login</Link>
        </div>
        <Link href="/signup" className="px-5 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-xl hover:opacity-90 transition-opacity">Sign Up</Link>
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
          <Link href="/dashboard" className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold text-lg flex items-center gap-2 group shadow-md transition-transform hover:scale-105">
            Analyze Resume <ArrowRight className="group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Dashboard Preview */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="w-full max-w-5xl mt-24 bg-white rounded-[2rem] shadow-2xl border border-border overflow-hidden relative">
          <div className="flex flex-col h-full bg-background/50">
            {/* Mockup Header */}
            <div className="h-14 border-b border-border bg-white flex items-center px-6 gap-4">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="w-64 h-6 bg-muted rounded-full ml-4"></div>
            </div>
            {/* Mockup Body */}
            <div className="p-8 grid grid-cols-3 gap-6 h-[400px]">
              <div className="col-span-2 border-2 border-dashed border-border rounded-3xl flex flex-col items-center justify-center gap-4 bg-white text-muted-foreground">
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
                  <div className="w-8 h-8 rounded bg-border"></div>
                </div>
                <p className="font-bold">Drop your resume here</p>
              </div>
              <div className="col-span-1 space-y-4">
                <div className="h-32 bg-white rounded-3xl border border-border p-6 space-y-3">
                  <div className="w-20 h-4 bg-muted rounded"></div>
                  <div className="w-full h-8 bg-muted/50 rounded mt-4"></div>
                </div>
                <div className="h-32 bg-white rounded-3xl border border-border p-6 space-y-3">
                  <div className="w-20 h-4 bg-muted rounded"></div>
                  <div className="w-full h-8 bg-muted/50 rounded mt-4"></div>
                </div>
              </div>
            </div>
          </div>
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
      <footer className="relative z-10 py-12 border-t border-border container px-6 mx-auto flex justify-between items-center text-sm text-muted-foreground">
        <div className="flex items-center gap-2 font-bold text-foreground"><Sparkles size={16} className="text-primary" /> HireSense AI</div>
        <div>© 2024. All rights reserved.</div>
      </footer>
    </div>
  );
}
