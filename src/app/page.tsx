"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Shield, Zap, Sparkles, Github, Rocket } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Glow */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <Navbar />
        
        <main className="w-full">
          <Hero />
          
          <Features />
          
          <section className="py-24 container px-6">
            <div className="glass-card p-12 rounded-3xl text-center space-y-8 max-w-4xl mx-auto">
              <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                Ready to beat the <span className="text-primary">ATS systems?</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Join thousands of candidates who used HireSense to optimize their resumes 
                and land interviews at top tech companies.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link href="/dashboard" className="px-8 py-4 bg-primary rounded-xl font-semibold hover:opacity-90 transition-all flex items-center gap-2 group">
                  Get Started Free <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="#features" className="px-8 py-4 glass-button rounded-xl font-semibold">
                  See how it works
                </Link>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
}
