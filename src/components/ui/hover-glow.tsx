"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface HoverGlowProps {
  children: React.ReactNode;
  color?: "indigo" | "cyan" | "purple" | "green";
  className?: string;
}

const colorStyles = {
  indigo: "hover:shadow-[0_8px_30px_rgba(99,102,241,0.35),0_4px_15px_rgba(6,182,212,0.2)]",
  cyan: "hover:shadow-[0_8px_30px_rgba(6,182,212,0.35),0_4px_15px_rgba(99,102,241,0.2)]",
  purple: "hover:shadow-[0_8px_30px_rgba(124,58,237,0.35),0_4px_15px_rgba(6,182,212,0.2)]",
  green: "hover:shadow-[0_8px_30px_rgba(16,185,129,0.35),0_4px_15px_rgba(6,182,212,0.2)]",
};

export function HoverGlow({ children, color = "indigo", className }: HoverGlowProps) {
  return (
    <div
      className={cn(
        "group cursor-pointer transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]",
        "motion-safe:hover:scale-[1.03] motion-safe:hover:-translate-y-0.5",
        colorStyles[color],
        className
      )}
    >
      {children}
    </div>
  );
}
