import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Calendar, User, Tag, BookOpen, Share2 } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function ArtigoDetalhePage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createClient()
  
  const { data: artigo } = await supabase
    .from('artigos')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!artigo) {
    notFound()
  }

  // Gerar URL de download
  const { data: { publicUrl } } = supabase.storage
    .from('artigos')
    .getPublicUrl(artigo.ficheiro_url)

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="flex items-center justify-between">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/artigos">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Partilhar
          </Button>
          <Button asChild size="sm" className="bg-zinc-900 text-white hover:bg-zinc-800">
            <a href={publicUrl} target="_blank" download>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </a>
          </Button>
        </div>
      </header>

      <div className="space-y-6">
        <div className="space-y-4">
          <span className="inline-block px-3 py-1 rounded-full bg-zinc-100 text-xs font-bold uppercase tracking-wider text-zinc-600">
            {artigo.area}
          </span>
          <h1 className="text-4xl font-extrabold text-zinc-900 tracking-tight">
            {artigo.titulo}
          </h1>
          
          <div className="flex flex-wrap gap-6 text-sm text-zinc-500 border-y py-4 border-zinc-100">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-zinc-100 flex items-center justify-center">
                <User className="h-4 w-4 text-zinc-400" />
              </div>
              <span className="font-medium text-zinc-900">{artigo.autores}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Publicado em {artigo.ano}</span>
            </div>
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              <span>{artigo.palavras_chave}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-2xl p-8 space-y-6 shadow-sm">
          <div className="flex items-center gap-2 text-zinc-900 font-bold">
            <BookOpen className="h-5 w-5" />
            <h2>Abstract</h2>
          </div>
          <p className="text-zinc-600 leading-relaxed text-lg whitespace-pre-wrap">
            {artigo.abstract}
          </p>
        </div>

        <div className="bg-zinc-50 rounded-xl p-6 border border-zinc-100">
          <h3 className="text-sm font-bold text-zinc-900 mb-2">Como citar este artigo:</h3>
          <p className="text-xs text-zinc-500 font-mono bg-white p-3 border rounded">
            {artigo.autores} ({artigo.ano}). {artigo.titulo}. Repositório Tipsearch.
          </p>
        </div>
      </div>
    </div>
  )
}
