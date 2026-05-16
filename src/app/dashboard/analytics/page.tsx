"use client";

import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [{ n: 650 }, { n: 680 }, { n: 720 }, { n: 710 }, { n: 742 }];

export default function AnalyticsPage() {
  return (
    <div className="p-8 space-y-10">
      <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-8 rounded-[2.5rem] space-y-6">
          <h3 className="font-bold">N Score Trend</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs><linearGradient id="c" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/><stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/></linearGradient></defs>
                <Tooltip contentStyle={{ backgroundColor: "#1A1A1A", border: "none", borderRadius: "12px" }} />
                <Area type="monotone" dataKey="n" stroke="#8b5cf6" fill="url(#c)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-8 rounded-[2.5rem] space-y-6">
          <h3 className="font-bold">Skill Relevance</h3>
          <div className="space-y-4">
            {["Frontend", "Backend", "DevOps"].map((s, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground"><span>{s}</span><span>85%</span></div>
                <div className="w-full h-1.5 bg-white/5 rounded-full"><div className="h-full bg-primary w-[85%]" /></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
