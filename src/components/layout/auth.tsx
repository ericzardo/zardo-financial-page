"use client";

import { ReactNode } from "react";
import { Logo } from "@/components/ui/logo"; 

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex animate-fade-up">
      <div className="hidden lg:flex lg:w-1/2 finza-gradient bg-primary relative overflow-hidden">
        
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
        
        {/* Abstract Pattern - More Visible */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-72 h-72 rounded-full border-2 border-primary-foreground" />
          <div className="absolute top-40 left-40 w-96 h-96 rounded-full border border-primary-foreground" />
          <div className="absolute bottom-20 right-10 w-64 h-64 rounded-full border-2 border-primary-foreground" />
          <div className="absolute bottom-40 right-40 w-48 h-48 rounded-full border border-primary-foreground" />
          <div className="absolute top-1/2 left-1/4 w-80 h-80 rounded-full border border-primary-foreground" />
          <div className="absolute -bottom-10 -left-10 w-56 h-56 rounded-full border-2 border-primary-foreground" />
        </div>
        
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-purple-300/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 p-8">
          <Logo className="text-white" size="lg" />
        </div>
      </div>
      
      {/* Right Side - Form Container */}
      <div 
        className="w-full lg:w-1/2 flex flex-col bg-card relative z-10"
        style={{ boxShadow: '-10px 0 30px rgba(0,0,0,0.1)' }}
      >
        {/* Mobile Logo */}
        <div className="p-8 lg:hidden">
          <Logo className="text-finza-highlight" size="lg" showBeta />
        </div>
        
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md space-y-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}