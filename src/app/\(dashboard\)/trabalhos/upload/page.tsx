'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { uploadTrabalho } from "../actions"
import { ArrowLeft, Upload, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function UploadTrabalhoPage() {
  const [loading, setLoading] = useState(false)

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <header className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/trabalhos">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Submeter Trabalho</h1>
          <p className="text-sm text-zinc-500">Partilhe o seu projeto académico com a comunidade.</p>
        </div>
      </header>

      {/* AVISO DE PLÁGIO */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-4 items-start">
        <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-amber-900">Aviso sobre Plágio Académico</h4>
          <p className="text-xs text-amber-800 leading-relaxed">
            Ao submeter este trabalho, declara que é o autor original do conteúdo. 
            O plágio é uma infração grave. Estes trabalhos destinam-se apenas a consulta e auxílio no estudo. 
            A cópia integral ou parcial sem citação é punível pelas normas da instituição.
          </p>
        </div>
      </div>

      <form action={uploadTrabalho} onSubmit={() => setLoading(true)} className="space-y-6 bg-white p-8 border rounded-xl shadow-sm">
        <div className="space-y-2">
          <Label htmlFor="titulo">Título do Trabalho</Label>
          <Input id="titulo" name="titulo" placeholder="Ex: Sistema de Gestão de Bibliotecas" required />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="disciplina">Disciplina</Label>
            <Input id="disciplina" name="disciplina" placeholder="Ex: Programação III" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="curso">Curso</Label>
            <Input id="curso" name="curso" placeholder="Ex: Eng. Informática" required />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo de Trabalho</Label>
            <select 
              id="tipo" 
              name="tipo" 
              required
              className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-900"
            >
              <option value="Projeto">Projeto</option>
              <option value="Monografia">Monografia</option>
              <option value="Relatório">Relatório</option>
              <option value="Outro">Outro</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ano">Ano</Label>
            <Input id="ano" name="ano" type="number" placeholder="2024" required />
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
              <p className="text-xs text-zinc-500">Apenas PDF até 20MB</p>
            </div>
          </div>
        </div>

        <Button type="submit" disabled={loading} className="w-full bg-zinc-900 text-white hover:bg-zinc-800 py-6">
          {loading ? "A enviar..." : "Submeter para Aprovação"}
        </Button>
      </form>
    </div>
  )
}
