import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { getDownloadUrl } from "../actions"
import { ArrowLeft, Download, FileText, Calendar, GraduationCap, User } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function ProvaDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  
  const { data: prova } = await supabase
    .from('provas')
    .select('*, users(nome)')
    .eq('id', params.id)
    .single()

  if (!prova) notFound()

  const downloadUrl = await getDownloadUrl(prova.url_pdf)

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/provas">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex items-center gap-2 text-zinc-500 text-sm">
          <Link href="/provas" className="hover:text-zinc-900">Provas</Link>
          <span>/</span>
          <span className="text-zinc-900 font-medium">{prova.disciplina}</span>
        </div>
      </header>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-zinc-900 text-[10px] font-bold uppercase tracking-wider text-white">
                {prova.tipo}
              </span>
              <span className="px-2 py-0.5 rounded bg-zinc-100 text-[10px] font-bold uppercase tracking-wider text-zinc-600">
                {prova.semestre}º Semestre
              </span>
            </div>
            <h1 className="text-3xl font-bold text-zinc-900 leading-tight">
              {prova.disciplina}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-zinc-500">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                Ano Letivo: {prova.ano_letivo}
              </div>
              <div className="flex items-center gap-1.5">
                <GraduationCap className="h-4 w-4" />
                Repositório Académico
              </div>
              <div className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                Enviado por: {prova.users?.nome || 'Estudante'}
              </div>
            </div>
          </div>

          <div className="aspect-[3/4] w-full border rounded-xl bg-zinc-50 flex flex-col items-center justify-center space-y-4 text-zinc-400">
            <FileText className="h-16 w-16 opacity-20" />
            <p className="text-sm">A pré-visualização do PDF está desativada.</p>
            <Button asChild variant="outline">
              <a href={downloadUrl} target="_blank" rel="noopener noreferrer">Ver PDF Completo</a>
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="border rounded-xl p-6 bg-white shadow-sm space-y-4 sticky top-8">
            <h3 className="font-bold text-zinc-900">Download do Ficheiro</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Descarregue o PDF desta prova para estudar e preparar-se para as suas avaliações.
            </p>
            {downloadUrl ? (
              <Button asChild className="w-full bg-zinc-900 text-white hover:bg-zinc-800 py-6">
                <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
                  <Download className="mr-2 h-4 w-4" />
                  Descarregar PDF
                </a>
              </Button>
            ) : (
              <p className="text-sm text-red-500">Erro ao obter ficheiro.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
