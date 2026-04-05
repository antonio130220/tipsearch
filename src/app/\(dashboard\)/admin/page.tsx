import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Check, X, FileText, BookOpen, Briefcase, Users } from "lucide-react"
import { aprovarProva, rejeitarProva } from "../provas/actions"
import { aprovarArtigo, rejeitarArtigo } from "../artigos/actions"
import { aprovarTrabalho, rejeitarTrabalho } from "../trabalhos/actions"
import { aprovarUser, rejeitarUser } from "../../auth/actions"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function AdminPage() {
  const supabase = createClient()
  
  // Buscar utilizadores pendentes
  const { data: pendentesUsers } = await supabase
    .from('users')
    .select('*')
    .eq('aprovado', false)
    .order('created_at', { ascending: true })

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

  // Buscar trabalhos pendentes
  const { data: pendentesTrabalhos } = await supabase
    .from('trabalhos')
    .select('*, users:uploaded_by(nome, email)')
    .eq('aprovado', false)
    .order('criado_em', { ascending: true })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900">Painel de Administração</h1>
        <p className="text-zinc-500">Faça a curadoria do conteúdo e utilizadores submetidos.</p>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full max-w-2xl grid-cols-4 mb-8">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Users ({pendentesUsers?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="provas" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Provas ({pendentesProvas?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="artigos" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Artigos ({pendentesArtigos?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="trabalhos" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Trabalhos ({pendentesTrabalhos?.length || 0})
          </TabsTrigger>
        </TabsList>

        {/* Tab Utilizadores */}
        <TabsContent value="users" className="space-y-4">
          <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 border-b">
                <tr>
                  <th className="px-6 py-4 font-semibold text-zinc-900">Utilizador</th>
                  <th className="px-6 py-4 font-semibold text-zinc-900">Dados</th>
                  <th className="px-6 py-4 font-semibold text-zinc-900 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {pendentesUsers && pendentesUsers.length > 0 ? (
                  pendentesUsers.map((user: any) => (
                    <tr key={user.id} className="hover:bg-zinc-50/50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-zinc-900">{user.nome}</div>
                        <div className="text-xs text-zinc-500">{user.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-zinc-900 capitalize">{user.papel}</div>
                        <div className="text-xs text-zinc-500">{user.curso}</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <form action={async () => { 'use server'; await aprovarUser(user.id) }}>
                            <Button size="sm" variant="outline" className="h-8 bg-green-50 text-green-700 border-green-200">
                              <Check className="h-4 w-4 mr-1" /> Aprovar
                            </Button>
                          </form>
                          <form action={async () => { 'use server'; await rejeitarUser(user.id) }}>
                            <Button size="sm" variant="outline" className="h-8 bg-red-50 text-red-700 border-red-200">
                              <X className="h-4 w-4 mr-1" /> Rejeitar
                            </Button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={3} className="px-6 py-12 text-center text-zinc-500">Nenhum utilizador pendente.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* Tab Provas */}
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
                      <td className="px-6 py-4 text-right">
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

        {/* Tab Artigos */}
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
                      <td className="px-6 py-4 text-right">
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

        {/* Tab Trabalhos */}
        <TabsContent value="trabalhos" className="space-y-4">
          <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 border-b">
                <tr>
                  <th className="px-6 py-4 font-semibold text-zinc-900">Trabalho</th>
                  <th className="px-6 py-4 font-semibold text-zinc-900">Enviado por</th>
                  <th className="px-6 py-4 font-semibold text-zinc-900 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {pendentesTrabalhos && pendentesTrabalhos.length > 0 ? (
                  pendentesTrabalhos.map((trabalho: any) => (
                    <tr key={trabalho.id} className="hover:bg-zinc-50/50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-zinc-900 line-clamp-1">{trabalho.titulo}</div>
                        <div className="text-xs text-zinc-500">{trabalho.tipo} • {trabalho.disciplina}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-zinc-900">{trabalho.users?.nome}</div>
                        <div className="text-xs text-zinc-500">{trabalho.users?.email}</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <form action={async () => { 'use server'; await aprovarTrabalho(trabalho.id) }}>
                            <Button size="sm" variant="outline" className="h-8 bg-green-50 text-green-700 border-green-200">
                              <Check className="h-4 w-4" />
                            </Button>
                          </form>
                          <form action={async () => { 'use server'; await rejeitarTrabalho(trabalho.id, trabalho.ficheiro_url) }}>
                            <Button size="sm" variant="outline" className="h-8 bg-red-50 text-red-700 border-red-200">
                              <X className="h-4 w-4" />
                            </Button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={3} className="px-6 py-12 text-center text-zinc-500">Nenhum trabalho pendente.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
