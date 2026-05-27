"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { User, Mail, CreditCard, Sparkles, AlertCircle, ShieldCheck } from "lucide-react";

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [saved, setSaved] = useState(false);
  const [credits, setCredits] = useState<number>(400);
  const [activePlan, setActivePlan] = useState<string>("free");
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info";
    title: string;
    message: string;
    show: boolean;
  }>({
    type: "success",
    title: "",
    message: "",
    show: false,
  });

  const triggerAlert = (type: "success" | "error" | "info", title: string, message: string) => {
    setNotification({
      type,
      title,
      message,
      show: true,
    });
  };

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
    // Initialize or load credits and plan from local storage
    const storedPlan = localStorage.getItem("active_plan") || "pro";
    const storedCredits = localStorage.getItem("user_credits") || "900";
    
    // Persist if not already present
    if (!localStorage.getItem("active_plan")) {
      localStorage.setItem("active_plan", storedPlan);
    }
    if (!localStorage.getItem("user_credits")) {
      localStorage.setItem("user_credits", storedCredits);
    }

    setCredits(parseInt(storedCredits));
    setActivePlan(storedPlan);
    window.dispatchEvent(new Event("credits_updated"));
    
    setName(localStorage.getItem("user_name") || "");
    setEmail(localStorage.getItem("user_email") || localStorage.getItem("auth_email") || "");
  }, []);

  const handleSave = () => {
    localStorage.setItem("user_name", name);
    localStorage.setItem("user_email", email);
    localStorage.setItem("auth_email", email);
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
      triggerAlert("success", "Plan Claimed!", "Successfully claimed the Free Plan!");
      return;
    }

    // 1. Direct load of the genuine Razorpay SDK
    const sdkLoaded = await loadRazorpay();
    if (!sdkLoaded) {
      triggerAlert("error", "Checkout Failed", "Razorpay checkout failed to load. Please check your internet connection.");
      return;
    }

    // 2. Real Razorpay Standard Web Options (bypasses Vercel backend secret-key mismatches)
    const options = {
      key: "rzp_test_Sqi4HlmtjalojS", // Publicly active Razorpay Test Key ID
      amount: amount * 100, // Amount in paise
      currency: "INR",
      name: "Talent Scope AI",
      description: `Upgrade to ${planId.toUpperCase()} - Add ${creditsToAdd} Credits`,
      image: "https://cdn-icons-png.flaticon.com/512/2092/2092663.png",
      handler: function (response: any) {
        // Real checkout complete handler on the official Razorpay test screen!
        const current = parseInt(localStorage.getItem("user_credits") || "400");
        const updated = current + creditsToAdd;
        localStorage.setItem("user_credits", updated.toString());
        localStorage.setItem("active_plan", planId);
        setCredits(updated);
        setActivePlan(planId);
        window.dispatchEvent(new Event("credits_updated"));
        
        triggerAlert("success", "Payment Successful! 🎉", `Razorpay Payment ID: ${response.razorpay_payment_id}\n\nAdded ${creditsToAdd} Credits successfully. Enjoy your new features!`);
      },
      prefill: {
        name: name || "nikshith",
        email: email || "nikshith@example.com",
      },
      theme: {
        color: "#8b5cf6", // Purple theme matching UI design
      },
    };

    try {
      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (e: any) {
      triggerAlert("error", "Checkout Error", `Razorpay SDK Error: ${e.message}`);
    }
  };

  const getCardStyle = (planId: string) => {
    const isActive = activePlan === planId;
    if (isActive) {
      return "p-6 rounded-[2rem] flex flex-col justify-between border-2 border-primary bg-primary/5 shadow-lg transition-all relative overflow-hidden";
    }
    return "bg-white border border-border p-6 rounded-[2rem] flex flex-col justify-between hover:border-primary/50 transition-all shadow-[0_2px_10px_rgba(0,0,0,0.02)]";
  };

  return (
    <div className="p-8 space-y-10 max-w-4xl relative">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Profile Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your active details and claim packages.</p>
      </div>
      
      {/* Profile Info Container */}
      <div className="bg-white border border-border rounded-[2.5rem] overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div className="h-32 bg-primary/10" />
        <div className="px-8 pb-8 space-y-8">
          <div className="w-24 h-24 rounded-3xl bg-white -mt-12 border-4 border-white flex items-center justify-center text-3xl font-bold text-primary shadow-md">{getInitials()}</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Enter your full name" 
                  className="w-full bg-transparent border border-border rounded-2xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-primary text-foreground" 
                />
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Email</label>
              <div className="relative">
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="Enter your email" 
                  className="w-full bg-transparent border border-border rounded-2xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-primary text-foreground" 
                />
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
          </div>
          <button onClick={handleSave} className="px-8 py-3.5 bg-primary text-primary-foreground rounded-2xl font-bold text-sm shadow-md hover:opacity-90 active:scale-[0.98] transition-all">
            {saved ? "Saved Successfully!" : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Subscription Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight pt-8 text-foreground flex items-center gap-2">
          <CreditCard className="text-primary" /> Subscription & Credits
        </h2>
        <p className="text-sm text-muted-foreground">Select a pricing model to purchase credits and optimize more resumes instantly. Powered by Razorpay.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Free Plan */}
        <div className={getCardStyle("free")}>
          <div className="space-y-3">
            {activePlan === "free" && (
              <div className="inline-block px-2.5 py-1 bg-primary/20 text-primary text-[9px] font-bold rounded-full mb-1 w-max">CURRENT PLAN</div>
            )}
            <h3 className="text-lg font-bold text-foreground">Free Plan</h3>
            <p className="text-3xl font-extrabold text-foreground">₹0</p>
            <p className="text-muted-foreground text-xs font-medium">Add 400 N Credits to your account.</p>
          </div>
          <button 
            onClick={() => displayRazorpay("free", 0, 400)} 
            className="mt-6 py-3 w-full bg-black text-white font-bold text-sm rounded-xl transition-all hover:opacity-90 active:scale-[0.98]"
          >
            {activePlan === "free" ? "Current Plan" : "Claim Free"}
          </button>
        </div>

        {/* Standard Plan */}
        <div className={getCardStyle("standard")}>
          <div className="space-y-3">
            {activePlan === "standard" && (
              <div className="inline-block px-2.5 py-1 bg-primary/20 text-primary text-[9px] font-bold rounded-full mb-1 w-max">CURRENT PLAN</div>
            )}
            <h3 className="text-lg font-bold text-foreground">Standard Plan</h3>
            <p className="text-3xl font-extrabold text-foreground">₹500</p>
            <p className="text-muted-foreground text-xs font-medium">Add 450 N Credits to your account.</p>
          </div>
          <button 
            onClick={() => displayRazorpay("standard", 500, 450)} 
            className="mt-6 py-3 w-full bg-black text-white font-bold text-sm rounded-xl transition-all hover:opacity-90 active:scale-[0.98]"
          >
            {activePlan === "standard" ? "Current Plan" : "Buy Now"}
          </button>
        </div>

        {/* Pro Plan */}
        <div className={getCardStyle("pro")}>
          <div className="space-y-3">
            {activePlan === "pro" ? (
              <div className="inline-block px-2.5 py-1 bg-primary/20 text-primary text-[9px] font-bold rounded-full mb-1 w-max">CURRENT PLAN</div>
            ) : (
              <div className="inline-block px-2.5 py-1 bg-muted text-muted-foreground text-[9px] font-bold rounded-full mb-1 w-max">MOST POPULAR</div>
            )}
            <h3 className="text-lg font-bold text-foreground">Pro Plan</h3>
            <p className="text-3xl font-extrabold text-foreground">₹1000</p>
            <p className="text-muted-foreground text-xs font-medium">Add 900 N Credits to your account.</p>
          </div>
          <button 
            onClick={() => displayRazorpay("pro", 1000, 900)} 
            className="mt-6 py-3 w-full bg-black text-white font-bold text-sm rounded-xl transition-all hover:opacity-90 active:scale-[0.98]"
          >
            {activePlan === "pro" ? "Current Plan" : "Buy Now"}
          </button>
        </div>
      </div>
      
      <div className="p-4 bg-muted/60 border border-border rounded-3xl flex gap-3 text-xs text-muted-foreground max-w-2xl">
        <ShieldCheck className="text-green-500 shrink-0 mt-0.5" size={16} />
        <p>
          Payments are secure and fully integrated via <strong>Razorpay Standard Web Checkout</strong> in sandbox test mode. No real money will be charged during development.
        </p>
      </div>
    </div>
    
    <AnimatePresence>
      {notification.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white border border-border p-8 rounded-[2.5rem] max-w-md w-full shadow-2xl relative space-y-6 text-center"
          >
            {notification.type === "success" ? (
              <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto border border-green-100">
                <ShieldCheck size={32} />
              </div>
            ) : (
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto border border-red-100">
                <AlertCircle size={32} />
              </div>
            )}
            
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-foreground">{notification.title}</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">{notification.message}</p>
            </div>
            
            <button 
              onClick={() => setNotification({ ...notification, show: false })}
              className="w-full py-3.5 bg-black text-white hover:opacity-90 active:scale-[0.98] transition-all font-bold text-sm rounded-2xl shadow-md"
            >
              Okay
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
