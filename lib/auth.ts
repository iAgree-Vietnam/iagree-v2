import { supabase } from './supabase'

export async function signInWithEmail(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password })
}

export async function signUpWithEmail(email: string, password: string, displayName: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { display_name: displayName } }
  })
  if (error) return { data, error }

  // Create profile row
  if (data.user) {
    await supabase.from('profiles').insert({
      id: data.user.id,
      display_name: displayName,
      role: 'both'
    })
  }
  return { data, error }
}

export async function signInWithGoogle() {
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback` }
  })
}

export async function signOut() {
  return supabase.auth.signOut()
}

export async function getSession() {
  const { data } = await supabase.auth.getSession()
  return data.session
}

export async function getUser() {
  const { data } = await supabase.auth.getUser()
  return data.user
}
