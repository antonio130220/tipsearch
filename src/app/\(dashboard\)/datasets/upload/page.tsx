'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { uploadDataset } from "../actions"
import { ArrowLeft, Upload, FileSpreadsheet } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function UploadDatasetPage() {
  const [loading, setLoading] = useState(false)

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <header className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/datasets">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Upload de Dataset</h1>
          <p className="text-sm text-zinc-500">Adicione novos conjuntos de dados oficiais à plataforma.</p>
        </div>
      </header>

      <form action={uploadDataset} onSubmit={() => setLoading(true)} className="space-y-6 bg-white p-8 border rounded-xl shadow-sm">
        <div className="space-y-2">
          <Label htmlFor="nome">Nome do Dataset</Label>
          <Input id="nome" name="nome" placeholder="Ex: Estatísticas de Saúde Luanda 2023" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="descricao">Descrição</Label>
          <Textarea 
            id="descricao" 
            name="descricao" 
            placeholder="Descreva brevemente o conteúdo e a estrutura dos dados..." 
            className="min-h-[100px]"
            required 
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="categoria">Categoria</Label>
            <select 
              id="categoria" 
              name="categoria" 
              required
              className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-900"
            >
              <option value="Saúde">Saúde</option>
              <option value="Educação">Educação</option>
              <option value="Economia">Economia</option>
              <option value="Infraestrutura">Infraestrutura</option>
              <option value="População">População</option>
              <option value="Ambiente">Ambiente</option>
              <option value="Outro">Outro</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="regiao">Região</Label>
            <select 
              id="regiao" 
              name="regiao" 
              required
              className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-900"
            >
              <option value="Nacional">Nacional</option>
              <option value="Luanda">Luanda</option>
              <option value="Benguela">Benguela</option>
              <option value="Huambo">Huambo</option>
              <option value="Huíla">Huíla</option>
              <option value="Cabinda">Cabinda</option>
              <option value="Malanje">Malanje</option>
              <option value="Outras Províncias">Outras Províncias</option>
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="fonte_oficial">Fonte Oficial</Label>
            <Input id="fonte_oficial" name="fonte_oficial" placeholder="Ex: INE, MINSA" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ano">Ano dos Dados</Label>
            <Input id="ano" name="ano" type="number" placeholder="2023" required />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="file">Ficheiro (CSV ou Excel)</Label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-zinc-200 border-dashed rounded-md hover:border-zinc-400 transition-colors">
            <div className="space-y-1 text-center">
              <FileSpreadsheet className="mx-auto h-10 w-10 text-zinc-400" />
              <div className="flex text-sm text-zinc-600">
                <label htmlFor="file" className="relative cursor-pointer bg-white rounded-md font-medium text-zinc-900 hover:text-zinc-700">
                  <span>Selecionar ficheiro</span>
                  <input id="file" name="file" type="file" className="sr-only" accept=".csv,.xlsx,.xls" required />
                </label>
              </div>
              <p className="text-xs text-zinc-500">CSV, XLSX até 20MB</p>
            </div>
          </div>
        </div>

        <Button type="submit" disabled={loading} className="w-full bg-zinc-900 text-white hover:bg-zinc-800 py-6">
          {loading ? "A processar..." : "Publicar Dataset"}
        </Button>
      </form>
    </div>
  )
}
