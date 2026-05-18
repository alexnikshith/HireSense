"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Briefcase, DollarSign, ExternalLink, Zap, CheckCircle2, Loader2 } from "lucide-react";

export default function JobHuntPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchJobs = async () => {
    setLoading(true);
    setError("");
    try {
      const baseUrl = process.env.NODE_ENV === "development" ? "http://127.0.0.1:8000" : "";
      const apiQuery = searchQuery.trim() === "" ? "software engineering" : searchQuery;
      const res = await fetch(`${baseUrl}/api/jobs?query=${encodeURIComponent(apiQuery)}&page=1`);
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.detail || "Failed to fetch jobs");
      
      // JSearch returns an array in data.data
      if (data.data && Array.isArray(data.data)) {
        // Map JSearch schema to our UI
        const formattedJobs = data.data.map((job: any) => ({
          id: job.job_id,
          title: job.job_title,
          company: job.employer_name,
          location: job.job_city ? `${job.job_city}, ${job.job_country}` : "Remote",
          salary: job.job_min_salary ? `$${job.job_min_salary / 1000}k - $${job.job_max_salary / 1000}k` : "Not disclosed",
          type: job.job_employment_type || "Full-time",
          match: Math.floor(Math.random() * (99 - 70 + 1) + 70), // Mock match score
          logo: job.employer_logo || "https://via.placeholder.com/150",
          posted: job.job_posted_at_datetime_utc ? new Date(job.job_posted_at_datetime_utc).toLocaleDateString() : "Recently",
          applied: false,
          apply_link: job.job_apply_link
        }));

        // Filter out jobs already applied by the user
        const storedIds = localStorage.getItem("user_applied_job_ids");
        const appliedIds = storedIds ? JSON.parse(storedIds) : [];
        const unappliedJobs = formattedJobs.filter((job: any) => !appliedIds.includes(job.id));

        setJobs(unappliedJobs);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []); // Fetch on mount

  const handleApply = (job: any) => {
    // 1. Get current applied job IDs
    const storedIds = localStorage.getItem("user_applied_job_ids");
    const appliedIds = storedIds ? JSON.parse(storedIds) : [];
    
    // Add new ID
    if (!appliedIds.includes(job.id)) {
      appliedIds.push(job.id);
      localStorage.setItem("user_applied_job_ids", JSON.stringify(appliedIds));
    }

    // 2. Get current applied jobs list
    const storedJobs = localStorage.getItem("user_applied_jobs_list");
    const appliedJobs = storedJobs ? JSON.parse(storedJobs) : [];
    
    // Add full job details
    const newAppliedJob = {
      ...job,
      status: "Applied",
      appliedAt: new Date().toLocaleDateString()
    };
    
    // Prevent duplicates in detailed list
    if (!appliedJobs.some((j: any) => j.id === job.id)) {
      appliedJobs.push(newAppliedJob);
      localStorage.setItem("user_applied_jobs_list", JSON.stringify(appliedJobs));
    }

    // 3. Open application link
    if (job.apply_link) window.open(job.apply_link, "_blank");

    // 4. Instantly remove from the frontend visible list
    setJobs(prevJobs => prevJobs.filter(j => j.id !== job.id));
  };

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    job.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Job Explorer</h1>
        <p className="text-muted-foreground text-sm mt-1">Discover and apply to roles tailored to your resume's strengths.</p>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex gap-4 items-center bg-muted/50 p-2 rounded-2xl border border-border">
        <div className="flex-1 flex items-center gap-3 px-4">
          <Search size={20} className="text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search by job title or company..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none py-3 text-sm focus:outline-none text-foreground"
          />
        </div>
        <button onClick={fetchJobs} disabled={loading} className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl text-sm transition-transform hover:scale-[1.02] disabled:opacity-50">
          {loading ? <Loader2 size={16} className="animate-spin inline mr-2" /> : null}
          Search Roles
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-200">
          Error loading jobs: {error}
        </div>
      )}

      {/* Job Listings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredJobs.map((job, index) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: index * 0.1 }}
            key={job.id} 
            className="bg-white border border-border rounded-[2rem] p-6 hover:shadow-lg transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-muted border border-border flex items-center justify-center overflow-hidden p-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={job.logo} alt={job.company} className="w-full h-full object-contain" onError={(e) => e.currentTarget.src = "https://via.placeholder.com/150"} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">{job.title}</h3>
                    <p className="text-muted-foreground text-sm font-medium">{job.company}</p>
                  </div>
                </div>
                
                {/* Match Badge */}
                <div className="flex flex-col items-end">
                  <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                    job.match >= 90 ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  }`}>
                    <Zap size={12} /> {job.match}% Match
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-2">{job.posted}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                <div className="px-3 py-1 bg-muted rounded-lg text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <MapPin size={12} /> {job.location}
                </div>
                <div className="px-3 py-1 bg-muted rounded-lg text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <DollarSign size={12} /> {job.salary}
                </div>
                <div className="px-3 py-1 bg-muted rounded-lg text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <Briefcase size={12} /> {job.type}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-4 pt-4 border-t border-border">
              {job.applied ? (
                <button disabled className="flex-1 py-3 bg-green-50 text-green-600 font-bold rounded-xl text-sm flex items-center justify-center gap-2 border border-green-200">
                  <CheckCircle2 size={16} /> Applied
                </button>
              ) : (
                <button onClick={() => handleApply(job)} className="flex-1 py-3 bg-foreground text-background font-bold rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-foreground/90 transition-all">
                  Quick Apply
                </button>
              )}
              <a href={job.apply_link} target="_blank" rel="noreferrer" className="px-4 py-3 bg-muted text-muted-foreground rounded-xl hover:bg-muted/80 transition-all flex items-center justify-center">
                <ExternalLink size={18} />
              </a>
            </div>
          </motion.div>
        ))}
      </div>
      
      {!loading && filteredJobs.length === 0 && !error && (
        <div className="text-center py-20 text-muted-foreground">
          <Search size={48} className="mx-auto mb-4 opacity-20" />
          <p>No jobs found matching your search.</p>
        </div>
      )}
    </div>
  );
}
