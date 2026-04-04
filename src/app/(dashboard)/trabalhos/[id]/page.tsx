import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Briefcase, GraduationCap, Calendar, Book, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function TrabalhoDetalhePage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createClient()
  
  const { data: trabalho } = await supabase
    .from('trabalhos')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!trabalho) {
    notFound()
  }

  // Gerar URL de download
  const { data: { publicUrl } } = supabase.storage
    .from('trabalhos')
    .getPublicUrl(trabalho.ficheiro_url)

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="flex items-center justify-between">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/trabalhos">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <Button asChild className="bg-zinc-900 text-white hover:bg-zinc-800">
          <a href={publicUrl} target="_blank" download>
            <Download className="h-4 w-4 mr-2" />
            Download Trabalho
          </a>
        </Button>
      </header>

      <div className="space-y-6">
        {/* Aviso de Plágio */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 items-center text-amber-800">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <p className="text-xs font-semibold">
            Este material é disponibilizado apenas para consulta e inspiração. A cópia constitui plágio académico.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
              trabalho.tipo === 'TFC' ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
            }`}>
              {trabalho.tipo === 'TFC' ? 'Trabalho de Fim de Curso' : 'Trabalho Curricular'}
            </span>
            <span className="text-zinc-300">•</span>
            <span className="text-xs text-zinc-500 font-medium">{trabalho.disciplina}</span>
          </div>
          
          <h1 className="text-4xl font-extrabold text-zinc-900 tracking-tight leading-tight">
            {trabalho.titulo}
          </h1>
          
          <div className="flex flex-wrap gap-x-8 gap-y-4 pt-4 text-sm text-zinc-500">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              <span className="font-semibold text-zinc-900">{trabalho.curso}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Ano Letivo: {trabalho.ano_letivo}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-2xl p-8 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-zinc-900 font-bold">
            <Book className="h-5 w-5 text-zinc-400" />
            <h2>Resumo do Trabalho</h2>
          </div>
          <p className="text-zinc-600 leading-relaxed text-lg whitespace-pre-wrap">
            {trabalho.resumo || "Não foi fornecido um resumo para este trabalho."}
          </p>
        </div>

        <div className="rounded-xl border border-dashed p-12 text-center space-y-4">
          <Briefcase className="h-12 w-12 text-zinc-200 mx-auto" />
          <div className="max-w-sm mx-auto space-y-2">
            <h3 className="font-bold text-zinc-900">Documento pronto a consultar</h3>
            <p className="text-xs text-zinc-500">
              Utilize este trabalho para entender a estrutura e metodologia aplicada na sua disciplina.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
