'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { uploadArtigo, checkDuplicateArtigo } from "../actions"
import { ArrowLeft, FileType, AlertCircle, ExternalLink, Search } from "lucide-react"
import Link from "next/link"
import { useState, useRef } from "react"

interface ArtigoMatch {
  id: string;
  titulo: string;
  similarity: number;
}

export default function UploadArtigoPage() {
  const [loading, setLoading] = useState(false)
  const [checkingSimilarity, setCheckingSimilarity] = useState(false)
  const [exactDuplicate, setExactDuplicate] = useState<{id: string, titulo: string} | null>(null)
  const [similarArtigos, setSimilarArtigos] = useState<ArtigoMatch[]>([])
  const [formData, setFormData] = useState({ titulo: '', abstract: '' })
  const formRef = useRef<HTMLFormElement>(null)

  const checkSimilarity = async (titulo: string, abstract: string) => {
    if (!titulo || !abstract || titulo.length < 5 || abstract.length < 10) return

    setCheckingSimilarity(true)
    try {
      const res = await fetch('/api/check-similarity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo, abstract })
      })
      const data = await res.json()
      if (data.matches) {
        setSimilarArtigos(data.matches)
      }
    } catch (err) {
      console.error('Erro ao verificar similaridade:', err)
    } finally {
      setCheckingSimilarity(false)
    }
  }

  const handleBlur = () => {
    checkSimilarity(formData.titulo, formData.abstract)
  }

  const handlePreSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const existing = await checkDuplicateArtigo(formData.titulo)
    if (existing && !exactDuplicate) {
      setExactDuplicate(existing)
      setLoading(false)
      return
    }

    if (formRef.current) {
      const data = new FormData(formRef.current)
      await uploadArtigo(data)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <header className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/artigos">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Submeter Artigo Científico</h1>
          <p className="text-sm text-zinc-500">Preencha os dados e envie o ficheiro (PDF ou DOCX).</p>
        </div>
      </header>

      {exactDuplicate && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex gap-4">
          <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
          <div className="space-y-3">
            <div>
              <p className="text-sm font-semibold text-amber-900">
                Já existe um artigo com este título:
              </p>
              <p className="text-sm text-amber-800 italic">&quot;{exactDuplicate.titulo}&quot;</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm" asChild className="bg-white border-amber-200 text-amber-900 hover:bg-amber-100">
                <Link href={`/artigos/${exactDuplicate.id}`} target="_blank" className="flex items-center gap-2">
                  <ExternalLink className="h-3.5 w-3.5" />
                  Ver existente
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setExactDuplicate(null)} className="text-amber-700 hover:bg-amber-100">
                Cancelar
              </Button>
              <Button 
                variant="default" 
                size="sm" 
                className="bg-amber-600 hover:bg-amber-700 text-white"
                onClick={() => {
                  if (formRef.current) {
                    setLoading(true)
                    const data = new FormData(formRef.current)
                    uploadArtigo(data)
                  }
                }}
              >
                Continuar mesmo assim
              </Button>
            </div>
          </div>
        </div>
      )}

      {similarArtigos.length > 0 && !exactDuplicate && (
        <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-xl space-y-3">
          <div className="flex items-center gap-2 text-zinc-900 font-semibold text-sm">
            <Search className="h-4 w-4" />
            Encontrámos artigos similares ao teu:
          </div>
          <div className="grid gap-2">
            {similarArtigos.map((art) => (
              <div key={art.id} className="flex items-center justify-between bg-white p-3 border rounded-lg text-sm">
                <div className="truncate max-w-[70%]">
                  <span className="font-medium text-zinc-900">{art.titulo}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium px-2 py-0.5 bg-zinc-100 text-zinc-600 rounded-full">
                    {Math.round(art.similarity * 100)}% similar
                  </span>
                  <Link href={`/artigos/${art.id}`} target="_blank" className="text-zinc-400 hover:text-zinc-600">
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-zinc-500">
            Dica: Verifica se o teu conteúdo já não está disponível na plataforma.
          </p>
        </div>
      )}

      <form ref={formRef} onSubmit={handlePreSubmit} className="space-y-6 bg-white p-8 border rounded-xl shadow-sm">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="titulo">Título do Artigo</Label>
            <Input 
              id="titulo" 
              name="titulo" 
              placeholder="Ex: Impacto da IA na Engenharia de Software" 
              required 
              value={formData.titulo}
              onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
              onBlur={handleBlur}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <Label htmlFor="abstract">Abstract (Resumo)</Label>
              {checkingSimilarity && <span className="text-[10px] text-zinc-400 animate-pulse">A verificar similaridade...</span>}
            </div>
            <textarea 
              id="abstract" 
              name="abstract" 
              rows={4}
              placeholder="Descreva brevemente o conteúdo do artigo..."
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              required
              value={formData.abstract}
              onChange={(e) => setFormData(prev => ({ ...prev, abstract: e.target.value }))}
              onBlur={handleBlur}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="autores">Autores (separados por vírgula)</Label>
              <Input id="autores" name="autores" placeholder="João Silva, Maria Santos" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="area">Área de Estudo</Label>
              <select 
                id="area" 
                name="area" 
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                required
              >
                <option value="Engenharia">Engenharia</option>
                <option value="Medicina">Medicina</option>
                <option value="Direito">Direito</option>
                <option value="Economia">Economia</option>
                <option value="Ciências Sociais">Ciências Sociais</option>
                <option value="Outro">Outro</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="palavras_chave">Palavras-chave</Label>
              <Input id="palavras_chave" name="palavras_chave" placeholder="IA, Software, Cloud" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ano">Ano de Publicação</Label>
              <Input id="ano" name="ano" type="number" placeholder="2024" required />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="file">Ficheiro (PDF ou DOCX)</Label>
          <div className="border-2 border-dashed border-zinc-200 rounded-lg p-8 text-center hover:border-zinc-300 transition-colors">
            <input 
              type="file" 
              id="file" 
              name="file" 
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
              className="hidden" 
              required 
              onChange={(e) => {
                const fileName = e.target.files?.[0]?.name;
                if (fileName) {
                  const label = document.getElementById('file-label');
                  if (label) label.textContent = fileName;
                }
              }}
            />
            <label htmlFor="file" className="cursor-pointer space-y-2 block">
              <div className="flex justify-center">
                <div className="p-3 bg-zinc-50 rounded-full">
                  <FileType className="h-6 w-6 text-zinc-400" />
                </div>
              </div>
              <div id="file-label" className="text-sm text-zinc-600 font-medium">
                Clique para selecionar ou arraste o ficheiro
              </div>
              <p className="text-xs text-zinc-400">PDF ou DOCX até 10MB</p>
            </label>
          </div>
        </div>

        <div className="bg-zinc-50 p-4 rounded-lg flex items-start gap-3">
          <div className="h-5 w-5 mt-0.5 text-zinc-400">ℹ️</div>
          <p className="text-xs text-zinc-600">
            Artigo submetido, aguarda aprovação. Após o envio, os administradores irão validar o conteúdo antes de ser publicado.
          </p>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-zinc-900 text-white hover:bg-zinc-800" 
          disabled={loading}
        >
          {loading ? "A enviar..." : "Submeter Artigo"}
        </Button>
      </form>
    </div>
  )
}
