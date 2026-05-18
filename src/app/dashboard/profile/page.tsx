"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [saved, setSaved] = useState(false);
  const [showPayment, setShowPayment] = useState<string | null>(null);
  const [credits, setCredits] = useState<number>(400);

  useEffect(() => {
    setName(localStorage.getItem("user_name") || "");
    setEmail(localStorage.getItem("user_email") || "");
    
    const storedCredits = localStorage.getItem("user_credits");
    if (storedCredits) {
      setCredits(parseInt(storedCredits));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("user_name", name);
    localStorage.setItem("user_email", email);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const getInitials = () => {
    if (!name) return "US";
    return name.substring(0, 2).toUpperCase();
  };

  const handleBuyCredits = (plan: string) => {
    setShowPayment(plan);
  };

  const handleSimulatePayment = (amountToAdd: number) => {
    const current = parseInt(localStorage.getItem("user_credits") || "400");
    const updated = current + amountToAdd;
    localStorage.setItem("user_credits", updated.toString());
    setCredits(updated);
    window.dispatchEvent(new Event("credits_updated"));
    setShowPayment(null);
    alert(`Successfully added ${amountToAdd} credits!`);
  };
  return (
    <div className="p-8 space-y-10 max-w-4xl">
      <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
      
      <div className="glass-card rounded-[2.5rem] border-white/5 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary/20 to-blue-500/20" />
        <div className="px-8 pb-8 space-y-8">
          <div className="w-24 h-24 rounded-3xl bg-[#0A0A0A] -mt-12 border-4 border-[#0A0A0A] flex items-center justify-center text-3xl font-bold text-primary shadow-2xl">{getInitials()}</div>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your full name" className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-sm" />
            </div>
          </div>
          <button onClick={handleSave} className="px-8 py-3 bg-primary text-white rounded-2xl font-bold text-sm shadow-[0_0_20px_rgba(139,92,246,0.3)]">
            {saved ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Subscription Section */}
      <h2 className="text-2xl font-bold tracking-tight pt-8">Subscription & Credits</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Free Plan */}
        <div className="glass-card p-6 rounded-[2rem] flex flex-col justify-between border border-white/5 hover:border-primary/50 transition-all">
          <div className="space-y-3">
            <h3 className="text-lg font-bold">Free Plan</h3>
            <p className="text-3xl font-bold">₹0</p>
            <p className="text-muted-foreground text-xs">Add 400 N Credits to your account.</p>
          </div>
          <button onClick={() => handleSimulatePayment(400)} className="mt-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-sm transition-all">
            Claim Free
          </button>
        </div>

        {/* Plan 1 */}
        <div className="glass-card p-6 rounded-[2rem] flex flex-col justify-between border border-white/5 hover:border-primary/50 transition-all">
          <div className="space-y-3">
            <h3 className="text-lg font-bold">Standard Plan</h3>
            <p className="text-3xl font-bold">₹500</p>
            <p className="text-muted-foreground text-xs">Add 450 N Credits to your account.</p>
          </div>
          <button onClick={() => handleBuyCredits("standard")} className="mt-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-sm transition-all">
            Buy Now
          </button>
        </div>

        {/* Plan 2 */}
        <div className="glass-card p-6 rounded-[2rem] flex flex-col justify-between border border-primary/50 bg-primary/5 shadow-[0_0_30px_rgba(139,92,246,0.1)] transition-all relative overflow-hidden">
          <div className="space-y-3">
            <div className="inline-block px-2 py-0.5 bg-primary/20 text-primary text-[9px] font-bold rounded-full mb-1">MOST POPULAR</div>
            <h3 className="text-lg font-bold">Pro Plan</h3>
            <p className="text-3xl font-bold">₹1000</p>
            <p className="text-muted-foreground text-xs">Add 900 N Credits to your account.</p>
          </div>
          <button onClick={() => handleBuyCredits("pro")} className="mt-6 py-2.5 bg-primary text-white rounded-xl font-bold text-sm shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all">
            Buy Now
          </button>
        </div>
      </div>

      {/* Payment Modal/Section */}
      {showPayment && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8 rounded-[2.5rem] border border-primary/50 mt-8 space-y-6">
          <h3 className="text-2xl font-bold text-primary">Complete Your Payment</h3>
          <p className="text-muted-foreground">
            You are purchasing the <strong className="text-white">{showPayment === "standard" ? "Standard Plan (450 Credits)" : "Pro Plan (900 Credits)"}</strong>.
          </p>
          <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-2">Pay via UPI</p>
            <p className="text-2xl font-mono tracking-wider">7569778915@axl</p>
            <p className="text-xs text-muted-foreground mt-4">Please complete the payment using any UPI app (GPay, PhonePe, Paytm). After successful payment, your credits will be updated shortly.</p>
          </div>
          <div className="flex gap-4 pt-4">
            <button onClick={() => setShowPayment(null)} className="flex-1 py-3 bg-white/10 text-white rounded-2xl font-bold text-sm hover:bg-white/20 transition-all">
              Cancel
            </button>
            <button 
              onClick={() => handleSimulatePayment(showPayment === "standard" ? 450 : 900)} 
              className="flex-1 py-3 bg-green-500 text-white rounded-2xl font-bold text-sm shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:bg-green-400 transition-all"
            >
              I Have Paid
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
