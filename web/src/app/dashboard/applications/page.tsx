"use client";

import { motion } from "framer-motion";
import { Briefcase, Clock, CheckCircle2, XCircle } from "lucide-react";

export default function ApplicationsPage() {
  const statuses = [
    { label: "Applied", count: 12, color: "bg-blue-500" },
    { label: "Interviewing", count: 4, color: "bg-primary" },
    { label: "Offered", count: 1, color: "bg-green-500" },
    { label: "Rejected", count: 3, color: "bg-red-500" },
  ];

  return (
    <div className="p-8 space-y-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Your Applications</h1>
        <p className="text-muted-foreground">Track the status of your current job applications.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {statuses.map((s, i) => (
          <div key={i} className="glass-card p-6 rounded-[2rem] border-white/5 space-y-2">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{s.label}</p>
            <div className="flex items-center gap-3">
              <span className="text-4xl font-bold">{s.count}</span>
              <div className={`w-2 h-2 rounded-full ${s.color} animate-pulse`} />
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-[2.5rem] border-white/5 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02]">
              <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-muted-foreground">Company</th>
              <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-muted-foreground">Role</th>
              <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-muted-foreground">Applied Date</th>
              <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {[
              { company: "Google", role: "Software Engineer", date: "May 12, 2026", status: "Interviewing", color: "text-primary" },
              { company: "Meta", role: "Product Designer", date: "May 10, 2026", status: "Applied", color: "text-blue-500" },
              { company: "Amazon", role: "AWS Solutions Architect", date: "May 08, 2026", status: "Offered", color: "text-green-500" },
            ].map((app, i) => (
              <tr key={i} className="border-b border-white/5 hover:bg-white/[0.01] transition-colors cursor-pointer group">
                <td className="px-8 py-6 font-bold">{app.company}</td>
                <td className="px-8 py-6 text-sm text-muted-foreground">{app.role}</td>
                <td className="px-8 py-6 text-sm font-mono text-muted-foreground">{app.date}</td>
                <td className="px-8 py-6">
                  <span className={`text-xs font-bold flex items-center gap-2 ${app.color}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${app.color.replace('text', 'bg')}`} />
                    {app.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
