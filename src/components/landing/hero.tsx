import React from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#0A0A0F] pt-24 pb-16 md:pt-32 md:pb-24">
      {/* Mesh Gradient Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-indigo-500/20 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-cyan-500/10 blur-[120px]" />
      </div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 z-0 bg-grid-white" />

      <div className="container relative z-10 mx-auto px-4 text-center">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-6 bg-gradient-to-b from-white to-white/60 bg-clip-text text-5xl font-bold tracking-tight text-transparent md:text-7xl">
            TipSearch
          </h1>
          <p className="mb-10 text-lg text-slate-400 md:text-xl">
            Find the best tips, instantly. A modern platform to discover, share, and organize expert insights.
          </p>

          <div className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/login">
              <Button size="lg" className="h-12 px-8 text-base bg-indigo-600 hover:bg-indigo-700 text-white border-none transition-all hover:scale-105 active:scale-95">
                Get Started
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg" className="h-12 px-8 text-base border-slate-700 text-slate-300 hover:bg-slate-800 transition-all hover:scale-105 active:scale-95">
                Learn More
              </Button>
            </Link>
          </div>

          {/* Decorative Search Preview */}
          <div className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur-xl">
            <div className="flex items-center gap-3 rounded-xl bg-slate-900/50 px-4 py-3 border border-white/5">
              <Search className="h-5 w-5 text-slate-500" />
              <div className="flex-1 text-left text-slate-500 text-sm md:text-base">
                Search for "UI/UX design tips" or "Next.js performance"...
              </div>
              <div className="hidden rounded-md bg-slate-800 px-2 py-1 text-[10px] font-mono text-slate-400 md:block">
                ⌘ K
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
