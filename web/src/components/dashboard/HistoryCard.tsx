"use client";

import { FileText, ChevronRight } from "lucide-react";

interface HistoryCardProps {
  title: string;
  company: string;
  score: number;
  date: string;
}

export default function HistoryCard({ title, company, score, date }: HistoryCardProps) {
  return (
    <div className="glass-card p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-all cursor-pointer group flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary transition-colors">
          <FileText size={20} />
        </div>
        <div>
          <h4 className="text-sm font-bold truncate max-w-[150px]">{title}</h4>
          <p className="text-xs text-muted-foreground">{company} · {date}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className={`text-sm font-bold ${score >= 80 ? 'text-green-500' : score >= 60 ? 'text-yellow-500' : 'text-red-500'}`}>
            {score}
          </p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Score</p>
        </div>
        <ChevronRight size={14} className="text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
      </div>
    </div>
  );
}
