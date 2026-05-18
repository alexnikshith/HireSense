"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [saved, setSaved] = useState(false);
  const [credits, setCredits] = useState<number>(400);
  const [activePlan, setActivePlan] = useState<string>("free");

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    setName(localStorage.getItem("user_name") || "");
    setEmail(localStorage.getItem("user_email") || "");
    setActivePlan(localStorage.getItem("active_plan") || "free");
    
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

  const displayRazorpay = async (planId: string, amount: number, creditsToAdd: number) => {
    if (planId === "free") {
      const current = parseInt(localStorage.getItem("user_credits") || "400");
      const updated = current + creditsToAdd;
      localStorage.setItem("user_credits", updated.toString());
      localStorage.setItem("active_plan", planId);
      setCredits(updated);
      setActivePlan(planId);
      window.dispatchEvent(new Event("credits_updated"));
      alert("Successfully claimed Free Plan!");
      return;
    }

    const res = await loadRazorpay();
    if (!res) {
      alert("Razorpay SDK failed to load. Please check your internet connection.");
      return;
    }

    // Fetch order ID from backend
    const baseUrl = process.env.NODE_ENV === "development" ? "http://127.0.0.1:8000" : "";
    let orderId = "";
    try {
      const orderRes = await fetch(`${baseUrl}/api/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amount })
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.detail || "Failed to create order");
      orderId = orderData.order_id;
    } catch (e: any) {
      alert(`Backend Error: ${e.message}`);
      return;
    }

    const options = {
      key: "rzp_test_Sqi4HlmtjalojS", // User's Razorpay Test Key
      amount: amount * 100, // Amount in paise
      currency: "INR",
      name: "HireSense",
      description: `${creditsToAdd} N Credits`,
      order_id: orderId,
      handler: function (response: any) {
        // Payment successful (Frontend simulation of backend verification)
        const current = parseInt(localStorage.getItem("user_credits") || "400");
        const updated = current + creditsToAdd;
        localStorage.setItem("user_credits", updated.toString());
        localStorage.setItem("active_plan", planId);
        setCredits(updated);
        setActivePlan(planId);
        window.dispatchEvent(new Event("credits_updated"));
        
        alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}\n\nAdded ${creditsToAdd} credits to your account.`);
      },
      prefill: {
        name: name,
        email: email,
      },
      theme: {
        color: "#8b5cf6", // Matches your primary color
      },
    };

    const paymentObject = new (window as any).Razorpay(options);
    paymentObject.open();
  };
  return (
    <div className="p-8 space-y-10 max-w-4xl">
      <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
      
      <div className="glass-card rounded-[2.5rem] overflow-hidden">
        <div className="h-32 bg-primary/10" />
        <div className="px-8 pb-8 space-y-8">
          <div className="w-24 h-24 rounded-3xl bg-white -mt-12 border-4 border-white flex items-center justify-center text-3xl font-bold text-primary shadow-md">{getInitials()}</div>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your full name" className="w-full bg-transparent border border-border rounded-2xl py-3 px-4 text-sm focus:outline-none focus:border-primary" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className="w-full bg-transparent border border-border rounded-2xl py-3 px-4 text-sm focus:outline-none focus:border-primary" />
            </div>
          </div>
          <button onClick={handleSave} className="px-8 py-3 bg-primary text-primary-foreground rounded-2xl font-bold text-sm shadow-md hover:opacity-90 transition-all">
            {saved ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Subscription Section */}
      <h2 className="text-2xl font-bold tracking-tight pt-8">Subscription & Credits</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Free Plan */}
        <div className="glass-card p-6 rounded-[2rem] flex flex-col justify-between hover:border-primary/50 transition-all">
          <div className="space-y-3">
            <h3 className="text-lg font-bold">Free Plan</h3>
            <p className="text-3xl font-bold">₹0</p>
            <p className="text-muted-foreground text-xs">Add 400 N Credits to your account.</p>
          </div>
          <button disabled={activePlan === "free"} onClick={() => displayRazorpay("free", 0, 400)} className={`mt-6 py-2.5 rounded-xl font-bold text-sm transition-all border ${activePlan === "free" ? "bg-muted text-muted-foreground cursor-not-allowed border-transparent" : "border-border text-foreground hover:bg-muted"}`}>
            {activePlan === "free" ? "Current Plan" : "Claim Free"}
          </button>
        </div>

        {/* Plan 1 */}
        <div className="glass-card p-6 rounded-[2rem] flex flex-col justify-between hover:border-primary/50 transition-all">
          <div className="space-y-3">
            <h3 className="text-lg font-bold">Standard Plan</h3>
            <p className="text-3xl font-bold">₹500</p>
            <p className="text-muted-foreground text-xs">Add 450 N Credits to your account.</p>
          </div>
          <button disabled={activePlan === "standard"} onClick={() => displayRazorpay("standard", 500, 450)} className={`mt-6 py-2.5 rounded-xl font-bold text-sm transition-all border ${activePlan === "standard" ? "bg-muted text-muted-foreground cursor-not-allowed border-transparent" : "border-border text-foreground hover:bg-muted"}`}>
            {activePlan === "standard" ? "Current Plan" : "Buy Now"}
          </button>
        </div>

        {/* Plan 2 */}
        <div className="glass-card p-6 rounded-[2rem] flex flex-col justify-between border-2 border-primary bg-primary/5 shadow-lg transition-all relative overflow-hidden">
          <div className="space-y-3">
            <div className="inline-block px-2 py-0.5 bg-primary/20 text-primary text-[9px] font-bold rounded-full mb-1">MOST POPULAR</div>
            <h3 className="text-lg font-bold">Pro Plan</h3>
            <p className="text-3xl font-bold">₹1000</p>
            <p className="text-muted-foreground text-xs">Add 900 N Credits to your account.</p>
          </div>
          <button disabled={activePlan === "pro"} onClick={() => displayRazorpay("pro", 1000, 900)} className={`mt-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activePlan === "pro" ? "bg-muted text-muted-foreground cursor-not-allowed" : "bg-primary text-primary-foreground shadow-md hover:opacity-90"}`}>
            {activePlan === "pro" ? "Current Plan" : "Buy Now"}
          </button>
        </div>
      </div>
    </div>
  );
}
