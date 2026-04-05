import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Filter, Search, FileText, Calendar, GraduationCap } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function ProvasPage({
  searchParams,
}: {
  searchParams: { 
    disciplina?: string; 
    tipo?: string; 
    semestre?: string; 
    ano?: string;
  }
}) {
  const supabase = createClient();
  
  // Construir a query
  let query = supabase
    .from('provas')
    .select('*')
    .eq('aprovado', true)
    .order('created_at', { ascending: false });

  if (searchParams.disciplina) {
    query = query.ilike('disciplina', `%${searchParams.disciplina}%`);
  }
  if (searchParams.tipo && searchParams.tipo !== 'Todos') {
    query = query.eq('tipo', searchParams.tipo);
  }
  if (searchParams.semestre && searchParams.semestre !== 'Todos') {
    query = query.eq('semestre', parseInt(searchParams.semestre));
  }
  if (searchParams.ano) {
    query = query.eq('ano_letivo', searchParams.ano);
  }

  const { data: provas, error } = await query;

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Provas</h1>
          <p className="text-zinc-500">Explore e filtre as provas disponíveis na plataforma.</p>
        </div>
        <Button asChild className="bg-zinc-900 text-white hover:bg-zinc-800">
          <Link href="/provas/upload">
            <Plus className="mr-2 h-4 w-4" />
            Nova Prova
          </Link>
        </Button>
      </header>

      {/* Barra de Filtros - Agora usando um formulário simples que envia via GET */}
      <form method="GET" className="grid gap-4 rounded-xl border bg-zinc-50/50 p-4 md:grid-cols-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-500 uppercase ml-1">Disciplina</label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
            <input 
              name="disciplina"
              placeholder="Pesquisar..." 
              defaultValue={searchParams.disciplina}
              className="w-full rounded-md border border-zinc-200 bg-white px-8 py-1.5 text-sm outline-none focus:ring-1 focus:ring-zinc-300"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-500 uppercase ml-1">Tipo</label>
          <select 
            name="tipo"
            defaultValue={searchParams.tipo || "Todos"}
            className="w-full rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-zinc-300"
          >
            <option value="Todos">Todos</option>
            <option value="PP1">PP1</option>
            <option value="PP2">PP2</option>
            <option value="Exame">Exame</option>
            <option value="Recurso">Recurso</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-500 uppercase ml-1">Semestre</label>
          <select 
            name="semestre"
            defaultValue={searchParams.semestre || "Todos"}
            className="w-full rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-zinc-300"
          >
            <option value="Todos">Todos</option>
            <option value="1">1º Semestre</option>
            <option value="2">2º Semestre</option>
          </select>
        </div>

        <div className="flex flex-col justify-end">
          <Button type="submit" variant="secondary" className="w-full h-8">
            <Filter className="h-3 w-3 mr-2" />
            Filtrar
          </Button>
        </div>
      </form>

      {/* Listagem de Provas */}
      {provas && provas.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {provas.map((prova) => (
            <Link 
              key={prova.id} 
              href={`/provas/${prova.id}`}
              className="group rounded-lg border bg-white p-6 hover:border-zinc-400 transition-all cursor-pointer shadow-sm"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md border bg-zinc-50 text-zinc-600 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                <FileText className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">{prova.tipo} • {prova.semestre}º Sem</span>
                <h3 className="font-semibold text-zinc-900 line-clamp-1">{prova.disciplina}</h3>
              </div>
              <div className="mt-4 flex items-center gap-4 text-xs text-zinc-500">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {prova.ano_letivo}
                </div>
                <div className="flex items-center gap-1">
                  <GraduationCap className="h-3 w-3" />
                  Universidade
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-xl">
          <div className="h-12 w-12 rounded-full bg-zinc-50 flex items-center justify-center mb-4 text-zinc-400">
            <Filter className="h-6 w-6" />
          </div>
          <h3 className="text-zinc-900 font-medium">Nenhuma prova encontrada</h3>
          <p className="text-sm text-zinc-500 mt-1">Tente ajustar os filtros ou pesquisar por outro termo.</p>
        </div>
      )}
    </div>
  );
}
