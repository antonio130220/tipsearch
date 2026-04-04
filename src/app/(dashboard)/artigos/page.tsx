import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Filter, Search, BookOpen, Calendar, User, Tag } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function ArtigosPage({
  searchParams,
}: {
  searchParams: { 
    busca?: string; 
    area?: string; 
    ano?: string;
  }
}) {
  const supabase = createClient();
  
  // Query para artigos aprovados
  let query = supabase
    .from('artigos')
    .select('*')
    .eq('aprovado', true)
    .order('criado_em', { ascending: false });

  if (searchParams.busca) {
    query = query.or(`titulo.ilike.%${searchParams.busca}%,palavras_chave.ilike.%${searchParams.busca}%`);
  }
  if (searchParams.area && searchParams.area !== 'Todas') {
    query = query.eq('area', searchParams.area);
  }
  if (searchParams.ano) {
    query = query.eq('ano', parseInt(searchParams.ano));
  }

  const { data: artigos } = await query;

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Artigos Científicos</h1>
          <p className="text-zinc-500">Repositório de artigos submetidos pela comunidade académica.</p>
        </div>
        <Button asChild className="bg-zinc-900 text-white hover:bg-zinc-800">
          <Link href="/artigos/upload">
            <Plus className="mr-2 h-4 w-4" />
            Submeter Artigo
          </Link>
        </Button>
      </header>

      {/* Barra de Filtros */}
      <form method="GET" className="grid gap-4 rounded-xl border bg-zinc-50/50 p-4 md:grid-cols-4">
        <div className="md:col-span-2 space-y-1.5">
          <label className="text-xs font-semibold text-zinc-500 uppercase ml-1">Pesquisar</label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
            <input 
              name="busca"
              placeholder="Título ou palavras-chave..." 
              defaultValue={searchParams.busca}
              className="w-full rounded-md border border-zinc-200 bg-white px-8 py-1.5 text-sm outline-none focus:ring-1 focus:ring-zinc-300"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-500 uppercase ml-1">Área</label>
          <select 
            name="area"
            defaultValue={searchParams.area || "Todas"}
            className="w-full rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-zinc-300"
          >
            <option value="Todas">Todas</option>
            <option value="Engenharia">Engenharia</option>
            <option value="Medicina">Medicina</option>
            <option value="Direito">Direito</option>
            <option value="Economia">Economia</option>
            <option value="Ciências Sociais">Ciências Sociais</option>
            <option value="Outro">Outro</option>
          </select>
        </div>

        <div className="flex flex-col justify-end">
          <Button type="submit" variant="secondary" className="w-full h-8">
            <Filter className="h-3 w-3 mr-2" />
            Filtrar
          </Button>
        </div>
      </form>

      {/* Listagem de Artigos */}
      {artigos && artigos.length > 0 ? (
        <div className="grid gap-6">
          {artigos.map((artigo) => (
            <Link 
              key={artigo.id} 
              href={`/artigos/${artigo.id}`}
              className="group block rounded-xl border bg-white p-6 hover:border-zinc-400 transition-all shadow-sm"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="inline-block px-2 py-0.5 rounded bg-zinc-100 text-[10px] font-bold uppercase tracking-wider text-zinc-600">
                      {artigo.area}
                    </span>
                    <h3 className="text-xl font-bold text-zinc-900 group-hover:text-zinc-700 transition-colors">
                      {artigo.titulo}
                    </h3>
                  </div>
                  <div className="h-10 w-10 shrink-0 rounded-lg bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:bg-zinc-900 group-hover:text-white transition-all">
                    <BookOpen className="h-5 w-5" />
                  </div>
                </div>

                <p className="text-zinc-500 text-sm line-clamp-2 italic">
                  "{artigo.abstract}"
                </p>

                <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-zinc-500 pt-2 border-t border-zinc-50">
                  <div className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5" />
                    {artigo.autores}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {artigo.ano}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Tag className="h-3.5 w-3.5" />
                    {artigo.palavras_chave}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-xl">
          <div className="h-12 w-12 rounded-full bg-zinc-50 flex items-center justify-center mb-4 text-zinc-400">
            <BookOpen className="h-6 w-6" />
          </div>
          <h3 className="text-zinc-900 font-medium">Nenhum artigo encontrado</h3>
          <p className="text-sm text-zinc-500 mt-1">Seja o primeiro a submeter um artigo para esta área.</p>
        </div>
      )}
    </div>
  );
}
