"use client";

import { motion } from "framer-motion";
import { FileText, Plus, MoreVertical } from "lucide-react";
import { useState, useRef } from "react";

export default function ResumesPage() {
  const [resumes, setResumes] = useState<{name: string, type: string}[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const newResume = {
        name: e.target.files[0].name,
        type: "Uploaded"
      };
      setResumes([...resumes, newResume]);
    }
  };
  return (
    <div className="p-8 space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Resumes</h1>
        <div>
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".pdf,.doc,.docx" />
          <button onClick={() => fileInputRef.current?.click()} className="px-6 py-3 bg-primary text-white rounded-2xl flex items-center gap-2 font-bold text-sm shadow-[0_0_20px_rgba(139,92,246,0.3)]"><Plus size={18} /> Add New</button>
        </div>
      </div>

      {resumes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground glass-card rounded-[2.5rem] border-white/5">
          <FileText size={48} className="opacity-20 mb-4" />
          <p className="text-sm">No resumes uploaded yet. Click "Add New" to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {resumes.map((r, i) => (
            <div key={i} className="glass-card p-6 rounded-[2rem] border-white/5 space-y-6 hover:border-primary/50 transition-all cursor-pointer group">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors"><FileText size={24} /></div>
                <MoreVertical size={16} className="text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-bold text-sm truncate">{r.name}</h3>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{r.type}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
