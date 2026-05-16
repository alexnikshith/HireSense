"use client";

import { motion } from "framer-motion";
import { Search, Filter, MapPin, Briefcase } from "lucide-react";

export default function JobHuntPage() {
  return (
    <div className="p-8 space-y-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Job Hunt</h1>
        <p className="text-muted-foreground text-sm">Find roles that match your N Score profile.</p>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <input type="text" placeholder="Search titles, skills..." className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50" />
        </div>
        <button className="px-6 py-4 glass-card rounded-2xl flex items-center gap-2 font-bold text-sm"><Filter size={18} /> Filters</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-card p-6 rounded-[2rem] border-white/5 space-y-6 hover:border-primary/30 transition-all cursor-pointer">
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center font-bold text-primary">SC</div>
              <span className="text-[10px] font-bold px-3 py-1 bg-green-500/10 text-green-500 rounded-full border border-green-500/20">85% Match</span>
            </div>
            <div>
              <h3 className="font-bold">Senior Frontend Engineer</h3>
              <p className="text-xs text-muted-foreground">SpaceX · Remote</p>
            </div>
            <div className="flex gap-2">
              <span className="text-[10px] px-2 py-1 bg-white/5 rounded-lg text-muted-foreground">React</span>
              <span className="text-[10px] px-2 py-1 bg-white/5 rounded-lg text-muted-foreground">Next.js</span>
            </div>
            <button className="w-full py-3 bg-white/5 hover:bg-primary rounded-xl text-xs font-bold transition-all">Quick Apply</button>
          </div>
        ))}
      </div>
    </div>
  );
}
