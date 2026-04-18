import React from "react";
import { Search, Hash, Star, LayoutGrid } from "lucide-react";
import { HoverGlow } from "@/components/ui/hover-glow";

const features = [
  {
    title: "Instant Search",
    description: "Lightning-fast search engine that understands context and relevancy.",
    icon: Search,
    color: "indigo" as const,
  },
  {
    title: "Categorized Tips",
    description: "Browse tips by category, from programming to business and beyond.",
    icon: Hash,
    color: "cyan" as const,
  },
  {
    title: "Save Favorites",
    description: "Keep your most useful tips just a click away in your personal collection.",
    icon: Star,
    color: "purple" as const,
  },
  {
    title: "Beautiful Interface",
    description: "Designed for clarity and focus, so you can find what you need without noise.",
    icon: LayoutGrid,
    color: "green" as const,
  },
];

export function Features() {
  return (
    <section id="features" className="bg-[#0A0A0F] py-24">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">Everything you need</h2>
          <p className="mx-auto max-w-2xl text-slate-400">
            A simple but powerful toolkit designed to make searching for information effortless.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <HoverGlow key={feature.title} color={feature.color}>
              <div className="h-full rounded-2xl border border-white/5 bg-white/5 p-8 backdrop-blur-sm">
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900/50 text-indigo-400 border border-white/10">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-white">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            </HoverGlow>
          ))}
        </div>
      </div>
    </section>
  );
}
