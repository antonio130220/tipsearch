import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signup } from '../auth/actions'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F7F7F7] px-4">
      <div className="w-full max-w-md space-y-8 rounded-xl border bg-white p-8 shadow-sm">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Crie a sua conta</h1>
          <p className="text-sm text-zinc-500">Introduza os seus dados para se registar no tipsearch</p>
        </div>
        
        <form action={signup} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome Completo</Label>
            <Input id="nome" name="nome" placeholder="Seu nome" required className="border-zinc-200" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="nome@exemplo.com" required className="border-zinc-200" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Palavra-passe</Label>
            <Input id="password" name="password" type="password" required className="border-zinc-200" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="papel">Eu sou...</Label>
              <Select name="papel" required>
                <SelectTrigger className="border-zinc-200">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aluno">Aluno</SelectItem>
                  <SelectItem value="professor">Professor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="curso">Curso</Label>
              <Input id="curso" name="curso" placeholder="Eng. Informática" required className="border-zinc-200" />
            </div>
          </div>

          <Button type="submit" className="w-full bg-zinc-900 text-white hover:bg-zinc-800 py-6">
            Registar conta
          </Button>
        </form>

        <div className="text-center text-sm">
          <span className="text-zinc-500">Já tem uma conta? </span>
          <Link href="/login" className="font-medium text-zinc-900 hover:underline underline-offset-4">
            Entrar
          </Link>
        </div>
      </div>
    </div>
  )
}
