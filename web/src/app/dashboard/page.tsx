"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { 
  Upload, 
  FileText, 
  Sparkles, 
  Brain, 
  Target, 
  BarChart3, 
  History, 
  LayoutDashboard,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Plus
} from "lucide-react";
import DashboardStats from "@/components/dashboard/DashboardStats";
import ResumeAnalysis from "@/components/dashboard/ResumeAnalysis";
import SkillGaps from "@/components/dashboard/SkillGaps";
import SuggestionsFeed from "@/components/dashboard/SuggestionsFeed";
import HistoryCard from "@/components/dashboard/HistoryCard";
import UploadZone from "@/components/dashboard/UploadZone";

const API_BASE = "http://localhost:8000"; // Existing FastAPI backend

export default function Dashboard() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
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
      console.error(err);
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
    <div className="min-h-screen bg-[#0A0A0A] text-white flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 p-6 flex flex-col space-y-8 hidden lg:flex">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold">HireSense</span>
        </div>

        <nav className="flex-1 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-2 rounded-xl bg-primary/10 text-primary font-medium">
            <LayoutDashboard size={18} /> Dashboard
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-muted-foreground hover:bg-white/5 transition-colors">
            <History size={18} /> History
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-muted-foreground hover:bg-white/5 transition-colors">
            <Target size={18} /> Job Matches
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-muted-foreground hover:bg-white/5 transition-colors">
            <BarChart3 size={18} /> Analytics
          </button>
        </nav>

        <div className="glass-card p-4 rounded-2xl space-y-4">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Premium Plan</p>
          <p className="text-sm">Get unlimited AI suggestions and candidate ranking.</p>
          <button className="w-full py-2 bg-white text-black rounded-xl text-xs font-bold hover:bg-white/90 transition-colors">
            Upgrade Now
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="p-8 flex items-center justify-between border-b border-white/5">
          <div>
            <h1 className="text-2xl font-bold">Hiring Intelligence</h1>
            <p className="text-sm text-muted-foreground">AI-powered resume analysis & candidate insights.</p>
          </div>
          <div className="flex items-center gap-4">
            {view === "results" && (
              <button 
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 glass-button rounded-xl text-sm font-semibold"
              >
                <Plus size={16} /> New Analysis
              </button>
            )}
            <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center font-bold">
              N
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto space-y-8">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500">
              <AlertCircle size={18} />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <AnimatePresence mode="wait">
            {view === "upload" ? (
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8"
              >
                <div className="lg:col-span-8">
                  <UploadZone onAnalyze={handleAnalyze} loading={loading} />
                </div>
                <div className="lg:col-span-4 space-y-6">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <History size={18} className="text-primary" /> Recent History
                  </h3>
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
                className="space-y-8"
              >
                <DashboardStats 
                  atsScore={result?.ats?.overall_score || 0} 
                  matchScore={result?.matching?.match_score || 0}
                  grade={result?.ats?.grade || "F"}
                />
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-8 space-y-8">
                    <ResumeAnalysis data={result} />
                    <SkillGaps matching={result?.matching?.matching_keywords || []} missing={result?.matching?.missing_keywords || []} />
                  </div>
                  <div className="lg:col-span-4 space-y-8">
                    <SuggestionsFeed suggestions={result?.suggestions || []} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
