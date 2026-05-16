"use client";

import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Search, 
  Edit3, 
  Briefcase, 
  Files, 
  User, 
  BarChart, 
  Sparkles,
  Settings,
  LogOut
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Search, label: "Job Hunt", href: "/dashboard/job-hunt" },
  { icon: Edit3, label: "Alter Resume", href: "/dashboard/alter-resume" },
  { icon: Briefcase, label: "Your Applications", href: "/dashboard/applications" },
  { icon: Files, label: "Resume Container", href: "/dashboard/resumes" },
  { icon: BarChart, label: "Analytics", href: "/dashboard/analytics" },
  { icon: User, label: "Profile", href: "/dashboard/profile" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex">
      {/* Sidebar */}
      <aside className="w-72 border-r border-white/5 p-8 flex flex-col space-y-10 hidden lg:flex fixed h-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.3)]">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tighter">HireSense</span>
        </div>

        <nav className="flex-1 space-y-2">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group ${
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon size={20} className={isActive ? "text-primary" : "text-muted-foreground group-hover:text-white transition-colors"} />
                <span className="font-semibold text-sm">{item.label}</span>
                {isActive && (
                  <motion.div 
                    layoutId="sidebar-active"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-4 pt-6 border-t border-white/5">
          <div className="glass-card p-5 rounded-3xl space-y-3 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-full blur-2xl -mr-10 -mt-10" />
            <p className="text-[10px] font-bold text-primary uppercase tracking-widest">N Score</p>
            <div className="flex items-end gap-1">
              <span className="text-3xl font-bold italic">740</span>
              <span className="text-[10px] text-muted-foreground mb-1.5">/ 900</span>
            </div>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Your initial hiring potential based on your signup profile.
            </p>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-primary w-[74%] shadow-[0_0_10px_#8b5cf6]" />
            </div>
          </div>

          <button className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-all">
            <LogOut size={20} />
            <span className="font-semibold text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-72 min-h-screen">
        {children}
      </main>
    </div>
  );
}
