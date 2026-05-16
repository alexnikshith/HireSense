"use client";

import { motion } from "framer-motion";
import { FileText, Plus, MoreVertical } from "lucide-react";

export default function ResumesPage() {
  return (
    <div className="p-8 space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Resumes</h1>
        <button className="px-6 py-3 bg-primary text-white rounded-2xl flex items-center gap-2 font-bold text-sm shadow-[0_0_20px_rgba(139,92,246,0.3)]"><Plus size={18} /> Add New</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { name: "Main_2026.pdf", type: "Primary" },
          { name: "Frontend_Spec.pdf", type: "Specialized" },
        ].map((r, i) => (
          <div key={i} className="glass-card p-6 rounded-[2rem] border-white/5 space-y-6 hover:border-primary/50 transition-all cursor-pointer group">
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors"><FileText size={24} /></div>
              <MoreVertical size={16} className="text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-bold text-sm truncate">{r.name}</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{r.type}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
