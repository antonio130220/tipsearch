"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, FileText, Briefcase, Database, Search, LogOut, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { signout } from "@/app/auth/actions";

const modules = [
  { name: "Provas", icon: FileText, href: "/provas" },
  { name: "Artigos", icon: BookOpen, href: "/artigos" },
  { name: "Trabalhos", icon: Briefcase, href: "/trabalhos" },
  { name: "Datasets", icon: Database, href: "/datasets" },
  { name: "Administração", icon: ShieldCheck, href: "/admin" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r bg-[#F7F7F7] lg:block">
      <div className="flex h-full flex-col px-3 py-4">
        <div className="mb-8 px-3">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight text-zinc-900">
            <span className="flex h-6 w-6 items-center justify-center rounded bg-zinc-900 text-[10px] text-white">T</span>
            <span>tipsearch</span>
          </Link>
        </div>
        
        <div className="mb-4 px-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
            <input
              placeholder="Pesquisar..."
              className="w-full rounded-md border border-zinc-200 bg-white px-8 py-1.5 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-300"
            />
          </div>
        </div>

        <nav className="flex-1 space-y-0.5">
          {modules.map((module) => {
            const isActive = pathname === module.href;
            return (
              <Link
                key={module.name}
                href={module.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-zinc-200/60 text-zinc-900 shadow-sm" 
                    : "text-zinc-500 hover:bg-zinc-200/40 hover:text-zinc-900"
                )}
              >
                <module.icon className={cn("h-4 w-4", isActive ? "text-zinc-900" : "text-zinc-400")} />
                {module.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="mt-auto border-t border-zinc-200 pt-4 px-3 space-y-1">
          <div className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-200/40 rounded-md cursor-pointer transition-colors">
            <div className="h-6 w-6 rounded-full bg-zinc-200 border border-zinc-300" />
            <span>Meu Perfil</span>
          </div>
          
          <button 
            onClick={() => signout()}
            className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md cursor-pointer transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Terminar Sessão</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
