"use client";

import { motion } from "framer-motion";
import { Target, FileText, BarChart3, Zap } from "lucide-react";

interface StatsProps {
  atsScore: number;
  matchScore: number;
  grade: string;
}

export default function DashboardStats({ atsScore, matchScore, grade }: StatsProps) {
  const stats = [
    {
      label: "ATS Score",
      value: `${atsScore}/100`,
      icon: <FileText className="text-primary" />,
      color: "border-primary/20",
    },
    {
      label: "Job Match",
      value: `${matchScore}%`,
      icon: <Target className="text-blue-500" />,
      color: "border-blue-500/20",
    },
    {
      label: "Overall Grade",
      value: grade,
      icon: <Zap className="text-yellow-500" />,
      color: "border-yellow-500/20",
    },
    {
      label: "Hiring Readiness",
      value: atsScore > 80 ? "High" : atsScore > 60 ? "Moderate" : "Low",
      icon: <BarChart3 className="text-green-500" />,
      color: "border-green-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className={`glass-card p-6 rounded-[2rem] border ${s.color} space-y-4`}
        >
          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
            {s.icon}
          </div>
          <div>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{s.label}</p>
            <h2 className="text-3xl font-bold">{s.value}</h2>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
