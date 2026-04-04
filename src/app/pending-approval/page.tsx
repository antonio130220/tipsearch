import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Clock } from 'lucide-react'

export default function PendingApprovalPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F7F7F7] px-4">
      <div className="w-full max-w-md space-y-8 rounded-xl border bg-white p-12 text-center shadow-sm">
        <div className="flex justify-center">
          <div className="rounded-full bg-zinc-100 p-4">
            <Clock className="h-12 w-12 text-zinc-600" />
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Conta Pendente</h1>
          <p className="text-zinc-500">
            Obrigado por se registar! A sua conta foi criada com sucesso, mas está aguardar a aprovação de um administrador.
          </p>
          <p className="text-sm text-zinc-400">
            Receberá um email assim que a sua conta for aprovada.
          </p>
        </div>

        <div className="pt-6">
          <Button asChild className="w-full bg-zinc-900 text-white hover:bg-zinc-800">
            <Link href="/login">Voltar ao Login</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
