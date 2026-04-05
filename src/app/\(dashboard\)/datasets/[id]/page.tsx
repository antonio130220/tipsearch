import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { getDownloadUrl } from "../actions"
import { ArrowLeft, Download, Database, Calendar, Building2, MapPin, HardDrive } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function DatasetDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  
  const { data: dataset } = await supabase
    .from('datasets')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!dataset) notFound()

  const downloadUrl = await getDownloadUrl(dataset.ficheiro_url)

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/datasets">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex items-center gap-2 text-zinc-500 text-sm">
          <Link href="/datasets" className="hover:text-zinc-900">Datasets</Link>
          <span>/</span>
          <span className="text-zinc-900 font-medium truncate max-w-[200px]">{dataset.nome}</span>
        </div>
      </header>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-zinc-100 text-[10px] font-bold uppercase tracking-wider text-zinc-600">
                {dataset.categoria}
              </span>
              <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                <MapPin className="h-3 w-3" /> {dataset.regiao}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-zinc-900">{dataset.nome}</h1>
            <p className="text-zinc-600 leading-relaxed whitespace-pre-wrap">
              {dataset.descricao}
            </p>
          </div>

          <div className="bg-zinc-50 rounded-xl p-6 grid grid-cols-2 gap-6 border border-zinc-100">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-zinc-500 text-sm">
                <Building2 className="h-4 w-4" /> Fonte Oficial
              </div>
              <p className="font-semibold text-zinc-900">{dataset.fonte_oficial}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-zinc-500 text-sm">
                <Calendar className="h-4 w-4" /> Ano de Referência
              </div>
              <p className="font-semibold text-zinc-900">{dataset.ano}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-zinc-500 text-sm">
                <HardDrive className="h-4 w-4" /> Tamanho do Ficheiro
              </div>
              <p className="font-semibold text-zinc-900">{dataset.tamanho}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-zinc-500 text-sm">
                <Database className="h-4 w-4" /> Formato
              </div>
              <p className="font-semibold text-zinc-900 uppercase">
                {dataset.ficheiro_url.split('.').pop()}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="border rounded-xl p-6 bg-white shadow-sm space-y-4">
            <h3 className="font-bold text-zinc-900">Acesso aos Dados</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Este conjunto de dados é fornecido para fins de investigação académica e análise estatística.
            </p>
            {downloadUrl ? (
              <Button asChild className="w-full bg-zinc-900 text-white hover:bg-zinc-800 py-6">
                <a href={downloadUrl} download>
                  <Download className="mr-2 h-4 w-4" />
                  Descarregar Dataset
                </a>
              </Button>
            ) : (
              <p className="text-sm text-red-500">Erro ao gerar link de download.</p>
            )}
          </div>
          
          <div className="rounded-xl p-6 border border-zinc-100 bg-zinc-50/50">
            <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest mb-2">Metadata</p>
            <div className="text-xs text-zinc-500 space-y-2">
              <p>ID: {dataset.id}</p>
              <p>Publicado em: {new Date(dataset.criado_em).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
