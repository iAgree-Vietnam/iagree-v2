// Shim for 'next-auth' server imports
import { supabase } from '../supabase'

export async function getServerSession(...args: any[]) {
  const { data } = await supabase.auth.getSession()
  if (!data.session) return null
  return { user: { id: data.session.user.id, email: data.session.user.email, name: data.session.user.user_metadata?.full_name } }
}

export default { getServerSession }
