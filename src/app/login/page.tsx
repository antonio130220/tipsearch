import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { login } from '../auth/actions'

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F7F7F7] px-4">
      <div className="w-full max-w-md space-y-8 rounded-xl border bg-white p-8 shadow-sm">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Entrar no tipsearch</h1>
          <p className="text-sm text-zinc-500">Introduza as suas credenciais para aceder à plataforma</p>
        </div>
        
        {searchParams.error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-100">
            {searchParams.error}
          </div>
        )}

        <form action={login} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="nome@exemplo.com" required className="border-zinc-200" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Palavra-passe</Label>
            <Input id="password" name="password" type="password" required className="border-zinc-200" />
          </div>

          <Button type="submit" className="w-full bg-zinc-900 text-white hover:bg-zinc-800 py-6">
            Entrar
          </Button>
        </form>

        <div className="text-center text-sm">
          <span className="text-zinc-500">Ainda não tem conta? </span>
          <Link href="/register" className="font-medium text-zinc-900 hover:underline underline-offset-4">
            Registar
          </Link>
        </div>
      </div>
    </div>
  )
}
