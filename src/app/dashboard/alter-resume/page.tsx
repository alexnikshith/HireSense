"use client";

import { motion } from "framer-motion";
import { Sparkles, Wand2, Edit3, CheckCircle2, AlertCircle, Copy, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function AlterResumePage() {
  const [editorText, setEditorText] = useState(
    "- worked on implementing backend features\n- helped the frontend team integrate new API endpoints\n- did code reviews for junior developers\n- Developed high-throughput microservices handling 50k+ active users"
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [optimizedResults, setOptimizedResults] = useState<any[]>([]);

  const handleOptimize = async () => {
    // Extract individual lines
    const lines = editorText
      .split("\n")
      .map(line => line.trim())
      .filter(line => line.length > 0);

    // Clean bullet prefixes
    const cleanBullets = lines.map(line => 
      line.replace(/^[•\-\*–▪]\s*/, "")
    );

    if (cleanBullets.length === 0) {
      setError("Please write or paste at least one bullet point first.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/optimize-bullets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ bullets: cleanBullets })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Optimization failed");

      setOptimizedResults(data.optimized || []);
    } catch (err: any) {
      setError(err.message || "An error occurred during optimization.");
    } finally {
      setLoading(false);
    }
  };

  const handleApplySuggestion = (original: string, suggestion: string) => {
    // Replace the exact original bullet in the editor text
    const lines = editorText.split("\n");
    const updatedLines = lines.map(line => {
      const clean = line.replace(/^[•\-\*–▪]\s*/, "").trim();
      if (clean === original) {
        // Keep the same bullet prefix style if present
        const prefixMatch = line.match(/^[•\-\*–▪]\s*/);
        const prefix = prefixMatch ? prefixMatch[0] : "- ";
        return `${prefix}${suggestion}`;
      }
      return line;
    });

    setEditorText(updatedLines.join("\n"));
    
    // Update local state so it matches
    setOptimizedResults(
      optimizedResults.map(item => 
        item.original === original 
          ? { ...item, original: suggestion, status: "strong", reason: "Successfully optimized!", suggestions: [] }
          : item
      )
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Alter Resume</h1>
          <p className="text-muted-foreground text-sm mt-1">Optimize your experience bullet points with AI-powered strong action verbs and concrete metrics.</p>
        </div>
        <button 
          onClick={handleOptimize}
          disabled={loading}
          className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-2xl flex items-center gap-2 text-sm shadow-[0_4px_14px_rgba(139,92,246,0.2)] hover:opacity-90 transition-all disabled:opacity-50"
        >
          <Sparkles size={16} />
          {loading ? "Analyzing..." : "AI Optimize Bullets"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Editor Area */}
        <div className="lg:col-span-6 flex flex-col space-y-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Edit3 size={14} className="text-primary" /> Interactive Bullet Editor
            </span>
            <span className="text-[10px] text-muted-foreground">Type one bullet point per line</span>
          </div>

          <div className="relative flex-1 min-h-[450px] bg-muted/30 border border-border rounded-[2rem] p-6 focus-within:border-primary/50 transition-all flex flex-col">
            <textarea
              value={editorText}
              onChange={(e) => setEditorText(e.target.value)}
              placeholder="Paste your resume bullet points here (e.g. - worked on implementing backend features)..."
              className="w-full flex-1 bg-transparent border-none text-foreground text-sm font-mono focus:outline-none resize-none leading-relaxed"
            />
          </div>
          
          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-200 text-xs flex items-center gap-2">
              <AlertCircle size={14} /> {error}
            </div>
          )}
        </div>

        {/* Suggestion & Analysis Area */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Wand2 size={14} className="text-primary" /> AI Insights & Recommendations
            </span>
            {optimizedResults.length > 0 && (
              <span className="text-[10px] text-muted-foreground">Click a suggestion to instantly apply it</span>
            )}
          </div>

          <div className="bg-muted/10 border border-border rounded-[2rem] p-6 min-h-[450px] space-y-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 text-center gap-4 text-primary">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full"
                />
                <p className="text-sm font-bold animate-pulse">Running advanced sentence analysis...</p>
              </div>
            ) : optimizedResults.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-28 text-center gap-4 text-muted-foreground">
                <Sparkles size={48} className="opacity-20 text-primary" />
                <div>
                  <p className="font-bold text-sm text-foreground">No Bullet Points Analyzed Yet</p>
                  <p className="text-xs text-muted-foreground mt-1 max-w-[280px] mx-auto">Click "AI Optimize Bullets" above to analyze your editor content and receive suggestions.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
                {optimizedResults.map((result, idx) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={idx}
                    className="p-5 bg-white border border-border rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-4"
                  >
                    {/* Header */}
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-mono font-medium text-foreground truncate max-w-[70%]">
                        "{result.original}"
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        result.status === "strong" 
                          ? "bg-green-50 text-green-700 border border-green-200" 
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}>
                        {result.status.toUpperCase()}
                      </span>
                    </div>

                    {/* Feedback */}
                    <p className="text-xs text-muted-foreground leading-relaxed flex gap-2 items-start bg-muted/40 p-3 rounded-xl border border-border/50">
                      {result.status === "strong" ? (
                        <CheckCircle2 size={14} className="text-green-600 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle size={14} className="text-amber-600 shrink-0 mt-0.5" />
                      )}
                      <span>{result.reason}</span>
                    </p>

                    {/* Suggestions */}
                    {result.suggestions && result.suggestions.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">AI Suggested Re-writes</p>
                        {result.suggestions.map((sug: string, sIdx: number) => (
                          <button
                            key={sIdx}
                            onClick={() => handleApplySuggestion(result.original, sug)}
                            className="w-full text-left p-3.5 bg-muted/20 hover:bg-primary/5 hover:border-primary/30 border border-border rounded-xl text-xs flex justify-between items-center gap-4 transition-all group"
                          >
                            <span className="text-foreground leading-relaxed group-hover:text-primary transition-colors">{sug}</span>
                            <ArrowRight size={14} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 shrink-0 transition-all" />
                          </button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
