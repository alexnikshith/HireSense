"use client";

import { CheckCircle2, XCircle, Brain } from "lucide-react";

export default function SkillGaps({ matching, missing }: { matching: string[], missing: string[] }) {
  return (
    <div className="glass-card rounded-[2.5rem] p-8 space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
          <Brain size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold">Skill Intelligence</h3>
          <p className="text-xs text-muted-foreground">Gap analysis between your profile and job requirements.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Matched */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold uppercase tracking-widest text-green-500 flex items-center gap-2">
              <CheckCircle2 size={16} /> Matched Skills
            </h4>
            <span className="text-xs font-mono px-2 py-0.5 bg-green-500/10 text-green-500 rounded border border-green-500/20">
              {matching.length}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {matching.map((s, i) => (
              <span key={i} className="px-3 py-1.5 bg-green-500/5 border border-green-500/10 text-green-400 text-xs rounded-xl font-medium">
                {s}
              </span>
            ))}
            {matching.length === 0 && <p className="text-xs text-muted-foreground italic">No matching keywords detected.</p>}
          </div>
        </div>

        {/* Missing */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold uppercase tracking-widest text-red-500 flex items-center gap-2">
              <XCircle size={16} /> Missing Keywords
            </h4>
            <span className="text-xs font-mono px-2 py-0.5 bg-red-500/10 text-red-500 rounded border border-red-500/20">
              {missing.length}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {missing.map((s, i) => (
              <span key={i} className="px-3 py-1.5 bg-red-500/5 border border-red-500/10 text-red-400 text-xs rounded-xl font-medium">
                {s}
              </span>
            ))}
            {missing.length === 0 && <p className="text-xs text-green-500/50 italic">Excellent! All required keywords found.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
