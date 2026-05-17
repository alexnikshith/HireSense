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

      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground glass-card rounded-[2.5rem] border-white/5">
        <Briefcase size={48} className="opacity-20 mb-4" />
        <p className="text-sm">No job matches found yet. Update your profile to get recommendations.</p>
      </div>
    </div>
  );
}
