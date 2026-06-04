// Shim: replaces next-auth/react with Supabase auth
// All existing imports from '@/lib/shim/next-auth-react' should be redirected here
import { useAuth } from '../auth-context'
import { supabase } from '../supabase'

export { AuthProvider as SessionProvider } from '../auth-context'

export function useSession() {
  const { data, status } = useAuth()
  return { data, status }
}

export async function signIn(provider?: string, options?: Record<string, any>) {
  if (provider === 'google') {
    return supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: options?.callbackUrl || `${window.location.origin}/auth/callback` }
    })
  }
  // credentials provider → map to Supabase signInWithPassword
  if (options?.email && options?.password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: options.email,
      password: options.password,
    })
    if (error) {
      // Return NextAuth-compatible error shape
      const msg = error.message || 'Login failed'
      return { ok: false, error: `WRONG_PASSWORD:${msg}`, status: error.status || 400, url: null }
    }
    return { ok: true, error: null, status: 200, url: null, data }
  }
  return supabase.auth.signInWithOAuth({ provider: 'google' })
}

export async function signOut(options?: { callbackUrl?: string }) {
  await supabase.auth.signOut()
  if (typeof window !== 'undefined') {
    window.location.href = options?.callbackUrl || '/login'
  }
}

export function getSession() {
  return supabase.auth.getSession().then(({ data }) => data.session)
}
