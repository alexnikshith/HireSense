"use client";

import { motion } from "framer-motion";
import { User, Mail, Shield, Bell, Key, CreditCard } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="p-8 space-y-10 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your personal information and account preferences.</p>
      </div>

      <div className="glass-card rounded-[2.5rem] border-white/5 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary/20 to-blue-500/20" />
        <div className="px-8 pb-8">
          <div className="flex items-end gap-6 -mt-10 mb-8">
            <div className="w-24 h-24 rounded-3xl bg-[#0A0A0A] border-4 border-[#0A0A0A] overflow-hidden shadow-2xl">
              <div className="w-full h-full bg-primary/20 flex items-center justify-center text-4xl font-bold text-primary">
                NG
              </div>
            </div>
            <div className="pb-2">
              <h2 className="text-2xl font-bold">Nikshith Gurram</h2>
              <p className="text-sm text-muted-foreground">Software Engineer · Bangalore, India</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Full Name</label>
                <input type="text" defaultValue="Nikshith Gurram" className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:border-primary/50 transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Email Address</label>
                <input type="email" defaultValue="nikshith@example.com" className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:border-primary/50 transition-all" />
              </div>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Location</label>
                <input type="text" defaultValue="Bangalore, India" className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:border-primary/50 transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Job Title</label>
                <input type="text" defaultValue="Software Engineer" className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:border-primary/50 transition-all" />
              </div>
            </div>
          </div>

          <div className="pt-8 flex justify-end">
            <button className="px-8 py-3 bg-primary text-white rounded-2xl font-bold text-sm shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:scale-105 transition-all">
              Save Changes
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: Shield, label: "Security", desc: "Password & 2FA" },
          { icon: Bell, label: "Notifications", desc: "Email & Push" },
          { icon: CreditCard, label: "Billing", desc: "Plan & Invoices" },
        ].map((item, i) => (
          <div key={i} className="glass-card p-6 rounded-[2rem] border-white/5 hover:border-primary/30 transition-all cursor-pointer group">
            <item.icon className="text-muted-foreground group-hover:text-primary transition-colors mb-4" size={24} />
            <h4 className="font-bold text-sm mb-1">{item.label}</h4>
            <p className="text-xs text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
