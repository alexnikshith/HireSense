"use client";

import { motion } from "framer-motion";
import { Upload, FileText, CheckCircle2, AlertCircle, Sparkles, Loader2, RefreshCw } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function DashboardPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [persistedFileName, setPersistedFileName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [activePlan, setActivePlan] = useState("free");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load state from local storage on mount to survive navigation and page reloads!
  useEffect(() => {
    const savedResult = localStorage.getItem("last_analysis_result");
    if (savedResult) {
      setResult(JSON.parse(savedResult));
    }

    const savedDesc = localStorage.getItem("last_job_description");
    if (savedDesc) {
      setJobDescription(savedDesc);
    }

    const savedFileName = localStorage.getItem("last_uploaded_filename");
    if (savedFileName) {
      setPersistedFileName(savedFileName);
    }

    const plan = localStorage.getItem("active_plan") || "free";
    setActivePlan(plan);
  }, []);
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPersistedFileName(file.name);
      localStorage.setItem("last_uploaded_filename", file.name);
      setError(null);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPersistedFileName("");
    setJobDescription("");
    setResult(null);
    setError(null);
    
    // Clear cache
    localStorage.removeItem("last_analysis_result");
    localStorage.removeItem("last_job_description");
    localStorage.removeItem("last_uploaded_filename");

    // Reset input element
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile && !persistedFileName) {
      setError("Please upload a resume first.");
      return;
    }

    if (!jobDescription.trim()) {
      setError("Please paste a target job description.");
      return;
    }

    // Since raw File objects can't be saved in localStorage, if they navigate back and want to re-run,
    // they need to drag/select the file again so we can upload it to backend.
    if (!selectedFile) {
      setError("Session refreshed. Please select your resume file again to run a new scan!");
      return;
    }

    const currentCredits = parseInt(localStorage.getItem("user_credits") || "400");
    if (currentCredits < 50) {
      setError("Not enough credits to run analysis. Please subscribe in your Profile to get more credits.");
      return;
    }
    
    setError(null);
    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("job_description", jobDescription);

      const res = await fetch(`/api/analyze`, {
        method: "POST",
        body: formData,
      });
      
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        throw new Error("Cannot reach Python backend. Please make sure you are running 'python api/index.py' in a separate terminal!");
      }

      if (!res.ok) throw new Error(data.detail || "Analysis failed");
      
      // Deduct credits on success
      const newCredits = currentCredits - 50;
      localStorage.setItem("user_credits", newCredits.toString());
      window.dispatchEvent(new Event("credits_updated"));

      // Sync with backend database
      try {
        const username = localStorage.getItem("user_name") || "nikshith";
        const plan = localStorage.getItem("active_plan") || "free";
        fetch(`/api/auth/update`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, credits: newCredits, active_plan: plan }),
        });
      } catch (e) {
        console.error("Failed to sync credits with backend:", e);
      }

      setResult(data);
      localStorage.setItem("last_analysis_result", JSON.stringify(data));
      
      // Auto-log this file under user_resumes_list if empty
      const stored = localStorage.getItem("user_resumes_list");
      const existingResumes = stored ? JSON.parse(stored) : [];
      if (!existingResumes.some((r: any) => r.name === selectedFile.name)) {
        const updated = [...existingResumes, { name: selectedFile.name, type: "Uploaded" }];
        localStorage.setItem("user_resumes_list", JSON.stringify(updated));
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during analysis.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Intelligence Hub</h1>
          <p className="text-muted-foreground text-sm">Analyze your resume against any job description.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 glass-card rounded-xl text-xs font-bold flex items-center gap-2 border-border capitalize">
            <Sparkles size={14} className="text-primary" /> {activePlan} Plan
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Input */}
        <div className="lg:col-span-7 space-y-8">
          <div className="glass-card p-8 rounded-[2.5rem] border-border space-y-6 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
             <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Resume Upload</h3>
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".pdf,.doc,.docx" />
                <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-border rounded-[2rem] p-12 flex flex-col items-center justify-center gap-4 hover:border-primary/50 hover:bg-muted transition-all cursor-pointer group">
                   <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:scale-110 transition-all">
                     {(selectedFile || persistedFileName) ? <FileText size={32} className="text-primary" /> : <Upload size={32} />}
                   </div>
                   <div className="text-center text-foreground">
                     <p className="font-bold">{(selectedFile || persistedFileName) ? (selectedFile?.name || persistedFileName) : "Drop your resume here or click to browse"}</p>
                     <p className="text-xs text-muted-foreground mt-1">{(selectedFile || persistedFileName) ? "File loaded successfully" : "PDF format highly recommended"}</p>
                   </div>
                </div>
             </div>

             <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Job Description</h3>
                <textarea 
                   value={jobDescription}
                   onChange={(e) => {
                     setJobDescription(e.target.value);
                     localStorage.setItem("last_job_description", e.target.value);
                   }}
                   placeholder="Paste the job description here..."
                   className="w-full bg-transparent border border-border rounded-3xl p-6 min-h-[200px] text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all resize-none"
                />
             </div>

             {error && (
               <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-sm flex items-center gap-2">
                 <AlertCircle size={16} /> {error}
               </div>
             )}

             <div className="flex flex-col sm:flex-row gap-4">
               <button 
                 onClick={handleAnalyze} 
                 disabled={loading} 
                 className="flex-1 py-5 bg-primary text-primary-foreground rounded-3xl font-bold text-lg shadow-md hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
               >
                  {loading ? <><Loader2 className="animate-spin" /> Analyzing...</> : "Run AI Analysis"}
               </button>

               {(selectedFile || persistedFileName || result) && (
                 <button 
                   onClick={handleReset} 
                   className="py-5 px-6 bg-muted hover:bg-muted/80 text-foreground border border-border rounded-3xl font-bold text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                 >
                   <RefreshCw size={16} /> Upload Another Resume
                 </button>
               )}
             </div>
          </div>
        </div>

        {/* Right: Insights */}
        <div className="lg:col-span-5 space-y-8">
          <div className="glass-card p-8 rounded-[2.5rem] border-border space-y-6 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Analysis Status</h3>
            
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-center gap-4 text-primary">
                 <Loader2 size={48} className="animate-spin opacity-50" />
                 <p className="text-sm font-bold animate-pulse">Running advanced AI analysis...</p>
              </div>
            ) : result ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-6 bg-muted rounded-3xl border border-border">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">ATS Score</p>
                    <div className="text-4xl font-bold text-foreground">{result.ats?.overall_score || 0}/100</div>
                  </div>
                  <div className="w-16 h-16 rounded-full border-4 border-primary flex items-center justify-center font-bold text-xl text-primary bg-white">{result.ats?.grade || "N/A"}</div>
                </div>

                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-2">Top Suggestions</p>
                  {result.suggestions?.priority_actions?.slice(0, 3).map((s: string, i: number) => (
                    <div key={i} className="p-4 bg-muted rounded-2xl text-sm border border-border flex gap-3 items-start text-foreground">
                      <Sparkles size={16} className="text-primary mt-0.5 shrink-0" />
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center gap-4 text-muted-foreground">
                 <AlertCircle size={48} className="opacity-20" />
                 <p className="text-sm max-w-[200px]">Upload a resume and job description to start generating insights.</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card p-6 rounded-[2rem] border-border text-foreground bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Match Rate</p>
              <div className="text-2xl font-bold">{result?.matching?.match_score ? `${result.matching.match_score}%` : "--"}</div>
            </div>
            <div className="glass-card p-6 rounded-[2rem] border-border text-foreground bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Word Count</p>
              <div className="text-2xl font-bold text-primary italic">{result?.resume_meta?.word_count || "--"}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
