import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Filter, Search, Briefcase, GraduationCap, Book, Calendar } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function TrabalhosPage({
  searchParams,
}: {
  searchParams: { 
    busca?: string; 
    tipo?: string; 
    curso?: string;
    ano?: string;
  }
}) {
  const supabase = createClient();
  
  // Query para trabalhos aprovados
  let query = supabase
    .from('trabalhos')
    .select('*')
    .eq('aprovado', true)
    .order('criado_em', { ascending: false });

  if (searchParams.busca) {
    query = query.or(`titulo.ilike.%${searchParams.busca}%,disciplina.ilike.%${searchParams.busca}%`);
  }
  if (searchParams.tipo && searchParams.tipo !== 'Todos') {
    query = query.eq('tipo', searchParams.tipo);
  }
  if (searchParams.curso) {
    query = query.ilike('curso', `%${searchParams.curso}%`);
  }
  if (searchParams.ano) {
    query = query.eq('ano_letivo', searchParams.ano);
  }

  const { data: trabalhos } = await query;

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Trabalhos Académicos</h1>
          <p className="text-zinc-500">Consulte TFCs e trabalhos curriculares para inspiração.</p>
        </div>
        <Button asChild className="bg-zinc-900 text-white hover:bg-zinc-800">
          <Link href="/trabalhos/upload">
            <Plus className="mr-2 h-4 w-4" />
            Enviar Trabalho
          </Link>
        </Button>
      </header>

      {/* Barra de Filtros */}
      <form method="GET" className="grid gap-4 rounded-xl border bg-zinc-50/50 p-4 md:grid-cols-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-500 uppercase ml-1">Pesquisar</label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
            <input 
              name="busca"
              placeholder="Título ou disciplina..." 
              defaultValue={searchParams.busca}
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
            <option value="curricular">Curricular</option>
            <option value="TFC">TFC</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-500 uppercase ml-1">Curso</label>
          <input 
            name="curso"
            placeholder="Ex: Engenharia"
            defaultValue={searchParams.curso}
            className="w-full rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-zinc-300"
          />
        </div>

        <div className="flex flex-col justify-end">
          <Button type="submit" variant="secondary" className="w-full h-8">
            <Filter className="h-3 w-3 mr-2" />
            Filtrar
          </Button>
        </div>
      </form>

      {/* Listagem de Trabalhos */}
      {trabalhos && trabalhos.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2">
          {trabalhos.map((trabalho) => (
            <Link 
              key={trabalho.id} 
              href={`/trabalhos/${trabalho.id}`}
              className="group rounded-xl border bg-white p-6 hover:border-zinc-400 transition-all shadow-sm"
            >
              <div className="flex flex-col h-full space-y-4">
                <div className="flex items-start justify-between">
                  <div className="h-10 w-10 rounded-lg bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:bg-zinc-900 group-hover:text-white transition-all">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <span className={cn(
                    "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider",
                    trabalho.tipo === 'TFC' ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                  )}>
                    {trabalho.tipo === 'TFC' ? 'TFC' : 'Curricular'}
                  </span>
                </div>

                <div className="space-y-1 flex-1">
                  <h3 className="font-bold text-zinc-900 group-hover:text-zinc-700 transition-colors line-clamp-2">
                    {trabalho.titulo}
                  </h3>
                  <p className="text-sm text-zinc-500 line-clamp-1">{trabalho.disciplina}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-50 text-[11px] text-zinc-500">
                  <div className="flex items-center gap-1.5">
                    <GraduationCap className="h-3.5 w-3.5" />
                    <span className="truncate">{trabalho.curso}</span>
                  </div>
                  <div className="flex items-center gap-1.5 justify-end">
                    <Calendar className="h-3.5 w-3.5" />
                    {trabalho.ano_letivo}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-xl">
          <div className="h-12 w-12 rounded-full bg-zinc-50 flex items-center justify-center mb-4 text-zinc-400">
            <Briefcase className="h-6 w-6" />
          </div>
          <h3 className="text-zinc-900 font-medium">Nenhum trabalho encontrado</h3>
          <p className="text-sm text-zinc-500 mt-1">Ainda não foram publicados trabalhos com estes critérios.</p>
        </div>
      )}
    </div>
  );
}

// Helper para classes
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
