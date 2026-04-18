'use client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { uploadProva, checkDuplicateProva } from "../actions"
import { ArrowLeft, Upload, AlertCircle, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useState, useRef } from "react"

export default function UploadProvaPage() {
  const [loading, setLoading] = useState(false)
  const [duplicate, setDuplicate] = useState<{id: string, disciplina: string, tipo: string, ano_letivo: string} | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const handlePreSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const disciplina = formData.get('disciplina') as string
    const tipo = formData.get('tipo') as string
    const semestre = parseInt(formData.get('semestre') as string)
    const ano_letivo = formData.get('ano_letivo') as string

    // Verificar duplicados exatos
    const existing = await checkDuplicateProva(disciplina, tipo, semestre, ano_letivo)

    if (existing && !duplicate) {
      setDuplicate(existing)
      setLoading(false)
      return
    }

    // Se não houver duplicado ou o utilizador decidiu continuar
    if (formRef.current) {
      const actionData = new FormData(formRef.current)
      await uploadProva(actionData)
    }
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

      {duplicate && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex gap-4">
          <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
          <div className="space-y-3">
            <div>
              <p className="text-sm font-semibold text-amber-900">
                Já existe uma prova com estes dados:
              </p>
              <p className="text-sm text-amber-800">
                {duplicate.disciplina} ({duplicate.tipo}) - {duplicate.ano_letivo}
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm" asChild className="bg-white border-amber-200 text-amber-900 hover:bg-amber-100">
                <Link href={`/provas/${duplicate.id}`} target="_blank" className="flex items-center gap-2">
                  <ExternalLink className="h-3.5 w-3.5" />
                  Ver existente
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setDuplicate(null)} className="text-amber-700 hover:bg-amber-100">
                Cancelar
              </Button>
              <Button 
                variant="default" 
                size="sm" 
                className="bg-amber-600 hover:bg-amber-700 text-white"
                onClick={() => {
                  if (formRef.current) {
                    setLoading(true)
                    const actionData = new FormData(formRef.current)
                    uploadProva(actionData)
                  }
                }}
              >
                Continuar mesmo assim
              </Button>
            </div>
          </div>
        </div>
      )}

      <form ref={formRef} onSubmit={handlePreSubmit} className="space-y-6 bg-white p-8 border rounded-xl shadow-sm">
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
