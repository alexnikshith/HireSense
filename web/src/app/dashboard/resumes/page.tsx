"use client";

import { motion } from "framer-motion";
import { Files, Plus, FileText, Download, Trash2, MoreVertical } from "lucide-react";

export default function ResumesPage() {
  return (
    <div className="p-8 space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Resume Container</h1>
          <p className="text-muted-foreground">Manage your different resume versions for various industries.</p>
        </div>
        <button className="px-6 py-3 bg-primary text-white rounded-2xl flex items-center gap-2 font-bold text-sm shadow-[0_0_20px_rgba(139,92,246,0.3)]">
          <Plus size={18} /> Add Version
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { name: "Fullstack_2026.pdf", date: "May 15", type: "Main" },
          { name: "ML_Engineer_Spec.pdf", date: "May 12", type: "Technical" },
          { name: "Startup_Product.pdf", date: "May 10", type: "Alternative" },
        ].map((resume, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 rounded-[2rem] border-white/5 group hover:border-primary/50 transition-all cursor-pointer relative"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                <FileText size={24} />
              </div>
              <button className="p-2 text-muted-foreground hover:text-white transition-colors">
                <MoreVertical size={16} />
              </button>
            </div>
            
            <h3 className="font-bold text-sm truncate mb-1">{resume.name}</h3>
            <p className="text-[10px] text-muted-foreground mb-4 uppercase tracking-widest">{resume.type} · {resume.date}</p>
            
            <div className="flex items-center gap-2 pt-4 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-bold flex items-center justify-center gap-2 transition-all">
                <Download size={12} /> Download
              </button>
              <button className="p-2 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 transition-all">
                <Trash2 size={12} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
