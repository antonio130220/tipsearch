'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { generateEmbedding } from '@/lib/gemini'

export async function uploadArtigo(formData: FormData) {
  const supabase = createClient()
  
  const file = formData.get('file') as File
  const titulo = formData.get('titulo') as string
  const abstract = formData.get('abstract') as string
  const autores = formData.get('autores') as string
  const area = formData.get('area') as string
  const palavras_chave = formData.get('palavras_chave') as string
  const ano = formData.get('ano') as string

  if (!file || file.size === 0) {
    throw new Error('Ficheiro é obrigatório')
  }

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) throw new Error('Não autenticado')

  // 1. Upload para o Storage (bucket 'artigos')
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random()}.${fileExt}`
  const filePath = `${userData.user.id}/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('artigos')
    .upload(filePath, file)

  if (uploadError) {
    console.error('Upload error:', uploadError)
    throw new Error('Erro ao fazer upload do ficheiro')
  }

  // 2. Registar na base de dados
  const { error: dbError } = await supabase.from('artigos').insert({
    titulo,
    abstract,
    autores,
    area,
    palavras_chave,
    ano: parseInt(ano),
    ficheiro_url: filePath,
    uploaded_by: userData.user.id,
    aprovado: false
  })

  if (dbError) {
    console.error('DB error:', dbError)
    throw new Error('Erro ao registar o artigo na base de dados')
  }

  revalidatePath('/artigos')
  redirect('/artigos?success=true')
}

export async function aprovarArtigo(id: string) {
  const supabase = createClient()
  
  // 1. Obter título e abstract para gerar o embedding
  const { data: artigo, error: fetchError } = await supabase
    .from('artigos')
    .select('titulo, abstract')
    .eq('id', id)
    .single()

  if (fetchError || !artigo) throw new Error('Erro ao encontrar artigo para aprovar')

  // 2. Gerar embedding
  let embedding = null;
  try {
    embedding = await generateEmbedding(`${artigo.titulo} ${artigo.abstract}`)
  } catch (err) {
    console.error('Falha ao gerar embedding:', err)
  }

  // 3. Atualizar registo
  const { error } = await supabase
    .from('artigos')
    .update({ 
      aprovado: true,
      embedding: embedding
    })
    .eq('id', id)

  if (error) throw new Error('Erro ao aprovar artigo')
  revalidatePath('/admin')
  revalidatePath('/artigos')
}

export async function rejeitarArtigo(id: string, filePath: string) {
  const supabase = createClient()
  
  await supabase.from('artigos').delete().eq('id', id)
  await supabase.storage.from('artigos').remove([filePath])
  
  revalidatePath('/admin')
}

export async function getDownloadUrl(filePath: string) {
  const supabase = createClient()
  const { data } = await supabase.storage.from('artigos').createSignedUrl(filePath, 3600)
  return data?.signedUrl
}

export async function checkDuplicateArtigo(titulo: string) {
  const supabase = createClient()
  // Comparação case-insensitive e ignora espaços extra
  const cleanTitulo = titulo.trim().toLowerCase()
  
  const { data, error } = await supabase
    .from('artigos')
    .select('id, titulo')
    .ilike('titulo', cleanTitulo)
    .limit(1)

  if (error) {
    console.error('Error checking duplicate artigo:', error)
    return null
  }

  return data.length > 0 ? data[0] : null
}
