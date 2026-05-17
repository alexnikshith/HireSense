"use client";

import { motion } from "framer-motion";
import { Clock, CheckCircle2, Briefcase } from "lucide-react";

export default function ApplicationsPage() {
  return (
    <div className="p-8 space-y-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
        <p className="text-muted-foreground text-sm">Track your current hiring status.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: "Applied", val: 0 },
          { label: "Interviews", val: 0 },
          { label: "Offered", val: 0 },
          { label: "Rejected", val: 0 },
        ].map((s, i) => (
          <div key={i} className="glass-card p-6 rounded-[2rem] border-white/5 space-y-2">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{s.label}</p>
            <div className="text-4xl font-bold">{s.val}</div>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-[2.5rem] border-white/5 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02]">
              <th className="px-8 py-5 font-bold uppercase tracking-widest text-muted-foreground text-[10px]">Company</th>
              <th className="px-8 py-5 font-bold uppercase tracking-widest text-muted-foreground text-[10px]">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-white/5">
              <td colSpan={2} className="px-8 py-8 text-center text-muted-foreground">No applications tracked yet.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
