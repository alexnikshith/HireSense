"use client";

import { motion } from "framer-motion";
import { Edit3, Sparkles, Wand2, RotateCcw } from "lucide-react";

export default function AlterResumePage() {
  return (
    <div className="p-8 space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alter Resume</h1>
          <p className="text-muted-foreground">Modify and optimize your resume content with AI guidance.</p>
        </div>
        <button className="px-6 py-3 bg-primary text-white rounded-2xl flex items-center gap-2 font-bold text-sm shadow-[0_0_20px_rgba(139,92,246,0.3)]">
          <Sparkles size={18} /> AI Smart-Write
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="glass-card p-8 rounded-[2.5rem] border-white/5 min-h-[600px] font-mono text-sm leading-relaxed text-muted-foreground">
             {/* Resume Content Placeholder */}
             <p className="text-white mb-4">// RESUME EDITOR INITIALIZING...</p>
             <p>Experience Section:</p>
             <p className="ml-4">- Developed scalable web applications using Next.js and Tailwind...</p>
             <p className="ml-4">- Optimized backend performance by 40% with FastAPI...</p>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">AI Content Suggestions</h3>
          <div className="space-y-4">
            {[
              "Quantify your backend results: 'Optimized performance' -> 'Improved response time by 25%'.",
              "Add 'Terraform' to your skills to match the Cloud Engineer role.",
              "Use a stronger action verb for your leadership roles."
            ].map((tip, i) => (
              <div key={i} className="p-5 bg-white/5 border border-white/5 rounded-2xl space-y-2 hover:border-primary/30 transition-all cursor-pointer">
                <div className="flex items-center gap-2 text-[10px] font-bold text-primary italic uppercase">
                  <Wand2 size={12} /> AI Rewrite Tip
                </div>
                <p className="text-xs text-white leading-relaxed font-medium">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
