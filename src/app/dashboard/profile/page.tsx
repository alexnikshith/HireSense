"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setName(localStorage.getItem("user_name") || "");
    setEmail(localStorage.getItem("user_email") || "");
  }, []);

  const handleSave = () => {
    localStorage.setItem("user_name", name);
    localStorage.setItem("user_email", email);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const getInitials = () => {
    if (!name) return "US";
    return name.substring(0, 2).toUpperCase();
  };
  return (
    <div className="p-8 space-y-10 max-w-4xl">
      <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
      
      <div className="glass-card rounded-[2.5rem] border-white/5 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary/20 to-blue-500/20" />
        <div className="px-8 pb-8 space-y-8">
          <div className="w-24 h-24 rounded-3xl bg-[#0A0A0A] -mt-12 border-4 border-[#0A0A0A] flex items-center justify-center text-3xl font-bold text-primary shadow-2xl">{getInitials()}</div>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your full name" className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-sm" />
            </div>
          </div>
          <button onClick={handleSave} className="px-8 py-3 bg-primary text-white rounded-2xl font-bold text-sm shadow-[0_0_20px_rgba(139,92,246,0.3)]">
            {saved ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
