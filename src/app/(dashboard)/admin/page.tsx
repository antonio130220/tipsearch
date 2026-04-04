import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Check, X, FileText, BookOpen, Clock } from "lucide-react"
import { aprovarProva, rejeitarProva } from "../provas/actions"
import { aprovarArtigo, rejeitarArtigo } from "../artigos/actions"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function AdminPage() {
  const supabase = createClient()
  
  // Buscar provas pendentes
  const { data: pendentesProvas } = await supabase
    .from('provas')
    .select('*, users(nome, email)')
    .eq('aprovado', false)
    .order('created_at', { ascending: true })

  // Buscar artigos pendentes
  const { data: pendentesArtigos } = await supabase
    .from('artigos')
    .select('*, users:uploaded_by(nome, email)')
    .eq('aprovado', false)
    .order('criado_em', { ascending: true })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900">Painel de Administração</h1>
        <p className="text-zinc-500">Faça a curadoria do conteúdo submetido para a plataforma.</p>
      </div>

      <Tabs defaultValue="provas" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
          <TabsTrigger value="provas" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Provas ({pendentesProvas?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="artigos" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Artigos ({pendentesArtigos?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="provas" className="space-y-4">
          <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 border-b">
                <tr>
                  <th className="px-6 py-4 font-semibold text-zinc-900">Prova</th>
                  <th className="px-6 py-4 font-semibold text-zinc-900">Enviado por</th>
                  <th className="px-6 py-4 font-semibold text-zinc-900 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {pendentesProvas && pendentesProvas.length > 0 ? (
                  pendentesProvas.map((prova: any) => (
                    <tr key={prova.id} className="hover:bg-zinc-50/50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-zinc-900">{prova.disciplina}</div>
                        <div className="text-xs text-zinc-500">{prova.tipo} • {prova.ano_letivo}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-zinc-900">{prova.users?.nome}</div>
                        <div className="text-xs text-zinc-500">{prova.users?.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <form action={async () => { 'use server'; await aprovarProva(prova.id) }}>
                            <Button size="sm" variant="outline" className="h-8 bg-green-50 text-green-700 border-green-200">
                              <Check className="h-4 w-4" />
                            </Button>
                          </form>
                          <form action={async () => { 'use server'; await rejeitarProva(prova.id, prova.url_pdf) }}>
                            <Button size="sm" variant="outline" className="h-8 bg-red-50 text-red-700 border-red-200">
                              <X className="h-4 w-4" />
                            </Button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={3} className="px-6 py-12 text-center text-zinc-500">Nenhuma prova pendente.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="artigos" className="space-y-4">
          <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 border-b">
                <tr>
                  <th className="px-6 py-4 font-semibold text-zinc-900">Artigo</th>
                  <th className="px-6 py-4 font-semibold text-zinc-900">Enviado por</th>
                  <th className="px-6 py-4 font-semibold text-zinc-900 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {pendentesArtigos && pendentesArtigos.length > 0 ? (
                  pendentesArtigos.map((artigo: any) => (
                    <tr key={artigo.id} className="hover:bg-zinc-50/50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-zinc-900 line-clamp-1">{artigo.titulo}</div>
                        <div className="text-xs text-zinc-500">{artigo.area} • {artigo.ano}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-zinc-900">{artigo.users?.nome}</div>
                        <div className="text-xs text-zinc-500">{artigo.users?.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <form action={async () => { 'use server'; await aprovarArtigo(artigo.id) }}>
                            <Button size="sm" variant="outline" className="h-8 bg-green-50 text-green-700 border-green-200">
                              <Check className="h-4 w-4" />
                            </Button>
                          </form>
                          <form action={async () => { 'use server'; await rejeitarArtigo(artigo.id, artigo.ficheiro_url) }}>
                            <Button size="sm" variant="outline" className="h-8 bg-red-50 text-red-700 border-red-200">
                              <X className="h-4 w-4" />
                            </Button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={3} className="px-6 py-12 text-center text-zinc-500">Nenhum artigo pendente.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
