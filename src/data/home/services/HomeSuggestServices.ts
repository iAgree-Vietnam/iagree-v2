import { createClient } from '@supabase/supabase-js'

const getClient = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
import {
  HomeInitResource,
  HomeSuggestParams,
  HomeSuggestResponse,
} from "../models/home.types";

export default class HomeSuggestServices {
  search(queryParams: HomeSuggestParams): Promise<HomeSuggestResponse> {
    return Promise.resolve({ data: [], total: 0 } as any)
  }

  async init(): Promise<Partial<HomeInitResource>> {
    const supabase = getClient()
    
    // Fetch latest open jobs for homepage
    const { data: jobs } = await supabase
      .from('jobs')
      .select('id, title, description, skills_required, budget_min, budget_max, deadline, created_at, status, categories(name, slug)')
      .eq('status', 'open')
      .order('created_at', { ascending: false })
      .limit(8)

    // Map to expected format
    const mappedJobs = (jobs || []).map((j: any) => ({
      id: j.id,
      title: j.title,
      description: j.description,
      skills: j.skills_required || [],
      budget_from: j.budget_min,
      budget_to: j.budget_max,
      time: j.deadline,
      category_name: j.categories?.name || '',
      status: 'OPEN',
      slug: j.id,
      url: j.id,
    }))

    return {
      jobs: { items: mappedJobs },
      latestJobs: mappedJobs,
      topPartners: [],
      banners: [],
    } as any
  }
}
