"use client";

import { motion } from "framer-motion";
import { 
  LayoutDashboard, Search, FileEdit, Briefcase, 
  Files, BarChart2, User, LogOut, Sparkles, TrendingUp
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Search, label: "Job Hunt", href: "/dashboard/job-hunt" },
  { icon: FileEdit, label: "Alter Resume", href: "/dashboard/alter-resume" },
  { icon: Briefcase, label: "Applications", href: "/dashboard/applications" },
  { icon: Files, label: "Resumes", href: "/dashboard/resumes" },
  { icon: BarChart2, label: "Analytics", href: "/dashboard/analytics" },
  { icon: User, label: "Profile", href: "/dashboard/profile" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-[#0A0A0A] text-white">
      {/* Sidebar */}
      <aside className="w-72 border-r border-white/5 p-6 flex flex-col gap-8 sticky top-0 h-screen overflow-y-auto">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.3)]">
            <Sparkles className="text-white" size={20} />
          </div>
          <span className="text-2xl font-bold tracking-tighter">HireSense</span>
        </div>

        <nav className="flex-1 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  isActive 
                  ? "bg-primary text-white shadow-[0_0_20px_rgba(139,92,246,0.2)]" 
                  : "text-muted-foreground hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon size={20} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* N Score Widget */}
        <div className="glass-card p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">N Score</span>
            <TrendingUp size={14} className="text-primary" />
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold">742<span className="text-xs text-muted-foreground ml-1">/ 900</span></div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-primary w-[82%] shadow-[0_0_10px_#8b5cf6]" />
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground italic">Top 5% of candidates this week</p>
        </div>

        <button className="flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-500/5 transition-all">
          <LogOut size={20} />
          Logout
        </button>
      </aside>

      <main className="flex-1 overflow-x-hidden relative">
         <div className="absolute top-0 right-0 w-[50%] h-[30%] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
         {children}
      </main>
    </div>
  );
}
