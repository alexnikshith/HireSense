"use client";

import { motion } from "framer-motion";
import { 
  LayoutDashboard, Search, FileEdit, Briefcase, 
  Files, BarChart2, User, LogOut, Sparkles, TrendingUp
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

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
  const router = useRouter();
  const [credits, setCredits] = useState<number>(400);

  useEffect(() => {
    // Check authentication
    const userName = localStorage.getItem("user_name");
    if (!userName) {
      router.push("/login");
      return;
    }

    const stored = localStorage.getItem("user_credits");
    if (!stored) {
      localStorage.setItem("user_credits", "400");
      setCredits(400);
    } else {
      setCredits(parseInt(stored));
    }

    const handleStorageChange = () => {
      const updated = localStorage.getItem("user_credits");
      if (updated) setCredits(parseInt(updated));
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("credits_updated", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("credits_updated", handleStorageChange);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
      {/* Top Header - Maroon Theme */}
      <header className="bg-primary text-primary-foreground py-3 px-6 flex justify-between items-center shadow-md z-10 relative">
        <button 
          onClick={() => {
            window.location.reload();
          }}
          className="flex items-center gap-3 hover:opacity-90 active:scale-[0.98] transition-all focus:outline-none"
        >
          <img src="/logo.png" alt="HireSense Logo" className="w-8 h-8 rounded-lg object-contain border border-white/10" />
          <span className="text-xl font-bold tracking-wide">HireSense</span>
        </button>

        <div className="flex items-center gap-4">
          {/* N Credits Widget */}
          <div className="bg-white/10 px-4 py-1.5 rounded text-sm font-semibold flex items-center gap-2 border border-white/20">
            <TrendingUp size={16} />
            {credits} Credits
          </div>
          
          <button 
            onClick={() => {
              localStorage.removeItem("user_name");
              localStorage.removeItem("user_email");
              router.push("/login");
            }}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-1.5 rounded text-sm font-medium transition-all"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-[1400px] mx-auto p-6 flex flex-col">
        
        {/* Tab Navigation */}
        <div className="flex items-center gap-8 border-b border-border mb-6 overflow-x-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 py-3 text-sm font-medium transition-all border-b-2 whitespace-nowrap -mb-[1px] ${
                  isActive 
                  ? "border-primary text-primary" 
                  : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <item.icon size={16} className={isActive ? "text-primary" : "text-muted-foreground"} />
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Page Content wrapped in a white card container similar to screenshots */}
        <div className="flex-1 bg-white p-8 rounded-lg shadow-[0_2px_10px_rgba(0,0,0,0.05)] border border-border overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
