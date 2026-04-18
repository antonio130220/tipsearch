import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0A0A0F]">
      <Hero />
      <Features />
      
      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#0A0A0F] py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} TipSearch. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
