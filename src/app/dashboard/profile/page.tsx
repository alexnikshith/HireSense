"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  User, Mail, ShieldCheck, CreditCard, Sparkles, 
  X, CheckCircle2, AlertCircle, HelpCircle, Loader2 
} from "lucide-react";

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [saved, setSaved] = useState(false);
  const [credits, setCredits] = useState<number>(400);
  const [activePlan, setActivePlan] = useState<string>("free");

  // Custom modal state
  const [showSandboxModal, setShowSandboxModal] = useState(false);
  const [sandboxDetails, setSandboxDetails] = useState<{ planId: string, amount: number, credits: number } | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStep, setSimulationStep] = useState<"confirm" | "success">("confirm");

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

    // 1. Fetch order ID from backend first to check if keys are configured
    const baseUrl = process.env.NODE_ENV === "development" ? "http://127.0.0.1:8000" : "";
    let orderId = "";
    let isMock = false;
    
    try {
      const orderRes = await fetch(`${baseUrl}/api/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amount })
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.detail || "Failed to create order");
      orderId = orderData.order_id;
      isMock = !!orderData.is_mock;
    } catch (e: any) {
      alert(`Backend Error: ${e.message}`);
      return;
    }

    // 2. Open our premium custom sandbox modal if backend is in sandbox mode
    if (isMock) {
      setSandboxDetails({ planId, amount, credits: creditsToAdd });
      setSimulationStep("confirm");
      setShowSandboxModal(true);
      return;
    }

    // 3. Fall back to real Razorpay checkout if live keys are configured
    const sdkLoaded = await loadRazorpay();
    if (!sdkLoaded) {
      alert("Razorpay SDK failed to load. Please check your internet connection.");
      return;
    }

    const options = {
      key: "rzp_test_Sqi4HlmtjalojS", 
      amount: amount * 100, 
      currency: "INR",
      name: "HireSense",
      description: `${creditsToAdd} N Credits`,
      order_id: orderId,
      handler: function (response: any) {
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
        color: "#8b5cf6",
      },
    };

    const paymentObject = new (window as any).Razorpay(options);
    paymentObject.open();
  };

  const handleSimulatePayment = () => {
    if (!sandboxDetails) return;
    setIsSimulating(true);
    
    // Simulate API verification timing for ultra realism!
    setTimeout(() => {
      const current = parseInt(localStorage.getItem("user_credits") || "400");
      const updated = current + sandboxDetails.credits;
      localStorage.setItem("user_credits", updated.toString());
      localStorage.setItem("active_plan", sandboxDetails.planId);
      setCredits(updated);
      setActivePlan(sandboxDetails.planId);
      window.dispatchEvent(new Event("credits_updated"));
      
      setIsSimulating(false);
      setSimulationStep("success");
    }, 1500);
  };

  return (
    <div className="p-8 space-y-10 max-w-4xl relative">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Profile Settings</h1>
      
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
        <h2 className="text-2xl font-bold tracking-tight pt-8 text-foreground">Subscription & Credits</h2>
        <p className="text-sm text-muted-foreground">Select a pricing model to purchase credits and optimize more resumes instantly.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Free Plan */}
        <div className="bg-white border border-border p-6 rounded-[2rem] flex flex-col justify-between hover:border-primary/50 transition-all shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-foreground">Free Plan</h3>
            <p className="text-3xl font-extrabold text-foreground">₹0</p>
            <p className="text-muted-foreground text-xs font-medium">Add 400 N Credits to your account.</p>
          </div>
          <button 
            disabled={activePlan === "free"} 
            onClick={() => displayRazorpay("free", 0, 400)} 
            className={`mt-6 py-3 rounded-xl font-bold text-sm transition-all border ${
              activePlan === "free" 
              ? "bg-muted text-muted-foreground cursor-not-allowed border-transparent" 
              : "border-border text-foreground hover:bg-muted active:scale-[0.98]"
            }`}
          >
            {activePlan === "free" ? "Current Plan" : "Claim Free"}
          </button>
        </div>

        {/* Standard Plan */}
        <div className="bg-white border border-border p-6 rounded-[2rem] flex flex-col justify-between hover:border-primary/50 transition-all shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-foreground">Standard Plan</h3>
            <p className="text-3xl font-extrabold text-foreground">₹500</p>
            <p className="text-muted-foreground text-xs font-medium">Add 450 N Credits to your account.</p>
          </div>
          <button 
            disabled={activePlan === "standard"} 
            onClick={() => displayRazorpay("standard", 500, 450)} 
            className={`mt-6 py-3 rounded-xl font-bold text-sm transition-all border ${
              activePlan === "standard" 
              ? "bg-muted text-muted-foreground cursor-not-allowed border-transparent" 
              : "border-border text-foreground hover:bg-muted active:scale-[0.98]"
            }`}
          >
            {activePlan === "standard" ? "Current Plan" : "Buy Now"}
          </button>
        </div>

        {/* Pro Plan */}
        <div className="bg-white p-6 rounded-[2rem] flex flex-col justify-between border-2 border-primary bg-primary/5 shadow-lg transition-all relative overflow-hidden">
          <div className="space-y-3">
            <div className="inline-block px-2.5 py-1 bg-primary/20 text-primary text-[9px] font-bold rounded-full mb-1">MOST POPULAR</div>
            <h3 className="text-lg font-bold text-foreground">Pro Plan</h3>
            <p className="text-3xl font-extrabold text-foreground">₹1000</p>
            <p className="text-muted-foreground text-xs font-medium">Add 900 N Credits to your account.</p>
          </div>
          <button 
            disabled={activePlan === "pro"} 
            onClick={() => displayRazorpay("pro", 1000, 900)} 
            className={`mt-6 py-3 rounded-xl font-bold text-sm transition-all ${
              activePlan === "pro" 
              ? "bg-muted text-muted-foreground cursor-not-allowed" 
              : "bg-primary text-primary-foreground shadow-md hover:opacity-90 active:scale-[0.98]"
            }`}
          >
            {activePlan === "pro" ? "Current Plan" : "Buy Now"}
          </button>
        </div>
      </div>

      {/* CUSTOM PREMIUM SANDBOX SIMULATION MODAL */}
      <AnimatePresence>
        {showSandboxModal && sandboxDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isSimulating && setShowSandboxModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            
            {/* Modal Box */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white border border-border w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative z-10 overflow-hidden text-center"
            >
              {/* Top Close Button */}
              {!isSimulating && (
                <button 
                  onClick={() => setShowSandboxModal(false)}
                  className="absolute right-6 top-6 text-muted-foreground hover:text-foreground transition-colors p-1 bg-muted rounded-full"
                >
                  <X size={16} />
                </button>
              )}

              {simulationStep === "confirm" ? (
                <div className="space-y-6">
                  {/* Icon */}
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary animate-pulse">
                    <CreditCard size={28} />
                  </div>

                  {/* Header */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-extrabold text-foreground flex items-center justify-center gap-1.5">
                      <ShieldCheck size={20} className="text-green-500" /> Sandbox Checkout
                    </h3>
                    <p className="text-xs text-muted-foreground max-w-[280px] mx-auto leading-relaxed">
                      No Razorpay API credentials are configured. Simulate a sandbox test payment to upgrade your account instantly!
                    </p>
                  </div>

                  {/* Details Card */}
                  <div className="bg-muted p-5 rounded-2xl text-left space-y-2 border border-border">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-muted-foreground">Product</span>
                      <span className="text-foreground uppercase">{sandboxDetails.planId} Plan</span>
                    </div>
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-muted-foreground">Credits Loaded</span>
                      <span className="text-primary font-bold">+{sandboxDetails.credits} Credits</span>
                    </div>
                    <div className="border-t border-border/80 my-2 pt-2 flex justify-between text-sm font-bold">
                      <span className="text-foreground">Total Paid</span>
                      <span className="text-foreground">₹{sandboxDetails.amount}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2.5">
                    <button 
                      onClick={handleSimulatePayment}
                      disabled={isSimulating}
                      className="w-full py-3.5 bg-primary text-primary-foreground rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:opacity-95 disabled:opacity-50 transition-all active:scale-[0.98]"
                    >
                      {isSimulating ? (
                        <><Loader2 className="animate-spin" size={16} /> Verifying Transaction...</>
                      ) : (
                        "Simulate Successful Payment"
                      )}
                    </button>
                    
                    {!isSimulating && (
                      <button 
                        onClick={() => setShowSandboxModal(false)}
                        className="w-full py-3.5 bg-transparent border border-border hover:bg-muted text-foreground rounded-2xl font-bold text-sm transition-all"
                      >
                        Cancel Transaction
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-6 py-4">
                  {/* Success Anim Icon */}
                  <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto text-green-500"
                  >
                    <CheckCircle2 size={44} />
                  </motion.div>

                  {/* Success message */}
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-foreground">Payment Successful!</h3>
                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Transaction Verified</p>
                  </div>

                  <div className="bg-green-50/50 border border-green-100 p-5 rounded-2xl space-y-2.5 max-w-[320px] mx-auto text-left">
                    <p className="text-xs text-green-700 leading-relaxed font-medium">
                      <strong>🎉 Success:</strong> Your account has been upgraded to the <strong>{sandboxDetails.planId.toUpperCase()} Plan</strong>!
                    </p>
                    <p className="text-[11px] text-green-600 font-bold">
                      💳 +{sandboxDetails.credits} N Credits added successfully.
                    </p>
                  </div>

                  <button 
                    onClick={() => setShowSandboxModal(false)}
                    className="w-full py-3.5 bg-primary text-white rounded-2xl font-bold text-sm shadow-md hover:bg-primary/95 transition-all"
                  >
                    Done
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
