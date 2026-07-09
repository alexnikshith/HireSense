"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, Sparkles, Zap, Brain, Target, BarChart3, 
  ShieldCheck, FileText, CheckCircle2, ChevronDown, Play,
  FolderHeart, Cpu, Layers, HelpCircle, UserCheck
} from "lucide-react";
import Link from "next/link";

const stats = [
  { value: "400+", label: "Initial Credits Free" },
  { value: "85%", label: "Average ATS Boost" },
  { value: "10k+", label: "Resumes Optimized" },
  { value: "15x", label: "Faster Job Fit Checks" }
];

const features = [
  {
    title: "🧠 Intelligence Hub",
    desc: "Parse your PDF resume and compute standard ATS scores instantly against any job description.",
    icon: <Cpu className="w-6 h-6 text-primary" />,
    badge: "AI Powered"
  },
  {
    title: "⚡ Bullet Optimizer",
    desc: "Scan experience bullets for weak verbs and missing numbers, then rewrite them in one click.",
    icon: <Zap className="w-6 h-6 text-primary" />,
    badge: "Interactive"
  },
  {
    title: "🔍 Job Explorer CRM",
    desc: "Browse real-time global developer roles matched to your skills, and track jobs in a Kanban board.",
    icon: <Target className="w-6 h-6 text-primary" />,
    badge: "JSearch API"
  },
  {
    title: "📊 Trajectory Analytics",
    desc: "Analyze your profile mapping against 100+ developer competencies and track score history.",
    icon: <BarChart3 className="w-6 h-6 text-primary" />,
    badge: "Recharts Enabled"
  },
  {
    title: "💳 Sandbox Wallet",
    desc: "Top up credits using our client-side sandbox payment overlay integrated with Razorpay SDK.",
    icon: <Layers className="w-6 h-6 text-primary" />,
    badge: "Secured"
  },
  {
    title: "🛡️ Formatting Guard",
    desc: "Instantly flags multi-page overflows, low text density, complex tables, and image blocks.",
    icon: <ShieldCheck className="w-6 h-6 text-primary" />,
    badge: "ATS Compliant"
  }
];

const faqs = [
  {
    q: "How does the ATS scoring formula work?",
    a: "The score is a weighted combination of Keyword Relevance (30%), Section Completeness (25%), Formatting Checks (15%), Action Verb Density (10%), Quantification Metrics (10%), and Text Length (10%)."
  },
  {
    q: "Is the Razorpay payment integration real?",
    a: "No, the payment system runs strictly in Razorpay Sandbox (Test Mode). It uses standard key triggers, so you can test mock checkout tiers without entering real payment info."
  },
  {
    q: "How do I optimize individual bullet points?",
    a: "Navigate to the Alter Resume tab, type in your bullet points, and scan. The engine will identify passive starter words and prompt optimized suggestions with active verbs and quantifiable metrics."
  },
  {
    q: "What file formats does the parser support?",
    a: "It is highly optimized for PDF parsing via PDFMiner.six to avoid parsing corruption, but also supports standard Word doc formats (.doc, .docx)."
  }
];

export default function LandingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [scanState, setScanState] = useState<"idle" | "scanning" | "done">("idle");
  const [simulatedScore, setSimulatedScore] = useState<number>(0);

  const startSimulatedScan = () => {
    if (scanState === "scanning") return;
    setScanState("scanning");
    setSimulatedScore(0);
    
    setTimeout(() => {
      setScanState("done");
      // Animate score count up
      let current = 0;
      const interval = setInterval(() => {
        if (current >= 87) {
          clearInterval(interval);
        } else {
          current += 3;
          setSimulatedScore(Math.min(current, 87));
        }
      }, 30);
    }, 2000);
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden font-sans">
      {/* Background Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-5%] left-[-5%] w-[45%] h-[45%] bg-primary/5 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[45%] h-[45%] bg-primary/5 rounded-full blur-[140px] animate-pulse" />
      </div>

      {/* Floating Header */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-6xl bg-white/70 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-border rounded-[2rem] px-6 py-4 flex items-center justify-between transition-all">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Talent Scope Logo" className="w-8 h-8 rounded-xl object-contain border border-border" />
          <span className="text-lg font-bold tracking-tight text-foreground flex items-center gap-1.5">
            Talent Scope <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">AI v2</span>
          </span>
        </div>
        
        <div className="hidden md:flex gap-8 text-sm font-medium text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#demo" className="hover:text-foreground transition-colors">Interactive Demo</a>
          <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login" className="px-4 py-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-all">
            Log In
          </Link>
          <Link href="/signup" className="px-5 py-2.5 bg-black text-white text-sm font-bold rounded-2xl hover:opacity-90 active:scale-[0.98] transition-all shadow-sm">
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-44 pb-20 container max-w-5xl px-6 mx-auto flex flex-col items-center text-center">
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-border shadow-[0_2px_10px_rgba(0,0,0,0.01)] rounded-full text-xs font-bold text-muted-foreground mb-6"
        >
          <Sparkles size={12} className="text-amber-500 animate-spin" />
          <span>Next-Generation Resume Intelligence SaaS</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1] mb-6"
        >
          Optimize your resume for <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-500 italic">
            Recruiter Clearances.
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground text-base sm:text-lg max-w-2xl leading-relaxed mb-10"
        >
          The ultimate portfolio tool for modern software developers. Upload your resume, 
          compare keyword mappings in real time, fix passive experience bullets, and browse active jobs.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link href="/signup" className="px-8 py-4 bg-black text-white rounded-2xl font-bold text-base flex items-center justify-center gap-2 group shadow-md hover:opacity-90 active:scale-[0.98] transition-all">
            Get Started Free <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <a href="#demo" className="px-8 py-4 bg-white border border-border text-foreground rounded-2xl font-bold text-base flex items-center justify-center gap-2 hover:bg-slate-50 transition-all shadow-[0_2px_10px_rgba(0,0,0,0.01)]">
            <Play size={16} className="fill-current" /> Try Simulation
          </a>
        </motion.div>
      </section>

      {/* Stats Counter Section */}
      <section className="relative z-10 py-10 border-y border-border bg-white/40 backdrop-blur-sm">
        <div className="container max-w-5xl px-6 mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s, i) => (
            <div key={i} className="space-y-1">
              <p className="text-3xl font-extrabold tracking-tight text-foreground">{s.value}</p>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Simulator Section */}
      <section id="demo" className="relative z-10 py-24 container max-w-5xl px-6 mx-auto">
        <div className="text-center space-y-4 mb-14">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Interactive Scanning Simulation</h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Experience the TalentScope parser engine layout. Click the simulation button below to run a mock review on sample code resume bytes.
          </p>
        </div>

        <div className="bg-white border border-border rounded-[2.5rem] overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.015)] relative">
          {/* Mockup Header */}
          <div className="h-14 border-b border-border bg-slate-50/50 flex items-center justify-between px-6">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
              <div className="w-3 h-3 rounded-full bg-green-400/80" />
            </div>
            <div className="text-xs font-bold text-muted-foreground flex items-center gap-1.5 bg-white border border-border px-3 py-1 rounded-full shadow-sm">
              <FileText size={12} className="text-primary" /> resume_developer_draft.pdf
            </div>
            <div className="w-16" /> {/* Spacer */}
          </div>

          {/* Mockup Workspace */}
          <div className="grid grid-cols-1 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-border min-h-[420px]">
            {/* Resume Editor view */}
            <div className="col-span-3 p-8 space-y-6 relative overflow-hidden bg-slate-50/20">
              <div className="space-y-2">
                <div className="h-5 w-36 bg-foreground/10 rounded-full" />
                <div className="h-3.5 w-60 bg-muted-foreground/10 rounded-full" />
              </div>
              <hr className="border-border" />
              <div className="space-y-4 text-xs leading-relaxed text-muted-foreground">
                <div className="font-bold text-foreground">WORK EXPERIENCE</div>
                
                {/* Simulated highlight boxes */}
                <div className="space-y-3 p-4 bg-white border border-border rounded-2xl relative">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="font-bold text-foreground">Senior Backend Architect</span>
                  </div>
                  <p className="leading-normal">
                    <span className={`px-1 py-0.5 rounded transition-all duration-300 \${scanState === "done" ? "bg-red-100 text-red-700 font-semibold" : "bg-transparent"}`}>
                      worked on
                    </span> designing microservices to process user uploads and compute analysis parameters.
                    {scanState === "done" && (
                      <span className="block text-[10px] text-red-500 font-bold mt-1.5">🛑 WEAK VERB: Replace "worked on" with "Architected" or "Spearheaded"</span>
                    )}
                  </p>
                </div>

                <div className="space-y-3 p-4 bg-white border border-border rounded-2xl relative">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="font-bold text-foreground">Full Stack Developer</span>
                  </div>
                  <p className="leading-normal">
                    Designed and launched the client wallet payments platform, increasing conversion rates.
                    {scanState === "done" && (
                      <span className="block text-[10px] text-amber-600 font-bold mt-1.5">⚠️ NO METRICS: Quantify the outcomes (e.g., "boosted by 25%")</span>
                    )}
                  </p>
                </div>
              </div>

              {scanState === "scanning" && (
                <motion.div 
                  initial={{ top: 0 }}
                  animate={{ top: "100%" }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent shadow-[0_0_15px_rgba(0,0,0,0.1)]"
                />
              )}
            </div>

            {/* Scorer Panel view */}
            <div className="col-span-2 p-8 flex flex-col items-center justify-center space-y-6 text-center bg-white">
              {scanState === "idle" && (
                <div className="space-y-6">
                  <div className="w-28 h-28 bg-slate-50 border border-border border-dashed rounded-full flex items-center justify-center mx-auto text-muted-foreground animate-pulse">
                    <Cpu size={32} />
                  </div>
                  <div className="space-y-2">
                    <p className="font-bold text-foreground text-sm">Scanner Engine Ready</p>
                    <p className="text-xs text-muted-foreground max-w-xs">Run the mock algorithm parser to evaluate readability, key density, and formatting criteria.</p>
                  </div>
                  <button 
                    onClick={startSimulatedScan}
                    className="px-6 py-3 bg-black text-white text-xs font-bold rounded-xl shadow hover:opacity-90 active:scale-[0.98] transition-all"
                  >
                    Simulate Scan
                  </button>
                </div>
              )}

              {scanState === "scanning" && (
                <div className="space-y-4">
                  <div className="w-20 h-20 border-4 border-slate-200 border-t-primary rounded-full animate-spin mx-auto" />
                  <p className="font-bold text-xs text-muted-foreground tracking-widest uppercase animate-pulse">Parsing PDF Bytes...</p>
                </div>
              )}

              {scanState === "done" && (
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="space-y-6 w-full"
                >
                  <div className="relative w-32 h-32 flex items-center justify-center mx-auto">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" stroke="hsl(210 40% 96%)" strokeWidth="6" fill="transparent" />
                      <motion.circle 
                        cx="50" cy="50" r="40" stroke="black" strokeWidth="6" fill="transparent"
                        strokeDasharray={251.2}
                        strokeDashoffset={251.2 - (251.2 * simulatedScore) / 100}
                        transition={{ duration: 1 }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-extrabold text-foreground">{simulatedScore}</span>
                      <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">ATS Score</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3.5 border border-border rounded-2xl text-left bg-slate-50/50">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Grade</p>
                      <p className="text-lg font-bold text-emerald-600">Grade B+</p>
                    </div>
                    <div className="p-3.5 border border-border rounded-2xl text-left bg-slate-50/50">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">JD Match</p>
                      <p className="text-lg font-bold text-foreground">78.4%</p>
                    </div>
                  </div>

                  <hr className="border-border" />

                  <div className="text-left space-y-2.5 text-xs text-muted-foreground">
                    <p className="font-bold text-foreground text-[10px] uppercase tracking-wider">Missing Skills detected:</p>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="px-2.5 py-1 bg-yellow-50 text-amber-700 border border-yellow-100 rounded-lg font-semibold">Kubernetes</span>
                      <span className="px-2.5 py-1 bg-yellow-50 text-amber-700 border border-yellow-100 rounded-lg font-semibold">CI/CD Pipelines</span>
                      <span className="px-2.5 py-1 bg-yellow-50 text-amber-700 border border-yellow-100 rounded-lg font-semibold">React Native</span>
                    </div>
                  </div>

                  <button 
                    onClick={startSimulatedScan}
                    className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-foreground font-bold text-xs rounded-xl active:scale-[0.98] transition-all"
                  >
                    Scan Again
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section id="features" className="relative z-10 py-24 border-t border-border bg-slate-50/30">
        <div className="container max-w-5xl px-6 mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Engineered for Technical Portfolios</h2>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
              Everything you need to bypass applicant tracking gates, tailor metrics to job listings, and discover real-world developer roles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div 
                key={i} 
                className="bg-white border border-border p-8 rounded-[2rem] hover:border-black/30 hover:shadow-[0_4px_20px_rgba(0,0,0,0.01)] transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-border">
                      {f.icon}
                    </div>
                    <span className="text-[9px] bg-primary/5 text-primary-foreground font-bold px-2 py-0.5 rounded-full border border-primary/10">
                      {f.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{f.title}</h3>
                  <p className="text-muted-foreground text-xs leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview Section */}
      <section id="pricing" className="relative z-10 py-24 container max-w-5xl px-6 mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Subscription Tiers</h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Choose a wallet tier to purchase developer credits instantly. Integrated with Razorpay test checkout sandbox.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Free Card */}
          <div className="bg-white border border-border p-8 rounded-[2rem] flex flex-col justify-between hover:shadow-[0_4px_25px_rgba(0,0,0,0.015)] transition-all">
            <div className="space-y-4">
              <div className="inline-block px-2.5 py-1 bg-primary/10 text-primary text-[9px] font-bold rounded-full w-max">STARTER PLAN</div>
              <h3 className="text-lg font-bold text-foreground">Free Plan</h3>
              <p className="text-3xl font-extrabold text-foreground">₹0</p>
              <p className="text-muted-foreground text-xs leading-relaxed">Allocate 400 credits upon creation. Deducts 50 credits per detailed resume scanning execution.</p>
            </div>
            <Link href="/signup" className="mt-8 py-3 w-full bg-black hover:opacity-90 text-white text-center font-bold text-xs rounded-xl transition-all">
              Claim Free Allocation
            </Link>
          </div>

          {/* Standard Card */}
          <div className="bg-white border border-border p-8 rounded-[2rem] flex flex-col justify-between hover:shadow-[0_4px_25px_rgba(0,0,0,0.015)] transition-all">
            <div className="space-y-4">
              <div className="inline-block px-2.5 py-1 bg-primary/10 text-primary text-[9px] font-bold rounded-full w-max">FLEXIBLE</div>
              <h3 className="text-lg font-bold text-foreground">Standard Plan</h3>
              <p className="text-3xl font-extrabold text-foreground">₹500</p>
              <p className="text-muted-foreground text-xs leading-relaxed">Top up with 450 N Credits instantly to scan up to 9 complex resumes or job descriptions.</p>
            </div>
            <Link href="/signup" className="mt-8 py-3 w-full bg-black hover:opacity-90 text-white text-center font-bold text-xs rounded-xl transition-all">
              Get Started Now
            </Link>
          </div>

          {/* Pro Card */}
          <div className="bg-white border-2 border-black p-8 rounded-[2rem] flex flex-col justify-between shadow-lg relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-black text-white text-[8px] font-extrabold px-2 py-0.5 rounded-full">POPULAR</div>
            <div className="space-y-4">
              <div className="inline-block px-2.5 py-1 bg-primary/10 text-primary text-[9px] font-bold rounded-full w-max">POWER USER</div>
              <h3 className="text-lg font-bold text-foreground">Pro Plan</h3>
              <p className="text-3xl font-extrabold text-foreground">₹1000</p>
              <p className="text-muted-foreground text-xs leading-relaxed">Top up with 900 N Credits immediately. Full priority dashboard roadmap access.</p>
            </div>
            <Link href="/signup" className="mt-8 py-3 w-full bg-black hover:opacity-90 text-white text-center font-bold text-xs rounded-xl transition-all">
              Claim Premium Upgrade
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section id="faq" className="relative z-10 py-24 border-t border-border bg-slate-50/30">
        <div className="container max-w-4xl px-6 mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Frequently Asked Questions</h2>
            <p className="text-sm text-muted-foreground">Everything you need to know about the platform intelligence systems.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((f, i) => (
              <div key={i} className="bg-white border border-border rounded-2xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.005)]">
                <button 
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full p-6 text-left font-bold text-foreground text-sm sm:text-base flex items-center justify-between focus:outline-none"
                >
                  <span className="flex items-center gap-2.5">
                    <HelpCircle size={18} className="text-muted-foreground" /> {f.q}
                  </span>
                  <ChevronDown 
                    size={16} 
                    className={`text-muted-foreground transition-transform duration-300 \${activeFaq === i ? "rotate-180" : ""}`} 
                  />
                </button>
                
                <AnimatePresence initial={false}>
                  {activeFaq === i && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-6 pb-6 pt-0 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-slate-50 bg-slate-50/10">
                        {f.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call To Action Section */}
      <section className="relative z-10 py-28 container max-w-4xl px-6 mx-auto text-center">
        <div className="p-8 sm:p-14 bg-white border border-border rounded-[3rem] shadow-[0_10px_40px_rgba(0,0,0,0.015)] relative overflow-hidden space-y-8">
          <div className="absolute top-0 left-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />
          
          <div className="space-y-4 max-w-xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">Ready to beat the parser?</h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Create an account now to claim your initial allocation of 400 credits. Scan your draft resume, optimize experience points, and track your funnel progress.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-sm mx-auto">
            <Link href="/signup" className="px-6 py-3.5 bg-black hover:opacity-90 text-white rounded-xl text-xs font-bold active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 shadow">
              Register Account <ArrowRight size={14} />
            </Link>
            <Link href="/login" className="px-6 py-3.5 bg-white border border-border hover:bg-slate-50 text-foreground rounded-xl text-xs font-bold transition-all shadow-[0_2px_10px_rgba(0,0,0,0.01)] flex items-center justify-center">
              Login to Workspace
            </Link>
          </div>
        </div>
      </section>

      {/* Clean Footer */}
      <footer className="relative z-10 py-12 border-t border-border container max-w-5xl px-6 mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2 font-bold text-foreground">
          <img src="/logo.png" alt="Talent Scope Logo" className="w-5 h-5 rounded-md object-contain border border-border" />
          <span>TalentScope AI</span>
        </div>
        <div className="flex gap-6">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
          <Link href="/privacy" className="hover:text-foreground transition-colors opacity-60">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-foreground transition-colors opacity-60">Terms</Link>
        </div>
        <div>© 2026 TalentScope AI Platform. Built with Google DeepMind & Antigravity.</div>
      </footer>
    </div>
  );
}
