'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function uploadTrabalho(formData: FormData) {
  const supabase = createClient()
  
  const file = formData.get('file') as File
  const titulo = formData.get('titulo') as string
  const tipo = formData.get('tipo') as string
  const curso = formData.get('curso') as string
  const disciplina = formData.get('disciplina') as string
  const ano_letivo = formData.get('ano_letivo') as string
  const resumo = formData.get('resumo') as string

  if (!file || file.size === 0) {
    throw new Error('Ficheiro é obrigatório')
  }

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) throw new Error('Não autenticado')

  // 1. Upload para o Storage (bucket 'trabalhos')
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random()}.${fileExt}`
  const filePath = `${userData.user.id}/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('trabalhos')
    .upload(filePath, file)

  if (uploadError) {
    console.error('Upload error:', uploadError)
    throw new Error('Erro ao fazer upload do ficheiro')
  }

  // 2. Registar na base de dados
  const { error: dbError } = await supabase.from('trabalhos').insert({
    titulo,
    tipo,
    curso,
    disciplina,
    ano_letivo,
    resumo,
    ficheiro_url: filePath,
    uploaded_by: userData.user.id,
    aprovado: false
  })

  if (dbError) {
    console.error('DB error:', dbError)
    throw new Error('Erro ao registar o trabalho na base de dados')
  }

  revalidatePath('/trabalhos')
  redirect('/trabalhos?success=true')
}

export async function aprovarTrabalho(id: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from('trabalhos')
    .update({ aprovado: true })
    .eq('id', id)

  if (error) throw new Error('Erro ao aprovar trabalho')
  revalidatePath('/admin')
  revalidatePath('/trabalhos')
}

export async function rejeitarTrabalho(id: string, filePath: string) {
  const supabase = createClient()
  
  await supabase.from('trabalhos').delete().eq('id', id)
  await supabase.storage.from('trabalhos').remove([filePath])
  
  revalidatePath('/admin')
}

export async function getDownloadUrl(filePath: string) {
  const supabase = createClient()
  const { data } = await supabase.storage.from('trabalhos').createSignedUrl(filePath, 3600)
  return data?.signedUrl
}
