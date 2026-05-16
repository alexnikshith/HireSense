"use client";

import { motion } from "framer-motion";
import { Upload, FileText, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import { useState } from "react";

export default function DashboardPage() {
  return (
    <div className="p-8 space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Intelligence Hub</h1>
          <p className="text-muted-foreground text-sm">Analyze your resume against any job description.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 glass-card rounded-xl text-xs font-bold flex items-center gap-2">
            <Sparkles size={14} className="text-primary" /> Pro Plan
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Input */}
        <div className="lg:col-span-7 space-y-8">
          <div className="glass-card p-8 rounded-[2.5rem] border-white/5 space-y-6">
             <div className="space-y-4">
               <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Resume Upload</h3>
               <div className="border-2 border-dashed border-white/10 rounded-[2rem] p-12 flex flex-col items-center justify-center gap-4 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:scale-110 transition-all">
                    <Upload size={32} />
                  </div>
                  <div className="text-center">
                    <p className="font-bold">Drop your resume here</p>
                    <p className="text-xs text-muted-foreground mt-1">PDF format highly recommended</p>
                  </div>
               </div>
             </div>

             <div className="space-y-4">
               <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Job Description</h3>
               <textarea 
                  placeholder="Paste the job description here..."
                  className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 min-h-[200px] text-sm focus:outline-none focus:border-primary/50 transition-all resize-none"
               />
             </div>

             <button className="w-full py-5 bg-primary text-white rounded-3xl font-bold text-lg shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all">
                Run AI Analysis
             </button>
          </div>
        </div>

        {/* Right: Insights */}
        <div className="lg:col-span-5 space-y-8">
          <div className="glass-card p-8 rounded-[2.5rem] border-white/5 space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Analysis Status</h3>
            <div className="flex flex-col items-center justify-center py-20 text-center gap-4 text-muted-foreground">
               <AlertCircle size={48} className="opacity-20" />
               <p className="text-sm max-w-[200px]">Upload a resume to start generating insights.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card p-6 rounded-[2rem] border-white/5">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Market Reach</p>
              <div className="text-2xl font-bold">Global</div>
            </div>
            <div className="glass-card p-6 rounded-[2rem] border-white/5">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Priority</p>
              <div className="text-2xl font-bold text-primary italic">High</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
