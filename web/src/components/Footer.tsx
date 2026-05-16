"use client";

import { Sparkles, Github, Twitter, Linkedin } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/5 pt-20 pb-10 container px-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tighter">HireSense</span>
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Revolutionizing the hiring process with AI-powered intelligence. 
            Tailored for modern tech professionals.
          </p>
          <div className="flex gap-4">
            <Github className="w-5 h-5 text-muted-foreground hover:text-white cursor-pointer" />
            <Twitter className="w-5 h-5 text-muted-foreground hover:text-white cursor-pointer" />
            <Linkedin className="w-5 h-5 text-muted-foreground hover:text-white cursor-pointer" />
          </div>
        </div>

        <div>
          <h4 className="font-bold mb-6">Product</h4>
          <ul className="space-y-4 text-sm text-muted-foreground">
            <li className="hover:text-white cursor-pointer transition-colors">Analyzer</li>
            <li className="hover:text-white cursor-pointer transition-colors">Dashboard</li>
            <li className="hover:text-white cursor-pointer transition-colors">Templates</li>
            <li className="hover:text-white cursor-pointer transition-colors">Enterprise</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6">Resources</h4>
          <ul className="space-y-4 text-sm text-muted-foreground">
            <li className="hover:text-white cursor-pointer transition-colors">Documentation</li>
            <li className="hover:text-white cursor-pointer transition-colors">Blog</li>
            <li className="hover:text-white cursor-pointer transition-colors">Careers</li>
            <li className="hover:text-white cursor-pointer transition-colors">Privacy</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6">Join the waitlist</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Stay updated with our latest AI feature releases.
          </p>
          <div className="flex gap-2">
            <input 
              type="email" 
              placeholder="Email address" 
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary/50 w-full"
            />
            <button className="bg-white text-black px-4 py-2 rounded-xl text-sm font-bold">Join</button>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between pt-10 border-t border-white/5 text-xs text-muted-foreground">
        <p>© 2024 HireSense AI. All rights reserved.</p>
        <div className="flex gap-8 mt-4 md:mt-0">
          <span className="hover:text-white cursor-pointer">Terms of Service</span>
          <span className="hover:text-white cursor-pointer">Privacy Policy</span>
          <span className="hover:text-white cursor-pointer">Cookie Settings</span>
        </div>
      </div>
    </footer>
  );
}
