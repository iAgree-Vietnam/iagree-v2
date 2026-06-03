import { supabase, createAdminClient } from './supabase'

export type JobStatus = 'draft' | 'open' | 'in_progress' | 'completed' | 'cancelled'

export interface Job {
  id: string
  client_id: string
  title: string
  description: string
  category_id?: string
  skills_required: string[]
  budget_min?: number
  budget_max?: number
  deadline?: string
  duration_days?: number
  status: JobStatus
  ai_generated_scope?: any
  ai_price_benchmark?: any
  views_count: number
  proposals_count: number
  created_at: string
  expires_at: string
  // Joined
  profiles?: { display_name: string; avatar_url: string; avg_rating: number }
  categories?: { name: string; slug: string }
}

export async function getJobs(opts?: {
  category?: string
  search?: string
  status?: JobStatus
  limit?: number
  offset?: number
}) {
  let query = supabase
    .from('jobs')
    .select(`*, profiles(display_name, avatar_url, avg_rating), categories(name, slug)`)
    .eq('status', opts?.status || 'open')
    .order('created_at', { ascending: false })
    .limit(opts?.limit || 20)

  if (opts?.offset) query = query.range(opts.offset, opts.offset + (opts.limit || 20) - 1)
  if (opts?.category) query = query.eq('categories.slug', opts.category)
  if (opts?.search) query = query.textSearch('title', opts.search, { type: 'plain' })

  return query
}

export async function getJobById(id: string) {
  return supabase
    .from('jobs')
    .select(`*, profiles(display_name, avatar_url, avg_rating, verification_status), categories(name, slug)`)
    .eq('id', id)
    .single()
}

export async function createJob(job: Partial<Job>) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  return supabase.from('jobs').insert({ ...job, client_id: user.id }).select().single()
}

export async function updateJob(id: string, updates: Partial<Job>) {
  return supabase.from('jobs').update(updates).eq('id', id).select().single()
}

export async function incrementJobViews(id: string) {
  return supabase.rpc('increment_job_views', { job_id: id })
}
