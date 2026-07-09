"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight, AlertCircle, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function SignupContent() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const errParam = searchParams.get("error");
    if (errParam) {
      setError(errParam);
    }
    
    // We also handle Google Auth redirect here just in case they landed on /signup?googleAuth=true
    const isGoogleAuth = searchParams.get("googleAuth");
    if (isGoogleAuth === "true") {
      const u = searchParams.get("username");
      const e = searchParams.get("email");
      if (u) {
        localStorage.setItem("auth_username", u);
        localStorage.setItem("user_name", u);
        localStorage.setItem("user_email", e || u);
        localStorage.setItem("user_credits", "400");
        localStorage.setItem("active_plan", "free");
        window.dispatchEvent(new Event("credits_updated"));
        router.push("/dashboard");
      }
    }
  }, [searchParams, router]);

  const handleSignup = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const baseUrl = "";
      const res = await fetch(`${baseUrl}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim(),
          password: password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || "Username or email already exists.");
        return;
      }

      // Save to local storage for dummy auth with cleaned values
      localStorage.setItem("auth_username", username.trim());
      localStorage.setItem("auth_password", password);
      localStorage.setItem("auth_email", email.trim());
      localStorage.setItem("user_name", username.trim());
      localStorage.setItem("user_email", email.trim());
      localStorage.setItem("active_plan", "free");
      localStorage.setItem("user_credits", "400");
      
      // Sync layout component
      window.dispatchEvent(new Event("credits_updated"));

      router.push("/dashboard");
    } catch (err: any) {
      setError(`Cannot reach backend server. Error details: ${err.message || String(err)}`);
    }
  };

  const handleGoogleSignup = () => {
    const baseUrl = process.env.NODE_ENV === "development" ? "http://localhost:8000" : "";
    window.location.href = `${baseUrl}/api/auth/google/login`;
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md space-y-8 relative z-10">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center mx-auto shadow-md"><Sparkles className="text-primary-foreground" /></div>
          <h1 className="text-4xl font-bold text-foreground">Create Account</h1>
        </div>
        <div className="glass-card p-8 rounded-[2.5rem] space-y-5 bg-white border border-border shadow-sm">
          
          <button 
            onClick={handleGoogleSignup} 
            className="w-full py-3 bg-white border border-border text-foreground rounded-2xl font-bold text-sm flex items-center justify-center gap-3 shadow-sm hover:bg-muted/50 transition-all"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              <path d="M1 1h22v22H1z" fill="none" />
            </svg>
            Sign up with Google
          </button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
              <span className="bg-white px-2 text-muted-foreground">Or continue with email</span>
            </div>
          </div>

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
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="john@example.com" 
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

          <button onClick={handleSignup} className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:opacity-90 transition-all">
            Create Account <ArrowRight size={16} />
          </button>
        </div>
        <p className="text-center text-sm text-muted-foreground">Already have an account? <Link href="/login" className="text-primary font-bold hover:underline">Log In</Link></p>
      </motion.div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>}>
      <SignupContent />
    </Suspense>
  );
}
