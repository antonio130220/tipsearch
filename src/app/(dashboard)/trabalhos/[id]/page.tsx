import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { getDownloadUrl } from "../actions"
import { ArrowLeft, Download, Briefcase, GraduationCap, Calendar, AlertTriangle, User } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function TrabalhoDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  
  const { data: trabalho } = await supabase
    .from('trabalhos')
    .select('*, users:uploaded_by(nome)')
    .eq('id', params.id)
    .single()

  if (!trabalho) notFound()

  const downloadUrl = await getDownloadUrl(trabalho.ficheiro_url)

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/trabalhos">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex items-center gap-2 text-zinc-500 text-sm">
          <Link href="/trabalhos" className="hover:text-zinc-900">Trabalhos</Link>
          <span>/</span>
          <span className="text-zinc-900 font-medium truncate max-w-[200px]">{trabalho.titulo}</span>
        </div>
      </header>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-zinc-100 text-[10px] font-bold uppercase tracking-wider text-zinc-600">
                {trabalho.tipo}
              </span>
              <span className="px-2 py-0.5 rounded bg-zinc-900 text-[10px] font-bold uppercase tracking-wider text-white">
                {trabalho.disciplina}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-zinc-900 leading-tight">
              {trabalho.titulo}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-zinc-500">
              <div className="flex items-center gap-1.5 font-medium text-zinc-900">
                <GraduationCap className="h-4 w-4" />
                {trabalho.curso}
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                Ano letivo: {trabalho.ano}
              </div>
              <div className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                Submetido por: {trabalho.users?.nome || 'Utilizador'}
              </div>
            </div>
          </div>

          {/* AVISO DE PLÁGIO */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 flex gap-4 items-start">
            <AlertTriangle className="h-6 w-6 text-amber-600 shrink-0 mt-1" />
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-amber-900 uppercase tracking-wide">Atenção: Plágio Académico</h4>
              <p className="text-xs text-amber-800 leading-relaxed">
                Este trabalho académico é partilhado apenas para fins de consulta, referência e inspiração. 
                A reprodução parcial ou total deste conteúdo sem a devida citação e autorização é considerada plágio 
                e está sujeita a sanções disciplinares graves pela instituição académica.
              </p>
            </div>
          </div>

          <div className="p-10 border-2 border-dashed rounded-xl bg-zinc-50/50 flex flex-col items-center text-center space-y-4">
            <Briefcase className="h-12 w-12 text-zinc-300" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-zinc-900">Pré-visualização não disponível</p>
              <p className="text-xs text-zinc-500">Descarregue o ficheiro PDF para ler o trabalho completo.</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="border rounded-xl p-6 bg-white shadow-sm space-y-4 sticky top-8">
            <h3 className="font-bold text-zinc-900">Acesso ao Ficheiro</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Descarregue o documento original submetido para o repositório Tipsearch.
            </p>
            {downloadUrl ? (
              <Button asChild className="w-full bg-zinc-900 text-white hover:bg-zinc-800 py-6">
                <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
                  <Download className="mr-2 h-4 w-4" />
                  Download (PDF)
                </a>
              </Button>
            ) : (
              <p className="text-sm text-red-500">Ficheiro indisponível no momento.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
