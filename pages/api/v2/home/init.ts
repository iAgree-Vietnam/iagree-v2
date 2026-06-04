import type { NextApiRequest, NextApiResponse } from 'next';
import { createAdminClient } from '@/lib/supabase';

/**
 * GET /api/v2/home/init
 * Returns home init data for the homepage. 
 * Returns format matching HomeInitResource with jobs, topPartners, banners.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const admin = createAdminClient();

    const { data: jobs } = await admin
      .from('jobs')
      .select('id, title, description, status, budget_min, budget_max, expires_at, created_at, skills_required, category_id')
      .eq('status', 'open')
      .order('created_at', { ascending: false })
      .limit(8);

    const mappedJobs = (jobs || []).map((job: any) => ({
      id: job.id,
      title: job.title || '',
      description: job.description || '',
      skills: job.skills_required || [],
      budget_from: job.budget_min,
      budget_to: job.budget_max,
      time: job.expires_at || job.created_at,
      category_name: '',
      status: 'OPEN',
      slug: job.id,
      url: job.id,
    }));

    return res.status(200).json({
      jobs: { items: mappedJobs, total: mappedJobs.length },
      topPartners: [],
      banners: [],
    });
  } catch (error: any) {
    console.error('[/api/v2/home/init] Error:', error);
    return res.status(200).json({ jobs: { items: [], total: 0 }, topPartners: [], banners: [] });
  }
}
