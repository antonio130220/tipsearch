import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Filter, Search, Database, HardDrive, Building2, MapPin } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function DatasetsPage({
  searchParams,
}: {
  searchParams: { 
    busca?: string; 
    categoria?: string; 
    regiao?: string;
  }
}) {
  const supabase = createClient();
  
  // Verificar se o utilizador é admin
  const { data: { user } } = await supabase.auth.getUser();
  const { data: userData } = await supabase.from('users').select('papel').eq('id', user?.id).single();
  const isAdmin = userData?.papel === 'admin';

  // Query para datasets aprovados
  let query = supabase
    .from('datasets')
    .select('*')
    .eq('aprovado', true)
    .order('criado_em', { ascending: false });

  if (searchParams.busca) {
    query = query.or(`nome.ilike.%${searchParams.busca}%,descricao.ilike.%${searchParams.busca}%`);
  }
  if (searchParams.categoria && searchParams.categoria !== 'Todas') {
    query = query.eq('categoria', searchParams.categoria);
  }
  if (searchParams.regiao && searchParams.regiao !== 'Todas') {
    query = query.eq('regiao', searchParams.regiao);
  }

  const { data: datasets } = await query;

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Datasets</h1>
          <p className="text-zinc-500">Conjuntos de dados estruturados para investigação.</p>
        </div>
        {isAdmin && (
          <Button asChild className="bg-zinc-900 text-white hover:bg-zinc-800">
            <Link href="/datasets/upload">
              <Plus className="mr-2 h-4 w-4" />
              Upload Dataset
            </Link>
          </Button>
        )}
      </header>

      {/* Barra de Filtros */}
      <form method="GET" className="grid gap-4 rounded-xl border bg-zinc-50/50 p-4 md:grid-cols-4">
        <div className="md:col-span-2 space-y-1.5">
          <label className="text-xs font-semibold text-zinc-500 uppercase ml-1">Pesquisar</label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
            <input 
              name="busca"
              placeholder="Nome ou descrição..." 
              defaultValue={searchParams.busca}
              className="w-full rounded-md border border-zinc-200 bg-white px-8 py-1.5 text-sm outline-none focus:ring-1 focus:ring-zinc-300"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-500 uppercase ml-1">Categoria</label>
          <select 
            name="categoria"
            defaultValue={searchParams.categoria || "Todas"}
            className="w-full rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-zinc-300"
          >
            <option value="Todas">Todas</option>
            <option value="Saúde">Saúde</option>
            <option value="Educação">Educação</option>
            <option value="Economia">Economia</option>
            <option value="Infraestrutura">Infraestrutura</option>
            <option value="População">População</option>
            <option value="Ambiente">Ambiente</option>
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

      {/* Listagem de Datasets */}
      {datasets && datasets.length > 0 ? (
        <div className="grid gap-6">
          {datasets.map((dataset) => (
            <div 
              key={dataset.id} 
              className="group rounded-xl border bg-white p-6 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-zinc-100 text-[10px] font-bold uppercase tracking-wider text-zinc-600">
                      {dataset.categoria}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      <MapPin className="h-3 w-3" /> {dataset.regiao}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-zinc-900 group-hover:text-zinc-700 transition-colors">
                      {dataset.nome}
                    </h3>
                    <p className="text-zinc-500 text-sm mt-1 line-clamp-2">
                      {dataset.descricao}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-6 text-xs text-zinc-500">
                    <div className="flex items-center gap-1.5 font-medium text-zinc-700">
                      <Building2 className="h-3.5 w-3.5" />
                      Fonte: {dataset.fonte_oficial}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <HardDrive className="h-3.5 w-3.5" />
                      {dataset.tamanho}
                    </div>
                    <div className="flex items-center gap-1.5">
                      Ano: {dataset.ano}
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <Button asChild variant="outline" className="border-zinc-200">
                    <Link href={`/datasets/${dataset.id}`}>
                      Detalhes
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-xl">
          <div className="h-12 w-12 rounded-full bg-zinc-50 flex items-center justify-center mb-4 text-zinc-400">
            <Database className="h-6 w-6" />
          </div>
          <h3 className="text-zinc-900 font-medium">Nenhum dataset encontrado</h3>
          <p className="text-sm text-zinc-500 mt-1">Ajuste os filtros ou tente uma nova pesquisa.</p>
        </div>
      )}
    </div>
  );
}
