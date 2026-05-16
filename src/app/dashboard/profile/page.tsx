"use client";

import { motion } from "framer-motion";

export default function ProfilePage() {
  return (
    <div className="p-8 space-y-10 max-w-4xl">
      <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
      
      <div className="glass-card rounded-[2.5rem] border-white/5 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary/20 to-blue-500/20" />
        <div className="px-8 pb-8 space-y-8">
          <div className="w-24 h-24 rounded-3xl bg-[#0A0A0A] -mt-12 border-4 border-[#0A0A0A] flex items-center justify-center text-3xl font-bold text-primary shadow-2xl">NG</div>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Full Name</label>
              <input type="text" defaultValue="Nikshith Gurram" className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Email</label>
              <input type="email" defaultValue="nikshith@example.com" className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-sm" />
            </div>
          </div>
          <button className="px-8 py-3 bg-primary text-white rounded-2xl font-bold text-sm shadow-[0_0_20px_rgba(139,92,246,0.3)]">Save Changes</button>
        </div>
      </div>
    </div>
  );
}
