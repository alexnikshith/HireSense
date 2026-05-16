"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone"; // Need to install react-dropzone
import { Upload, FileText, Sparkles, Loader2, AlertCircle } from "lucide-react";

interface UploadZoneProps {
  onAnalyze: (file: File, jd: string) => void;
  loading: boolean;
}

export default function UploadZone({ onAnalyze, loading }: UploadZoneProps) {
  const [file, setFile] = useState<File | null>(null);
  const [jd, setJd] = useState("");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
  });

  const handleStartAnalysis = () => {
    if (file && jd.length >= 50) {
      onAnalyze(file, jd);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Resume Upload */}
        <div className="space-y-4">
          <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Resume (PDF)</label>
          <div 
            {...getRootProps()} 
            className={`aspect-square md:aspect-auto md:h-[300px] border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center p-8 transition-all cursor-pointer group ${
              isDragActive ? "border-primary bg-primary/5" : "border-white/10 hover:border-primary/50 hover:bg-white/5"
            }`}
          >
            <input {...getInputProps()} />
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-colors ${
              file ? "bg-green-500/20 text-green-500" : "bg-white/5 text-white/40 group-hover:text-primary group-hover:bg-primary/20"
            }`}>
              {file ? <FileText size={32} /> : <Upload size={32} />}
            </div>
            {file ? (
              <div className="text-center space-y-1">
                <p className="font-bold">{file.name}</p>
                <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB · Ready to analyze</p>
              </div>
            ) : (
              <div className="text-center space-y-1">
                <p className="font-bold">Drag & drop your resume</p>
                <p className="text-sm text-muted-foreground">PDF only, max 10MB</p>
              </div>
            )}
          </div>
        </div>

        {/* Job Description */}
        <div className="space-y-4">
          <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Job Description</label>
          <div className="relative">
            <textarea
              placeholder="Paste the job requirements here... (Min 50 chars)"
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              className="w-full h-[300px] bg-white/5 border border-white/10 rounded-[2rem] p-6 text-sm focus:outline-none focus:border-primary/50 transition-colors resize-none"
            />
            <div className="absolute bottom-6 right-6 text-[10px] font-mono text-muted-foreground">
              {jd.length} / 5000 chars
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleStartAnalysis}
          disabled={loading || !file || jd.length < 50}
          className={`px-12 py-5 rounded-2xl font-bold text-lg flex items-center gap-3 transition-all ${
            loading || !file || jd.length < 50
              ? "bg-white/5 text-white/20 cursor-not-allowed"
              : "bg-primary text-white shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:scale-[1.02]"
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" /> Analyzing Intelligence...
            </>
          ) : (
            <>
              <Sparkles className="w-6 h-6" /> Run Hiring Analysis
            </>
          )}
        </button>
      </div>

      {file && jd.length > 0 && jd.length < 50 && (
        <p className="text-center text-xs text-yellow-500/80 flex items-center justify-center gap-2">
          <AlertCircle size={14} /> Job description too short for accurate matching.
        </p>
      )}
    </div>
  );
}
