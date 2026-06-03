import { supabase } from './supabase'

export interface Profile {
  id: string
  role: 'client' | 'freelancer' | 'both' | 'admin'
  display_name: string
  username?: string
  bio?: string
  avatar_url?: string
  phone?: string
  location?: string
  website_url?: string
  hourly_rate?: number
  availability: boolean
  skills: string[]
  categories: string[]
  verification_status: 'unverified' | 'pending' | 'verified' | 'rejected'
  verified_by?: string
  jobs_completed: number
  avg_rating: number
  total_reviews: number
  subscription_plan: 'free' | 'pro' | 'studio'
  created_at: string
}

export async function getProfile(userId: string) {
  return supabase.from('profiles').select('*').eq('id', userId).single()
}

export async function getCurrentProfile() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: new Error('Not authenticated') }
  return getProfile(user.id)
}

export async function updateProfile(userId: string, updates: Partial<Profile>) {
  return supabase.from('profiles').update(updates).eq('id', userId).select().single()
}

export async function searchFreelancers(opts?: {
  skills?: string[]
  category?: string
  location?: string
  search?: string
  minRating?: number
  limit?: number
}) {
  let query = supabase
    .from('profiles')
    .select('*')
    .in('role', ['freelancer', 'both'])
    .eq('availability', true)
    .order('avg_rating', { ascending: false })
    .limit(opts?.limit || 20)

  if (opts?.minRating) query = query.gte('avg_rating', opts.minRating)
  if (opts?.location) query = query.ilike('location', `%${opts.location}%`)
  if (opts?.skills?.length) query = query.overlaps('skills', opts.skills)

  return query
}

export async function getFreelancerById(id: string) {
  return supabase
    .from('profiles')
    .select('*, reviews(rating, comment, created_at, reviewer_id)')
    .eq('id', id)
    .single()
}
