'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { uploadProva } from "../actions"
import { ArrowLeft, Upload } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function UploadProvaPage() {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true)
    // Deixamos o form action normal lidar com o redirect, 
    // ou usamos handle manual se quisermos catch errors
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <header className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/provas">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Upload de Prova</h1>
          <p className="text-sm text-zinc-500">Preencha os dados e envie o ficheiro PDF da prova.</p>
        </div>
      </header>

      <form action={uploadProva} onSubmit={handleSubmit} className="space-y-6 bg-white p-8 border rounded-xl shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="disciplina">Disciplina</Label>
            <Input id="disciplina" name="disciplina" placeholder="Ex: Matemática I" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo de Prova</Label>
            <select 
              id="tipo" 
              name="tipo" 
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              required
            >
              <option value="PP1">PP1</option>
              <option value="PP2">PP2</option>
              <option value="Exame">Exame</option>
              <option value="Recurso">Recurso</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="semestre">Semestre</Label>
            <select 
              id="semestre" 
              name="semestre" 
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              required
            >
              <option value="1">1º Semestre</option>
              <option value="2">2º Semestre</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ano_letivo">Ano Letivo</Label>
            <Input id="ano_letivo" name="ano_letivo" placeholder="Ex: 2023/2024" required />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="file">Ficheiro (PDF)</Label>
          <div className="border-2 border-dashed border-zinc-200 rounded-lg p-8 text-center hover:border-zinc-300 transition-colors">
            <input 
              type="file" 
              id="file" 
              name="file" 
              accept="application/pdf" 
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
                  <Upload className="h-6 w-6 text-zinc-400" />
                </div>
              </div>
              <div id="file-label" className="text-sm text-zinc-600 font-medium">
                Clique para selecionar ou arraste o PDF
              </div>
              <p className="text-xs text-zinc-400">PDF até 10MB</p>
            </label>
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-zinc-900 text-white hover:bg-zinc-800" 
          disabled={loading}
        >
          {loading ? "A enviar..." : "Enviar Prova"}
        </Button>
      </form>
    </div>
  )
}
