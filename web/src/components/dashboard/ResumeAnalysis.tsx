"use client";

import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer 
} from "recharts";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export default function ResumeAnalysis({ data }: { data: any }) {
  const dimensions = data?.ats?.dimensions || {};
  const chartData = [
    { subject: 'Keywords', A: dimensions.keyword_relevance || 0, fullMark: 100 },
    { subject: 'Sections', A: dimensions.section_completeness || 0, fullMark: 100 },
    { subject: 'Formatting', A: dimensions.formatting || 0, fullMark: 100 },
    { subject: 'Verbs', A: dimensions.action_verbs || 0, fullMark: 100 },
    { subject: 'Quantity', A: dimensions.quantification || 0, fullMark: 100 },
    { subject: 'Length', A: dimensions.length || 0, fullMark: 100 },
  ];

  return (
    <div className="glass-card rounded-[2.5rem] p-8 space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">Hiring Readiness Analysis</h3>
        <span className="text-xs font-mono px-3 py-1 bg-primary/10 text-primary rounded-full border border-primary/20 uppercase tracking-tighter">
          Proprietary Intelligence
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Chart */}
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis 
                dataKey="subject" 
                tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 10, fontWeight: 700 }} 
              />
              <Radar
                name="ATS Score"
                dataKey="A"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.3}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Insights */}
        <div className="space-y-6">
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Formatting Audit</h4>
            {data?.ats?.formatting_issues?.length > 0 ? (
              <div className="space-y-2">
                {data.ats.formatting_issues.map((issue: string, i: number) => (
                  <div key={i} className="flex items-start gap-3 text-sm p-3 bg-red-500/5 border border-red-500/10 rounded-xl text-red-400">
                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                    <p>{issue}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-3 text-sm p-3 bg-green-500/5 border border-green-500/10 rounded-xl text-green-400">
                <CheckCircle2 size={16} className="shrink-0" />
                <p>Formatting is ATS-optimized.</p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Quick Metadata</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Words</p>
                <p className="text-lg font-bold">{data?.resume_meta?.word_count || 0}</p>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Tables</p>
                <p className={`text-lg font-bold ${data?.resume_meta?.has_tables ? 'text-red-500' : 'text-green-500'}`}>
                  {data?.resume_meta?.has_tables ? 'Detected' : 'None'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
