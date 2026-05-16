"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { 
  Sparkles, 
  History, 
  AlertCircle,
  Plus
} from "lucide-react";
import DashboardStats from "@/components/dashboard/DashboardStats";
import ResumeAnalysis from "@/components/dashboard/ResumeAnalysis";
import SkillGaps from "@/components/dashboard/SkillGaps";
import SuggestionsFeed from "@/components/dashboard/SuggestionsFeed";
import HistoryCard from "@/components/dashboard/HistoryCard";
import UploadZone from "@/components/dashboard/UploadZone";

const API_BASE = "http://localhost:8000";

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<"upload" | "results">("upload");

  const handleAnalyze = async (selectedFile: File, jd: string) => {
    setLoading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("job_description", jd);

    try {
      const response = await axios.post(`${API_BASE}/api/analyze`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(response.data);
      setView("results");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to analyze resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setView("upload");
  };

  return (
    <>
      <header className="p-8 flex items-center justify-between border-b border-white/5 bg-[#0A0A0A]/80 backdrop-blur-md sticky top-0 z-30">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Intelligence Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome back, Nikshith</p>
        </div>
        <div className="flex items-center gap-4">
          {view === "results" && (
            <button 
              onClick={handleReset}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:scale-105 transition-all"
            >
              <Plus size={16} /> New Analysis
            </button>
          )}
          <div className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-primary">
            NG
          </div>
        </div>
      </header>

      <div className="p-8 max-w-7xl mx-auto space-y-10">
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500"
          >
            <AlertCircle size={18} />
            <p className="text-sm font-medium">{error}</p>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {view === "upload" ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-10"
            >
              <div className="lg:col-span-8">
                <UploadZone onAnalyze={handleAnalyze} loading={loading} />
              </div>
              <div className="lg:col-span-4 space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <History size={18} className="text-primary" /> Recent Analyses
                  </h3>
                  <button className="text-xs text-muted-foreground hover:text-primary transition-colors">View All</button>
                </div>
                <div className="space-y-4">
                  <HistoryCard title="Senior Backend Engineer" company="Google" score={85} date="2h ago" />
                  <HistoryCard title="Product Designer" company="Meta" score={72} date="1d ago" />
                  <HistoryCard title="Data Scientist" company="OpenAI" score={91} date="3d ago" />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-10 pb-20"
            >
              <DashboardStats 
                atsScore={result?.ats?.overall_score || 0} 
                matchScore={result?.matching?.match_score || 0}
                grade={result?.ats?.grade || "F"}
              />
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-10">
                  <ResumeAnalysis data={result} />
                  <SkillGaps matching={result?.matching?.matching_keywords || []} missing={result?.matching?.missing_keywords || []} />
                </div>
                <div className="lg:col-span-4 space-y-10">
                  <SuggestionsFeed suggestions={result?.suggestions || []} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
