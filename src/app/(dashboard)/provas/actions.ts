'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function uploadProva(formData: FormData) {
  const supabase = createClient()
  
  const file = formData.get('file') as File
  const disciplina = formData.get('disciplina') as string
  const tipo = formData.get('tipo') as string
  const semestre = formData.get('semestre') as string
  const ano_letivo = formData.get('ano_letivo') as string

  if (!file || file.size === 0) {
    throw new Error('Ficheiro é obrigatório')
  }

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) throw new Error('Não autenticado')

  // 1. Upload para o Storage
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random()}.${fileExt}`
  const filePath = `${userData.user.id}/${fileName}`

  const { error: uploadError, data: uploadData } = await supabase.storage
    .from('provas')
    .upload(filePath, file)

  if (uploadError) {
    console.error('Upload error:', uploadError)
    throw new Error('Erro ao fazer upload do ficheiro')
  }

  // 2. Registar na base de dados
  const { error: dbError } = await supabase.from('provas').insert({
    disciplina,
    tipo,
    semestre: parseInt(semestre),
    ano_letivo,
    url_pdf: filePath,
    user_id: userData.user.id,
    aprovado: false
  })

  if (dbError) {
    console.error('DB error:', dbError)
    // Opcional: apagar o ficheiro se der erro na DB
    throw new Error('Erro ao registar a prova na base de dados')
  }

  revalidatePath('/provas')
  redirect('/provas?success=true')
}

export async function aprovarProva(id: string) {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('provas')
    .update({ aprovado: true })
    .eq('id', id)

  if (error) throw new Error('Erro ao aprovar prova')
  
  revalidatePath('/admin')
  revalidatePath('/provas')
}

export async function rejeitarProva(id: string, filePath: string) {
  const supabase = createClient()
  
  // 1. Apagar da base de dados
  const { error: dbError } = await supabase
    .from('provas')
    .delete()
    .eq('id', id)

  if (dbError) throw new Error('Erro ao apagar registo')

  // 2. Apagar ficheiro do storage
  const { error: storageError } = await supabase.storage
    .from('provas')
    .remove([filePath])

  if (storageError) console.error('Erro ao apagar ficheiro:', storageError)
  
  revalidatePath('/admin')
}

export async function getDownloadUrl(filePath: string) {
  const supabase = createClient()
  const { data } = await supabase.storage.from('provas').createSignedUrl(filePath, 3600)
  return data?.signedUrl
}

export async function checkDuplicateProva(disciplina: string, tipo: string, semestre: number, ano_letivo: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('provas')
    .select('id, disciplina, tipo, ano_letivo')
    .eq('disciplina', disciplina)
    .eq('tipo', tipo)
    .eq('semestre', semestre)
    .eq('ano_letivo', ano_letivo)
    .limit(1)

  if (error) {
    console.error('Error checking duplicate prova:', error)
    return null
  }

  return data.length > 0 ? data[0] : null
}
