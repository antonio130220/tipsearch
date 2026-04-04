'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { uploadTrabalho } from "../actions"
import { ArrowLeft, Upload, FileType, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function UploadTrabalhoPage() {
  const [loading, setLoading] = useState(false)

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <header className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/trabalhos">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Upload de Trabalho Académico</h1>
          <p className="text-sm text-zinc-500">Partilhe o seu TFC ou trabalho curricular com a comunidade.</p>
        </div>
      </header>

      {/* Aviso de Plágio */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 flex gap-4 items-start">
        <div className="bg-amber-100 p-2 rounded-lg">
          <AlertTriangle className="h-5 w-5 text-amber-700" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-amber-800 uppercase tracking-wide">Aviso Importante</h3>
          <p className="text-sm text-amber-700 leading-relaxed font-medium">
            Este material é disponibilizado apenas para consulta e inspiração. A cópia constitui plágio académico.
          </p>
        </div>
      </div>

      <form action={uploadTrabalho} onSubmit={() => setLoading(true)} className="space-y-6 bg-white p-8 border rounded-xl shadow-sm">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="titulo">Título do Trabalho</Label>
            <Input id="titulo" name="titulo" placeholder="Ex: Sistema de Gestão de Bibliotecas em Java" required />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Trabalho</Label>
              <select 
                id="tipo" 
                name="tipo" 
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                required
              >
                <option value="curricular">Trabalho Curricular</option>
                <option value="TFC">Trabalho de Fim de Curso (TFC)</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="curso">Curso</Label>
              <Input id="curso" name="curso" placeholder="Ex: Engenharia Informática" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="disciplina">Disciplina</Label>
              <Input id="disciplina" name="disciplina" placeholder="Ex: Programação III" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ano_letivo">Ano Letivo</Label>
              <Input id="ano_letivo" name="ano_letivo" placeholder="Ex: 2023/2024" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="resumo">Resumo (opcional)</Label>
            <textarea 
              id="resumo" 
              name="resumo" 
              rows={4}
              placeholder="Descreva brevemente o objetivo do trabalho..."
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
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

        <Button 
          type="submit" 
          className="w-full bg-zinc-900 text-white hover:bg-zinc-800" 
          disabled={loading}
        >
          {loading ? "A enviar..." : "Enviar Trabalho"}
        </Button>
      </form>
    </div>
  )
}
