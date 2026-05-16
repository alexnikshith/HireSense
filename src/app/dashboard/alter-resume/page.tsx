"use client";

import { motion } from "framer-motion";
import { Sparkles, Wand2, Edit3 } from "lucide-react";

export default function AlterResumePage() {
  return (
    <div className="p-8 space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alter Resume</h1>
          <p className="text-muted-foreground text-sm">Optimize your content for maximum impact.</p>
        </div>
        <button className="px-6 py-3 bg-primary text-white rounded-2xl flex items-center gap-2 font-bold text-sm shadow-[0_0_20px_rgba(139,92,246,0.3)]">
          <Sparkles size={18} /> AI Smart-Write
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 glass-card p-8 rounded-[2.5rem] min-h-[600px] border-white/5 font-mono text-sm text-muted-foreground">
          // EDITOR INITIALIZING...
        </div>
        <div className="lg:col-span-4 space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">AI Suggestions</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-5 bg-white/5 border border-white/5 rounded-2xl space-y-2 hover:border-primary/30 transition-all cursor-pointer">
                <div className="text-[10px] font-bold text-primary italic uppercase flex items-center gap-2"><Wand2 size={12} /> Suggestion</div>
                <p className="text-xs text-white leading-relaxed">Consider adding "Kubernetes" to your skills section.</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
