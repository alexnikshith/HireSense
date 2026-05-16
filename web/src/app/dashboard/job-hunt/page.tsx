"use client";

import { motion } from "framer-motion";
import { Search, MapPin, Briefcase, Filter } from "lucide-react";

export default function JobHuntPage() {
  return (
    <div className="p-8 space-y-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Job Hunt</h1>
        <p className="text-muted-foreground">Search and apply for jobs that match your AI-optimized profile.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search for titles, skills, or companies..." 
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-all"
          />
        </div>
        <button className="px-6 py-4 glass-button rounded-2xl flex items-center gap-2 font-bold text-sm">
          <Filter size={18} /> Filters
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 rounded-[2rem] border-white/5 hover:border-primary/30 transition-all group cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center font-bold text-primary">
                JD
              </div>
              <span className="text-[10px] font-bold px-3 py-1 bg-green-500/10 text-green-500 rounded-full border border-green-500/20">
                85% Match
              </span>
            </div>
            <h3 className="font-bold mb-1 group-hover:text-primary transition-colors">Frontend Architect</h3>
            <p className="text-xs text-muted-foreground mb-4">SpaceX · Remote</p>
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="text-[10px] px-2 py-1 bg-white/5 rounded-lg text-muted-foreground">React</span>
              <span className="text-[10px] px-2 py-1 bg-white/5 rounded-lg text-muted-foreground">Next.js</span>
              <span className="text-[10px] px-2 py-1 bg-white/5 rounded-lg text-muted-foreground">TypeScript</span>
            </div>
            <button className="w-full py-3 bg-white/5 hover:bg-primary hover:text-white rounded-xl text-xs font-bold transition-all">
              Quick Apply
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
