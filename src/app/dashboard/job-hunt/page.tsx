"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Briefcase, DollarSign, ExternalLink, Zap, CheckCircle2 } from "lucide-react";

// Realistic mock data for the initial UI
const MOCK_JOBS = [
  {
    id: 1,
    title: "Senior Frontend Engineer",
    company: "Vercel",
    location: "Remote",
    salary: "$140k - $180k",
    type: "Full-time",
    match: 94,
    logo: "https://logo.clearbit.com/vercel.com",
    posted: "2 hours ago",
    applied: false
  },
  {
    id: 2,
    title: "Product Designer",
    company: "Stripe",
    location: "San Francisco, CA",
    salary: "$130k - $170k",
    type: "Full-time",
    match: 88,
    logo: "https://logo.clearbit.com/stripe.com",
    posted: "5 hours ago",
    applied: false
  },
  {
    id: 3,
    title: "Full Stack Developer",
    company: "Linear",
    location: "Remote",
    salary: "$120k - $160k",
    type: "Full-time",
    match: 91,
    logo: "https://logo.clearbit.com/linear.app",
    posted: "1 day ago",
    applied: true
  },
  {
    id: 4,
    title: "AI Engineer",
    company: "OpenAI",
    location: "San Francisco, CA",
    salary: "$180k - $250k",
    type: "Full-time",
    match: 75,
    logo: "https://logo.clearbit.com/openai.com",
    posted: "2 days ago",
    applied: false
  }
];

export default function JobHuntPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [jobs, setJobs] = useState(MOCK_JOBS);

  const handleApply = (id: number) => {
    // In a real app, this would deduct credits and save to Applications DB
    setJobs(jobs.map(job => job.id === id ? { ...job, applied: true } : job));
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
        <button className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl text-sm transition-transform hover:scale-[1.02]">
          Search Roles
        </button>
      </div>

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
                <button onClick={() => handleApply(job.id)} className="flex-1 py-3 bg-foreground text-background font-bold rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-foreground/90 transition-all">
                  Quick Apply
                </button>
              )}
              <button className="px-4 py-3 bg-muted text-muted-foreground rounded-xl hover:bg-muted/80 transition-all">
                <ExternalLink size={18} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
      
      {filteredJobs.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          <Search size={48} className="mx-auto mb-4 opacity-20" />
          <p>No jobs found matching your search.</p>
        </div>
      )}
    </div>
  );
}
