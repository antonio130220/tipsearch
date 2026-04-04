import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function DatasetsPage() {
  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Datasets</h1>
          <p className="text-zinc-500">Aceda a conjuntos de dados para investigação e treino de modelos.</p>
        </div>
        <Button className="bg-zinc-900 text-white hover:bg-zinc-800">
          <Plus className="mr-2 h-4 w-4" />
          Novo Dataset
        </Button>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="group rounded-lg border p-6 hover:border-zinc-400 transition-all cursor-pointer">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md border bg-zinc-50 text-zinc-600 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
              <span className="text-sm font-semibold">Dt</span>
            </div>
            <h3 className="font-semibold text-zinc-900">Dataset de Preços de Imóveis {2024 - i}</h3>
            <p className="mt-2 text-sm text-zinc-500">Formato CSV • 1.2 GB</p>
          </div>
        ))}
      </div>
    </div>
  );
}
