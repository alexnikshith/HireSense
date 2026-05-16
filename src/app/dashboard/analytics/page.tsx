"use client";

import { motion } from "framer-motion";
import { BarChart, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Bar, Cell } from "recharts";

const data = [
  { name: "Mon", score: 650 },
  { name: "Tue", score: 680 },
  { name: "Wed", score: 720 },
  { name: "Thu", score: 710 },
  { name: "Fri", score: 740 },
  { name: "Sat", score: 740 },
  { name: "Sun", score: 760 },
];

export default function AnalyticsPage() {
  return (
    <div className="p-8 space-y-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Hiring Analytics</h1>
        <p className="text-muted-foreground">Deep dive into your N Score trends and profile performance.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* N Score Trend */}
        <div className="glass-card p-8 rounded-[2.5rem] border-white/5 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">N Score Growth</h3>
            <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">+110 pts this week</span>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#1A1A1A", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px" }}
                  itemStyle={{ color: "#8b5cf6" }}
                />
                <Area type="monotone" dataKey="score" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorScore)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skill Breakdown */}
        <div className="glass-card p-8 rounded-[2.5rem] border-white/5 space-y-6">
          <h3 className="text-lg font-bold">Industry Relevance</h3>
          <div className="space-y-6">
            {[
              { label: "Frontend Architecture", value: 85, color: "bg-primary" },
              { label: "Backend Engineering", value: 72, color: "bg-blue-500" },
              { label: "Cloud & DevOps", value: 45, color: "bg-yellow-500" },
              { label: "System Design", value: 60, color: "bg-green-500" },
            ].map((skill, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span>{skill.label}</span>
                  <span className="text-muted-foreground">{skill.value}%</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.value}%` }}
                    className={`h-full ${skill.color} shadow-[0_0_10px_currentColor] opacity-80`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
