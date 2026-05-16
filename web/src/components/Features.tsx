"use client";

import { motion } from "framer-motion";
import { Zap, Brain, Target, BarChart3, Shield, Globe } from "lucide-react";

const features = [
  {
    title: "Instant ATS Scoring",
    description: "Our proprietary algorithm scores your resume against industry-standard ATS patterns in milliseconds.",
    icon: <Zap className="w-6 h-6" />,
    color: "bg-yellow-500/10 text-yellow-500",
  },
  {
    title: "AI Hiring Intelligence",
    description: "Get recruiter-level insights into your hiring readiness and how you rank against other candidates.",
    icon: <Brain className="w-6 h-6" />,
    color: "bg-primary/10 text-primary",
  },
  {
    title: "Smart Keyword Matching",
    description: "Automatically detect missing keywords from job descriptions and tailor your resume for maximum impact.",
    icon: <Target className="w-6 h-6" />,
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    title: "Visual Analytics",
    description: "Beautifully animated charts and widgets help you visualize your skill gaps and resume performance.",
    icon: <BarChart3 className="w-6 h-6" />,
    color: "bg-green-500/10 text-green-500",
  },
  {
    title: "Data Privacy",
    description: "Your data is encrypted and secure. We never sell your personal information or resume content.",
    icon: <Shield className="w-6 h-6" />,
    color: "bg-red-500/10 text-red-500",
  },
  {
    title: "Global Compatibility",
    description: "Designed for modern remote jobs and international tech companies with global standards.",
    icon: <Globe className="w-6 h-6" />,
    color: "bg-cyan-500/10 text-cyan-500",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 container px-6 space-y-16">
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-5xl font-bold">Built for the <span className="text-primary">top 1%</span></h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Advanced tools designed to give you a competitive edge in the modern job market.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-8 rounded-3xl group hover:border-primary/50 transition-colors"
          >
            <div className={`w-12 h-12 rounded-2xl ${f.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              {f.icon}
            </div>
            <h3 className="text-xl font-bold mb-3">{f.title}</h3>
            <p className="text-muted-foreground leading-relaxed">
              {f.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
