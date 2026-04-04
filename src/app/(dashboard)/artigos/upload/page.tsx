'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { uploadArtigo } from "../actions"
import { ArrowLeft, Upload, FileType } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function UploadArtigoPage() {
  const [loading, setLoading] = useState(false)

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

      <form action={uploadArtigo} onSubmit={() => setLoading(true)} className="space-y-6 bg-white p-8 border rounded-xl shadow-sm">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="titulo">Título do Artigo</Label>
            <Input id="titulo" name="titulo" placeholder="Ex: Impacto da IA na Engenharia de Software" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="abstract">Abstract (Resumo)</Label>
            <textarea 
              id="abstract" 
              name="abstract" 
              rows={4}
              placeholder="Descreva brevemente o conteúdo do artigo..."
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              required
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
