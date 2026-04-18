import { createClient } from '@/lib/supabase/server'
import { generateEmbedding } from '@/lib/gemini'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { titulo, abstract } = await request.json()

    if (!titulo || !abstract) {
      return NextResponse.json({ error: 'Título e abstract são obrigatórios' }, { status: 400 })
    }

    const supabase = createClient()
    const textToEmbed = `${titulo} ${abstract}`
    const embedding = await generateEmbedding(textToEmbed)

    // A coluna embedding na tabela artigos deve ser vector(768)
    // pgvector operator <=> is cosine distance
    // 1 - (embedding <=> $1) is cosine similarity
    const { data, error } = await supabase.rpc('match_artigos', {
      query_embedding: embedding,
      match_threshold: 0.85,
      match_count: 3
    })

    if (error) {
      // Se a função match_artigos não existir, tentamos via raw query se possível,
      // mas no Supabase SSR client não temos acesso ao raw SQL.
      // Vou assumir que o utilizador deve criar a função no Supabase.
      console.error('Error matching artigos:', error)
      
      // Fallback: tentar via SELECT normal se o pgvector estiver ativo e suportar rpc
      // Na verdade, no Supabase recomenda-se usar RPC para buscas vetoriais.
      return NextResponse.json({ error: 'Erro ao comparar similaridade. Verifique se a função match_artigos existe no Supabase.' }, { status: 500 })
    }

    return NextResponse.json({ matches: data || [] })
  } catch (err: unknown) {
    console.error('Similarity check error:', err)
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
