"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Briefcase, DollarSign, ExternalLink, Zap, CheckCircle2, Loader2, RefreshCw, Globe } from "lucide-react";

// Utility helper to map country codes to beautiful human-readable names
const getCountryName = (code: string) => {
  if (!code) return "";
  const countries: { [key: string]: string } = {
    "IN": "India",
    "US": "United States",
    "GB": "United Kingdom",
    "CA": "Canada",
    "AU": "Australia",
    "DE": "Germany",
    "FR": "France",
  };
  return countries[code.toUpperCase()] || code;
};

export default function JobHuntPage() {
  const [roleQuery, setRoleQuery] = useState("");
  const [countryFilter, setCountryFilter] = useState("IN");
  const [locationQuery, setLocationQuery] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("ALL");
  
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchJobs = async () => {
    setLoading(true);
    setError("");
    try {
      const baseUrl = process.env.NODE_ENV === "development" ? "http://127.0.0.1:8000" : "";
      
      // Combine inputs into a clean, searchable JSearch query
      const role = roleQuery.trim() === "" ? "software engineering" : roleQuery.trim();
      
      const countryName = getCountryName(countryFilter);
      let location = "";
      if (locationQuery.trim() === "") {
        // Default to the selected country (e.g. India) to fetch all jobs in the country
        location = countryName ? ` in ${countryName}` : "";
      } else {
        // Refined search within the selected country context
        const queryLower = locationQuery.trim().toLowerCase();
        if (countryName && !queryLower.includes(countryName.toLowerCase())) {
          location = ` in ${locationQuery.trim()}, ${countryName}`;
        } else {
          location = ` in ${locationQuery.trim()}`;
        }
      }

      const apiQuery = `${role}${location}`;

      const res = await fetch(`${baseUrl}/api/jobs?query=${encodeURIComponent(apiQuery)}&page=1`);
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.detail || "Failed to fetch jobs");
      
      if (data.data && Array.isArray(data.data)) {
        const formattedJobs = data.data.map((job: any) => ({
          id: job.job_id,
          title: job.job_title,
          company: job.employer_name,
          location: job.job_city ? `${job.job_city}, ${getCountryName(job.job_country)}` : (getCountryName(job.job_country) || "Remote"),
          salary: job.job_min_salary ? `$${job.job_min_salary / 1000}k - $${job.job_max_salary / 1000}k` : "Not disclosed",
          type: job.job_employment_type || "Full-time",
          match: Math.floor(Math.random() * (99 - 70 + 1) + 70), 
          logo: job.employer_logo || "https://via.placeholder.com/150",
          posted: job.job_posted_at_datetime_utc ? new Date(job.job_posted_at_datetime_utc).toLocaleDateString() : "Recently",
          applied: false,
          apply_link: job.job_apply_link
        }));

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
  }, [countryFilter]); // Fetch on mount or when country context selection changes

  const handleApply = (job: any) => {
    const currentCredits = parseInt(localStorage.getItem("user_credits") || "400");
    if (currentCredits < 100) {
      const wantToSubscribe = window.confirm(
        "You do not have enough credits to apply for this job. Please subscribe to a plan to unlock more opportunities."
      );
      if (wantToSubscribe) {
        window.location.href = "/dashboard/profile";
      }
      return;
    }

    const storedIds = localStorage.getItem("user_applied_job_ids");
    const appliedIds = storedIds ? JSON.parse(storedIds) : [];
    
    if (!appliedIds.includes(job.id)) {
      appliedIds.push(job.id);
      localStorage.setItem("user_applied_job_ids", JSON.stringify(appliedIds));
    }

    const storedJobs = localStorage.getItem("user_applied_jobs_list");
    const appliedJobs = storedJobs ? JSON.parse(storedJobs) : [];
    
    const newAppliedJob = {
      ...job,
      status: "Applied",
      appliedAt: new Date().toLocaleDateString()
    };
    
    if (!appliedJobs.some((j: any) => j.id === job.id)) {
      appliedJobs.push(newAppliedJob);
      localStorage.setItem("user_applied_jobs_list", JSON.stringify(appliedJobs));
    }

    // Deduct 100 credits
    const newCredits = currentCredits - 100;
    localStorage.setItem("user_credits", newCredits.toString());
    window.dispatchEvent(new Event("credits_updated"));

    // Sync with backend database
    try {
      const username = localStorage.getItem("user_name") || "nikshith";
      const plan = localStorage.getItem("active_plan") || "free";
      const baseUrl = process.env.NODE_ENV === "development" ? "http://127.0.0.1:8000" : "";
      fetch(`${baseUrl}/api/auth/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, credits: newCredits, active_plan: plan }),
      });
    } catch (e) {
      console.error("Failed to sync credits with backend:", e);
    }

    if (job.apply_link) window.open(job.apply_link, "_blank");
    setJobs(prevJobs => prevJobs.filter(j => j.id !== job.id));
  };

  // Get dynamic location placeholder based on country selection
  const getLocationPlaceholder = () => {
    switch (countryFilter) {
      case "IN":
        return "Search state or city in India (e.g. Bangalore, Delhi)...";
      case "US":
        return "Search state or city in US (e.g. California, New York)...";
      case "GB":
        return "Search city in UK (e.g. London, Manchester)...";
      case "CA":
        return "Search city in Canada (e.g. Toronto, Vancouver)...";
      case "AU":
        return "Search city in Australia (e.g. Sydney, Melbourne)...";
      default:
        return "Search state, city or region...";
    }
  };

  // Double filter - instant local filters for unmatched typing
  const filteredJobs = jobs.filter(job => {
    // 1. Role match: Title or Company contains roleQuery
    const matchesRole = roleQuery.trim() === "" || 
      job.title.toLowerCase().includes(roleQuery.toLowerCase()) || 
      job.company.toLowerCase().includes(roleQuery.toLowerCase());
      
    // 2. Location match: Location contains locationQuery
    const matchesLocation = locationQuery.trim() === "" ||
      job.location.toLowerCase().includes(locationQuery.toLowerCase());
      
    // 3. Job Type match
    const cleanType = job.type.toLowerCase().replace("-", "");
    const matchesType = jobTypeFilter === "ALL" ||
      (jobTypeFilter === "FULLTIME" && cleanType.includes("fulltime")) ||
      (jobTypeFilter === "PARTTIME" && cleanType.includes("parttime")) ||
      (jobTypeFilter === "CONTRACTOR" && cleanType.includes("contract")) ||
      (jobTypeFilter === "INTERN" && cleanType.includes("intern"));
      
    return matchesRole && matchesLocation && matchesType;
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Job Explorer</h1>
        <p className="text-muted-foreground text-sm mt-1">Discover, filter, and instantly apply to active, real-world job roles matching your location and skillset.</p>
      </div>

      {/* Advanced Filter Panel */}
      <div className="bg-white border border-border p-5 rounded-[2.5rem] shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* Keyword / Role Input */}
          <div className="md:col-span-4 flex items-center gap-3 px-4 py-3 bg-muted/40 border border-border rounded-2xl focus-within:border-primary/50 transition-all">
            <Search size={18} className="text-muted-foreground shrink-0" />
            <div className="flex-1">
              <label className="block text-[8px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Keywords / Role</label>
              <input 
                type="text" 
                placeholder="e.g. Frontend, React, Manager..." 
                value={roleQuery}
                onChange={(e) => setRoleQuery(e.target.value)}
                className="w-full bg-transparent border-none text-foreground text-sm focus:outline-none p-0 font-medium"
              />
            </div>
          </div>

          {/* Country Selection */}
          <div className="md:col-span-2 flex items-center gap-3 px-4 py-3 bg-muted/40 border border-border rounded-2xl focus-within:border-primary/50 transition-all">
            <Globe size={18} className="text-muted-foreground shrink-0" />
            <div className="flex-1">
              <label className="block text-[8px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Country</label>
              <select 
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                className="w-full bg-transparent border-none text-foreground text-sm focus:outline-none p-0 font-bold cursor-pointer"
              >
                <option value="IN">India</option>
                <option value="US">United States</option>
                <option value="GB">United Kingdom</option>
                <option value="CA">Canada</option>
                <option value="AU">Australia</option>
                <option value="GLOBAL">Global</option>
              </select>
            </div>
          </div>

          {/* Location Input */}
          <div className="md:col-span-3 flex items-center gap-3 px-4 py-3 bg-muted/40 border border-border rounded-2xl focus-within:border-primary/50 transition-all">
            <MapPin size={18} className="text-muted-foreground shrink-0" />
            <div className="flex-1">
              <label className="block text-[8px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Location / State / City</label>
              <input 
                type="text" 
                placeholder={getLocationPlaceholder()}
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                className="w-full bg-transparent border-none text-foreground text-sm focus:outline-none p-0 font-medium"
              />
            </div>
          </div>

          {/* Job Type Filter */}
          <div className="md:col-span-3 flex items-center gap-3 px-4 py-3 bg-muted/40 border border-border rounded-2xl focus-within:border-primary/50 transition-all">
            <Briefcase size={18} className="text-muted-foreground shrink-0" />
            <div className="flex-1">
              <label className="block text-[8px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Employment Type</label>
              <select 
                value={jobTypeFilter}
                onChange={(e) => setJobTypeFilter(e.target.value)}
                className="w-full bg-transparent border-none text-foreground text-sm focus:outline-none p-0 font-bold cursor-pointer"
              >
                <option value="ALL">All Types</option>
                <option value="FULLTIME">Full-time</option>
                <option value="PARTTIME">Part-time</option>
                <option value="CONTRACTOR">Contract</option>
                <option value="INTERN">Internship</option>
              </select>
            </div>
          </div>

        </div>

        {/* Action Bar */}
        <div className="flex justify-between items-center pt-2">
          <span className="text-[10px] text-muted-foreground italic">
            *Typing filters the loaded list instantly. Click "Search Jobs" to crawl the internet for new matches.
          </span>
          <button 
            onClick={fetchJobs} 
            disabled={loading} 
            className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-2xl text-xs flex items-center gap-2 hover:opacity-90 transition-all shadow-[0_4px_12px_rgba(139,92,246,0.15)] disabled:opacity-50"
          >
            {loading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <RefreshCw size={14} />
            )}
            Search Global Network
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-[1.5rem] border border-red-200 text-xs">
          Error loading jobs: {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-24 text-primary gap-3">
          <Loader2 size={40} className="animate-spin" />
          <p className="text-sm font-bold animate-pulse text-muted-foreground">Scouting recruiters & aggregators in real-time...</p>
        </div>
      )}

      {/* Job Listings Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredJobs.map((job, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: index * 0.05 }}
              key={job.id} 
              className="bg-white border border-border rounded-[2rem] p-6 hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-muted border border-border flex items-center justify-center overflow-hidden p-2 shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={job.logo} alt={job.company} className="w-full h-full object-contain" onError={(e) => e.currentTarget.src = "https://via.placeholder.com/150"} />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors leading-snug">{job.title}</h3>
                      <p className="text-muted-foreground text-xs font-semibold mt-0.5">{job.company}</p>
                    </div>
                  </div>
                  
                  {/* Match Score */}
                  <div className="flex flex-col items-end">
                    <div className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 shrink-0 ${
                      job.match >= 90 ? "bg-green-50 text-green-700 border border-green-200" : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}>
                      <Zap size={10} /> {job.match}% Match
                    </div>
                    <p className="text-[9px] text-muted-foreground mt-2">{job.posted}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <div className="px-2.5 py-1 bg-muted/60 rounded-lg text-[10px] font-bold text-muted-foreground flex items-center gap-1">
                    <MapPin size={10} /> {job.location}
                  </div>
                  <div className="px-2.5 py-1 bg-muted/60 rounded-lg text-[10px] font-bold text-muted-foreground flex items-center gap-1">
                    <DollarSign size={10} /> {job.salary}
                  </div>
                  <div className="px-2.5 py-1 bg-muted/60 rounded-lg text-[10px] font-bold text-muted-foreground flex items-center gap-1">
                    <Briefcase size={10} /> {job.type}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-4 pt-4 border-t border-border">
                <button onClick={() => handleApply(job)} className="flex-1 py-2.5 bg-foreground text-background font-bold rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-foreground/90 transition-all">
                  Quick Apply
                </button>
                <button onClick={() => handleApply(job)} className="px-3 py-2.5 bg-muted text-muted-foreground rounded-xl hover:bg-muted/80 transition-all flex items-center justify-center">
                  <ExternalLink size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      
      {!loading && filteredJobs.length === 0 && !error && (
        <div className="text-center py-20 text-muted-foreground">
          <Search size={48} className="mx-auto mb-4 opacity-20" />
          <p className="font-bold text-sm">No jobs found matching your criteria.</p>
          <p className="text-xs text-muted-foreground mt-1">Try broadening your role, location, or type filters and click "Search Global Network"!</p>
        </div>
      )}
    </div>
  );
}
