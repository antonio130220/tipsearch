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
          <p className="text-sm text-zinc-500">Ajude outros estudantes enviando provas anteriores.</p>
        </div>
      </header>

      <form action={uploadProva} onSubmit={() => setLoading(true)} className="space-y-6 bg-white p-8 border rounded-xl shadow-sm">
        <div className="space-y-2">
          <Label htmlFor="disciplina">Disciplina</Label>
          <Input id="disciplina" name="disciplina" placeholder="Ex: Matemática Discreta" required />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo</Label>
            <select 
              id="tipo" 
              name="tipo" 
              required
              className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-900"
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
              required
              className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-900"
            >
              <option value="1">1º Semestre</option>
              <option value="2">2º Semestre</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ano_letivo">Ano Letivo</Label>
            <Input id="ano_letivo" name="ano_letivo" placeholder="Ex: 2023/24" required />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="file">Ficheiro (PDF)</Label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-zinc-200 border-dashed rounded-md hover:border-zinc-400 transition-colors">
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-10 w-10 text-zinc-400" />
              <div className="flex text-sm text-zinc-600">
                <label htmlFor="file" className="relative cursor-pointer bg-white rounded-md font-medium text-zinc-900 hover:text-zinc-700">
                  <span>Selecionar ficheiro</span>
                  <input id="file" name="file" type="file" className="sr-only" accept=".pdf" required />
                </label>
              </div>
              <p className="text-xs text-zinc-500">Apenas PDF até 10MB</p>
            </div>
          </div>
        </div>

        <Button type="submit" disabled={loading} className="w-full bg-zinc-900 text-white hover:bg-zinc-800 py-6">
          {loading ? "A enviar..." : "Enviar para Aprovação"}
        </Button>
      </form>
    </div>
  )
}
