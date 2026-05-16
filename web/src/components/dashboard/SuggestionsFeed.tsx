"use client";

import { Sparkles, ArrowRight, Lightbulb } from "lucide-react";

export default function SuggestionsFeed({ suggestions }: { suggestions: any }) {
  const priorityActions = suggestions?.priority_actions || [];
  const improvements = suggestions?.bullet_improvements || [];

  return (
    <div className="glass-card rounded-[2.5rem] p-8 space-y-8 h-full">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center text-yellow-500">
          <Sparkles size={24} />
        </div>
        <h3 className="text-xl font-bold">AI Suggestions</h3>
      </div>

      <div className="space-y-6">
        {/* Priority Actions */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Priority Checklist</h4>
          <div className="space-y-3">
            {priorityActions.map((action: string, i: number) => (
              <div key={i} className="group p-4 bg-white/5 border border-white/5 hover:border-primary/30 rounded-2xl transition-all cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary mt-0.5 group-hover:scale-110 transition-transform">
                    {i + 1}
                  </div>
                  <p className="text-sm font-medium leading-relaxed">{action}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bullet Improvements */}
        {improvements.length > 0 && (
          <div className="space-y-4 pt-4">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Content Optimization</h4>
            <div className="space-y-4">
              {improvements.slice(0, 2).map((imp: any, i: number) => (
                <div key={i} className="p-5 bg-primary/5 border border-primary/10 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-primary italic">
                    <Lightbulb size={12} /> Improvement Tip
                  </div>
                  <p className="text-xs text-muted-foreground italic line-through">"{imp.original}"</p>
                  <p className="text-sm font-semibold text-white">"{imp.improved}"</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <button className="w-full py-4 glass-button rounded-2xl text-xs font-bold flex items-center justify-center gap-2 group">
          View Detailed Roadmap <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
