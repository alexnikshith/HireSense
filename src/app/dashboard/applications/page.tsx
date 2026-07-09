"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Clock, Calendar, CheckCircle2, XCircle, ExternalLink, Trash2, Search, Sparkles, Briefcase, Mail, Loader2, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";

interface AppliedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  logo: string;
  apply_link: string;
  status: "Applied" | "Interviewing" | "Offered" | "Rejected";
  appliedAt: string;
  autoUpdated?: boolean;
}

export default function ApplicationsPage() {
  const [appliedJobs, setAppliedJobs] = useState<AppliedJob[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const username = localStorage.getItem("user_name") || "default";
    let stored = localStorage.getItem(`user_applied_jobs_list_${username}`);
    
    if (!stored) {
      const legacyStored = localStorage.getItem("user_applied_jobs_list");
      if (legacyStored) {
        stored = legacyStored;
        localStorage.setItem(`user_applied_jobs_list_${username}`, legacyStored);
      }
    }
    if (stored) {
      setAppliedJobs(JSON.parse(stored));
    }
  }, []);

  const updateStatus = (id: string, newStatus: any) => {
    const updated = appliedJobs.map(job => 
      job.id === id ? { ...job, status: newStatus, autoUpdated: false } : job
    );
    setAppliedJobs(updated);
    const username = localStorage.getItem("user_name") || "default";
    localStorage.setItem(`user_applied_jobs_list_${username}`, JSON.stringify(updated));
  };

  const deleteApplication = (id: string) => {
    if (confirm("Are you sure you want to remove this job from your tracking list?")) {
      const updated = appliedJobs.filter(job => job.id !== id);
      setAppliedJobs(updated);
      const username = localStorage.getItem("user_name") || "default";
      localStorage.setItem(`user_applied_jobs_list_${username}`, JSON.stringify(updated));

      // Also clean it out of the user_applied_job_ids list so they could see it in Job Hunt again if they want
      const storedIds = localStorage.getItem(`user_applied_job_ids_${username}`);
      if (storedIds) {
        const ids = JSON.parse(storedIds);
        const updatedIds = ids.filter((currId: string) => currId !== id);
        localStorage.setItem(`user_applied_job_ids_${username}`, JSON.stringify(updatedIds));
      }
    }
  };

  const handleConnectGoogle = () => {
    const baseUrl = process.env.NODE_ENV === "development" ? "http://localhost:8000" : "";
    window.location.href = `${baseUrl}/api/auth/google/login`;
  };

  const handleSyncEmails = async () => {
    if (appliedJobs.length === 0) return;
    
    setIsSyncing(true);
    try {
      const username = localStorage.getItem("user_name") || "default";
      const baseUrl = process.env.NODE_ENV === "development" ? "http://127.0.0.1:8000" : "";
      
      const trackedCompanies = Array.from(new Set(appliedJobs.map(j => j.company)));
      
      const res = await fetch(`${baseUrl}/api/email/sync`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          tracked_companies: trackedCompanies
        }),
      });
      
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 404 || res.status === 401) {
          alert("Please connect your Google Account first.");
          handleConnectGoogle();
          return;
        }
        throw new Error(data.detail || "Failed to sync emails");
      }
      
      if (data.updates && data.updates.length > 0) {
        let anyChanges = false;
        const updatedJobs = appliedJobs.map(job => {
          const update = data.updates.find((u: any) => u.company.toLowerCase() === job.company.toLowerCase());
          if (update && update.new_status !== job.status) {
            anyChanges = true;
            return { ...job, status: update.new_status, autoUpdated: true };
          }
          return job;
        });
        
        if (anyChanges) {
          setAppliedJobs(updatedJobs);
          localStorage.setItem(`user_applied_jobs_list_${username}`, JSON.stringify(updatedJobs));
          alert(`Synced successfully! Updated ${data.updates.length} applications based on recent emails.`);
        } else {
          alert("Synced successfully! No new status updates found in your recent emails.");
        }
      } else {
        alert("Synced successfully! No emails found regarding your tracked applications.");
      }
      
    } catch (err: any) {
      alert("Error syncing emails: " + err.message);
    } finally {
      setIsSyncing(false);
    }
  };

  // Calculate dynamic stats
  const stats = {
    applied: appliedJobs.filter(j => j.status === "Applied").length,
    interviewing: appliedJobs.filter(j => j.status === "Interviewing").length,
    offered: appliedJobs.filter(j => j.status === "Offered").length,
    rejected: appliedJobs.filter(j => j.status === "Rejected").length,
  };

  const filteredJobs = appliedJobs.filter(job => 
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Applications CRM</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage and track your active job applications in real-time.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleConnectGoogle}
            className="px-4 py-2 bg-muted text-foreground text-xs font-bold rounded-xl border border-border hover:bg-muted/80 transition-all flex items-center gap-2 shadow-sm"
          >
            <Mail size={14} /> Connect Google Account
          </button>
          <button 
            onClick={handleSyncEmails}
            disabled={isSyncing}
            className="px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl hover:opacity-90 transition-all flex items-center gap-2 shadow-[0_4px_12px_rgba(139,92,246,0.15)] disabled:opacity-50"
          >
            {isSyncing ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />} 
            Sync Emails
          </button>
        </div>
      </div>

      {/* Dynamic Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: "Applied", val: stats.applied, color: "border-blue-200 bg-blue-50/50 text-blue-700" },
          { label: "Interviewing", val: stats.interviewing, color: "border-amber-200 bg-amber-50/50 text-amber-700" },
          { label: "Offered", val: stats.offered, color: "border-green-200 bg-green-50/50 text-green-700" },
          { label: "Rejected", val: stats.rejected, color: "border-red-200 bg-red-50/50 text-red-700" },
        ].map((s, i) => (
          <div key={i} className={`p-6 rounded-[2rem] border ${s.color} transition-all duration-300`}>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">{s.label}</p>
            <div className="text-4xl font-extrabold mt-2">{s.val}</div>
          </div>
        ))}
      </div>

      {/* Control Bar */}
      <div className="flex gap-4 items-center bg-muted/40 p-2 rounded-2xl border border-border">
        <div className="flex-1 flex items-center gap-3 px-4">
          <Search size={18} className="text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search tracked applications..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none py-2 text-sm focus:outline-none text-foreground"
          />
        </div>
      </div>

      {/* Tracking Sheet Container */}
      <div className="bg-white border border-border rounded-[2.5rem] overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="px-8 py-5 font-bold uppercase tracking-widest text-muted-foreground text-[10px]">Company & Role</th>
                <th className="px-8 py-5 font-bold uppercase tracking-widest text-muted-foreground text-[10px]">Location & Details</th>
                <th className="px-8 py-5 font-bold uppercase tracking-widest text-muted-foreground text-[10px]">Applied On</th>
                <th className="px-8 py-5 font-bold uppercase tracking-widest text-muted-foreground text-[10px]">Status Tracker</th>
                <th className="px-8 py-5 font-bold uppercase tracking-widest text-muted-foreground text-[10px] text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-16 text-center text-muted-foreground">
                    <Briefcase className="mx-auto mb-3 opacity-25" size={40} />
                    <p className="font-medium text-sm text-foreground">No applications found</p>
                    <p className="text-xs text-muted-foreground mt-1">Start applying to roles under the Job Explorer tab to track them here!</p>
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job, index) => (
                  <tr key={job.id} className="border-b border-border hover:bg-muted/10 transition-colors">
                    {/* Role & Company */}
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center border border-border overflow-hidden p-1.5 shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={job.logo} alt={job.company} className="w-full h-full object-contain" onError={(e) => e.currentTarget.src = "https://via.placeholder.com/150"} />
                        </div>
                        <div>
                          <h3 className="font-bold text-foreground text-sm">{job.title}</h3>
                          <p className="text-muted-foreground text-xs">{job.company}</p>
                        </div>
                      </div>
                    </td>

                    {/* Location & Details */}
                    <td className="px-8 py-6">
                      <div className="space-y-1">
                        <p className="text-foreground font-medium text-xs">{job.location}</p>
                        <p className="text-muted-foreground text-[10px] uppercase tracking-wider font-semibold">{job.type} • {job.salary}</p>
                      </div>
                    </td>

                    {/* Applied Date */}
                    <td className="px-8 py-6">
                      <div className="text-muted-foreground text-xs font-mono">{job.appliedAt}</div>
                      {job.autoUpdated && (
                        <div className="mt-1 text-[9px] font-bold text-primary flex items-center gap-1">
                          <Sparkles size={10} /> Auto-synced
                        </div>
                      )}
                    </td>

                    {/* Status Dropdown */}
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        {job.status === "Applied" && <Clock size={14} className="text-blue-500 shrink-0" />}
                        {job.status === "Interviewing" && <Calendar size={14} className="text-amber-500 shrink-0" />}
                        {job.status === "Offered" && <CheckCircle2 size={14} className="text-green-500 shrink-0" />}
                        {job.status === "Rejected" && <XCircle size={14} className="text-red-500 shrink-0" />}
                        
                        <select
                          value={job.status}
                          onChange={(e) => updateStatus(job.id, e.target.value)}
                          className={`text-xs font-bold rounded-xl py-1.5 px-3 focus:outline-none border border-transparent transition-all cursor-pointer ${
                            job.status === "Applied" ? "bg-blue-50 text-blue-700 hover:bg-blue-100" :
                            job.status === "Interviewing" ? "bg-amber-50 text-amber-700 hover:bg-amber-100" :
                            job.status === "Offered" ? "bg-green-50 text-green-700 hover:bg-green-100" :
                            "bg-red-50 text-red-700 hover:bg-red-100"
                          }`}
                        >
                          <option value="Applied">Applied</option>
                          <option value="Interviewing">Interviewing</option>
                          <option value="Offered">Offered</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-center gap-3">
                        <a 
                          href={job.apply_link} 
                          target="_blank" 
                          rel="noreferrer" 
                          title="View application link"
                          className="p-2 text-muted-foreground hover:text-primary hover:bg-muted rounded-xl transition-all"
                        >
                          <ExternalLink size={16} />
                        </a>
                        <button 
                          onClick={() => deleteApplication(job.id)} 
                          title="Delete application"
                          className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>


    </div>
  );
}
