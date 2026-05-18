"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }

    const savedUser = localStorage.getItem("auth_username");
    const savedPass = localStorage.getItem("auth_password");

    if (!savedUser) {
      setError("User does not exist. Please sign up first.");
      return;
    }

    if (username === savedUser && password === savedPass) {
      // Login successful
      localStorage.setItem("user_name", username);
      router.push("/dashboard");
    } else {
      setError("Incorrect username or password.");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md space-y-8 relative z-10">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center mx-auto shadow-md"><Sparkles className="text-primary-foreground" /></div>
          <h1 className="text-4xl font-bold">Welcome Back</h1>
        </div>
        <div className="glass-card p-8 rounded-[2.5rem] space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Username</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="johndoe" 
                className="w-full bg-transparent border border-border rounded-2xl py-3 px-4 text-sm text-foreground focus:outline-none focus:border-primary transition-all" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full bg-transparent border border-border rounded-2xl py-3 px-4 text-sm text-foreground focus:outline-none focus:border-primary transition-all" 
              />
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
