"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight, AlertCircle, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      setError("Please enter both username/email and password.");
      return;
    }

    try {
      const res = await fetch(`/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username_or_email: username,
          password: password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || "Incorrect username/email or password.");
        return;
      }

      // Login successful
      localStorage.setItem("auth_username", data.username);
      localStorage.setItem("auth_email", data.email);
      localStorage.setItem("auth_password", password);
      localStorage.setItem("user_name", data.username);
      localStorage.setItem("user_email", data.email);
      localStorage.setItem("user_credits", data.credits.toString());
      localStorage.setItem("active_plan", data.active_plan);
      
      // Sync layout component
      window.dispatchEvent(new Event("credits_updated"));
      
      router.push("/dashboard");
    } catch (err: any) {
      setError("Cannot reach backend server. Please make sure the backend is running!");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md space-y-8 relative z-10">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center mx-auto shadow-md"><Sparkles className="text-primary-foreground" /></div>
          <h1 className="text-4xl font-bold text-foreground">Welcome Back</h1>
        </div>
        <div className="glass-card p-8 rounded-[2.5rem] space-y-6 bg-white border border-border shadow-sm">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Username or Email</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username or email" 
                className="w-full bg-transparent border border-border rounded-2xl py-3 px-4 text-sm text-foreground focus:outline-none focus:border-primary transition-all" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full bg-transparent border border-border rounded-2xl py-3 pl-4 pr-12 text-sm text-foreground focus:outline-none focus:border-primary transition-all" 
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>
          
          {error && (
            <div className="p-3 bg-red-50 text-red-500 rounded-xl text-xs flex items-center gap-2 border border-red-100">
              <AlertCircle size={14} /> {error}
            </div>
          )}

          <button onClick={handleLogin} className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:opacity-90 transition-all">
            Log In <ArrowRight size={16} />
          </button>
        </div>
        <p className="text-center text-sm text-muted-foreground">Don't have an account? <Link href="/signup" className="text-primary font-bold hover:underline">Sign Up</Link></p>
      </motion.div>
    </div>
  );
}
