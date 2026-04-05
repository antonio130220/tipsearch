import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { getDownloadUrl } from "../actions"
import { ArrowLeft, Download, BookOpen, Calendar, User, Tag, FileText } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function ArtigoDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  
  const { data: artigo } = await supabase
    .from('artigos')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!artigo) notFound()

  const downloadUrl = await getDownloadUrl(artigo.ficheiro_url)

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/artigos">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex items-center gap-2 text-zinc-500 text-sm">
          <Link href="/artigos" className="hover:text-zinc-900">Artigos</Link>
          <span>/</span>
          <span className="text-zinc-900 font-medium truncate max-w-[200px]">{artigo.titulo}</span>
        </div>
      </header>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-8">
          <div className="space-y-4">
            <span className="inline-block px-2 py-0.5 rounded bg-zinc-100 text-[10px] font-bold uppercase tracking-wider text-zinc-600">
              {artigo.area}
            </span>
            <h1 className="text-3xl font-bold text-zinc-900 leading-tight">
              {artigo.titulo}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-zinc-500">
              <div className="flex items-center gap-1.5 font-medium text-zinc-900">
                <User className="h-4 w-4" />
                {artigo.autores}
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                Publicado em {artigo.ano}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-zinc-900 flex items-center gap-2">
              <FileText className="h-4 w-4" /> Resumo (Abstract)
            </h3>
            <p className="text-zinc-600 leading-relaxed italic border-l-4 border-zinc-100 pl-4">
              "{artigo.abstract}"
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-zinc-900 flex items-center gap-2">
              <Tag className="h-4 w-4" /> Palavras-chave
            </h3>
            <div className="flex flex-wrap gap-2">
              {artigo.palavras_chave.split(',').map((tag: string) => (
                <span key={tag} className="px-3 py-1 rounded-full border border-zinc-200 text-xs text-zinc-600 bg-white">
                  {tag.trim()}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="border rounded-xl p-6 bg-white shadow-sm space-y-4 sticky top-8">
            <div className="h-12 w-12 rounded-lg bg-zinc-50 flex items-center justify-center text-zinc-400 mb-4">
              <BookOpen className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-zinc-900">Acesso ao PDF</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Consulte este artigo completo descarregando o ficheiro original em formato PDF.
            </p>
            {downloadUrl ? (
              <Button asChild className="w-full bg-zinc-900 text-white hover:bg-zinc-800 py-6">
                <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
                  <Download className="mr-2 h-4 w-4" />
                  Descarregar Artigo
                </a>
              </Button>
            ) : (
              <p className="text-sm text-red-500">Link de download indisponível.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
