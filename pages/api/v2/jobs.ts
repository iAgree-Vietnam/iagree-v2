import type { NextApiRequest, NextApiResponse } from 'next';
import { createAdminClient } from '@/lib/supabase';

/**
 * GET /api/v2/jobs
 * Returns paginated job list with pagination metadata.
 * Simplified endpoint for job search.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const {
      page = 1,
      per_page = 10,
      q,
      name,
      category_id,
    } = req.query;

    const limit = Math.min(Number(per_page) || 10, 50);
    const pageNum = Math.max(Number(page) || 1, 1);
    const offset = (pageNum - 1) * limit;
    const searchTerm = (q || name) as string;

    const admin = createAdminClient();

    let query = admin
      .from('jobs')
      .select('id, title, description, status, budget_min, budget_max, expires_at, created_at, skills_required, proposals_count, category_id', { count: 'exact' })
      .eq('status', 'open')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (searchTerm) {
      query = query.ilike('title', `%${searchTerm}%`);
    }
    if (category_id) {
      query = query.eq('category_id', category_id);
    }

    const { data, error, count } = await query;

    if (error) {
      return res.status(200).json({ data: [], pagination: { total: 0, per_page: limit, current_page: pageNum } });
    }

    const now = new Date();
    const jobList = (data || []).map((job: any) => {
      const expiresAt = job.expires_at ? new Date(job.expires_at) : null;
      const isExpired = expiresAt ? expiresAt < now : false;
      return {
        id: job.id,
        title: job.title || '',
        description: job.description || '',
        skills: job.skills_required || [],
        budget_from: job.budget_min,
        budget_to: job.budget_max,
        time: job.expires_at || job.created_at,
        category_name: '',
        status: job.status === 'open' ? 'OPEN' : 'CLOSED',
        slug: job.id,
        url: job.id,
        applicants_count: job.proposals_count || 0,
        is_expired: isExpired,
      };
    });

    return res.status(200).json({
      data: jobList,
      pagination: {
        total: count || 0,
        per_page: limit,
        current_page: pageNum,
      },
    });
  } catch (error: any) {
    console.error('[/api/v2/jobs] Error:', error);
    return res.status(200).json({ data: [], pagination: { total: 0, per_page: 10, current_page: 1 } });
  }
}
