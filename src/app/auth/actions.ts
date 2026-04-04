'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/login?error=Invalid login credentials')
  }

  // Check if user is approved
  const { data: userData } = await supabase
    .from('users')
    .select('aprovado')
    .eq('email', data.email)
    .single()

  if (userData && !userData.aprovado) {
    await supabase.auth.signOut()
    redirect('/pending-approval')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const nome = formData.get('nome') as string
  const papel = formData.get('papel') as string
  const curso = formData.get('curso') as string

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (authError) {
    redirect('/register?error=' + authError.message)
  }

  if (authData.user) {
    const { error: dbError } = await supabase.from('users').insert({
      id: authData.user.id,
      email,
      nome,
      papel,
      curso,
      aprovado: false,
    })

    if (dbError) {
      console.error('DB Error:', dbError)
      redirect('/register?error=Error saving profile data')
    }
  }

  redirect('/pending-approval')
}

export async function signout() {
  const supabase = createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
