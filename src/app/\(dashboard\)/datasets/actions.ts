'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function uploadDataset(formData: FormData) {
  const supabase = createClient()
  
  const file = formData.get('file') as File
  const nome = formData.get('nome') as string
  const descricao = formData.get('descricao') as string
  const categoria = formData.get('categoria') as string
  const regiao = formData.get('regiao') as string
  const fonte_oficial = formData.get('fonte_oficial') as string
  const ano = formData.get('ano') as string

  if (!file || file.size === 0) throw new Error('Ficheiro é obrigatório')

  // Verificar se é admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autenticado')

  const { data: userData } = await supabase.from('users').select('papel').eq('id', user.id).single()
  if (userData?.papel !== 'admin') throw new Error('Apenas administradores podem fazer upload de datasets')

  // 1. Upload para o Storage (bucket 'datasets')
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random()}.${fileExt}`
  const filePath = `${user.id}/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('datasets')
    .upload(filePath, file)

  if (uploadError) throw new Error('Erro ao fazer upload do ficheiro')

  // Calcular tamanho legível
  const sizeInMB = (file.size / (1024 * 1024)).toFixed(2) + ' MB'

  // 2. Registar na base de dados (Auto-aprovado para admins)
  const { error: dbError } = await supabase.from('datasets').insert({
    nome,
    descricao,
    categoria,
    regiao,
    fonte_oficial,
    ano: parseInt(ano),
    tamanho: sizeInMB,
    ficheiro_url: filePath,
    uploaded_by: user.id,
    aprovado: true
  })

  if (dbError) throw new Error('Erro ao registar dataset')

  revalidatePath('/datasets')
  redirect('/datasets?success=true')
}

export async function getDownloadUrl(filePath: string) {
  const supabase = createClient()
  const { data } = await supabase.storage.from('datasets').createSignedUrl(filePath, 3600)
  return data?.signedUrl
}
