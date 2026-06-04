import type { NextApiRequest, NextApiResponse } from 'next';
import { createAdminClient } from '@/lib/supabase';

/**
 * GET /api/v2/projects/:jobId
 * Returns single job detail in the format JobParseUtils.detailInit() expects.
 * Matches EndpointConfig.JOB_DETAIL = 'projects/:jobId'
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { jobId } = req.query;
  const id = Array.isArray(jobId) ? jobId[0] : jobId;

  if (!id) {
    return res.status(400).json({ message: 'Job ID is required' });
  }

  try {
    const admin = createAdminClient();

    const { data: job, error } = await admin
      .from('jobs')
      .select(`
        *,
        categories(id, name, slug)
      `)
      .eq('id', id)
      .single();

    if (error || !job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const now = new Date();
    const expiresAt = job.expires_at ? new Date(job.expires_at) : null;
    const isExpired = expiresAt ? expiresAt < now : false;

    const budgetMin = job.budget_min || 0;
    const budgetMax = job.budget_max || 0;

    let salaryType = 1;
    if (budgetMin && budgetMax && budgetMin < budgetMax) salaryType = 2;
    else if (budgetMax) salaryType = 3;

    const responseData = {
      id: job.id,
      name: job.title || '',
      description: job.description || '',
      status: job.status === 'open' ? 1 : 0,
      posting_end_date: job.expires_at || job.deadline || null,
      created_by_user_id: 0,
      partner_user_id: 0,
      start_date: job.created_at,
      end_date: job.expires_at || job.deadline || null,
      price: budgetMax || budgetMin || 0,
      connect: 0,
      salary_type: salaryType,
      price_min: budgetMin,
      price_max: budgetMax,
      job_duration_type: 1,
      duration: job.duration_days || 0,
      react: 0,
      is_expired: isExpired,
      applicants_count: job.proposals_count || 0,
      views_count: job.views_count || 0,
      skills: (job.skills_required || []).map((name: string, i: number) => ({ id: i, name })),
      category: job.categories
        ? { id: job.categories.id, name: job.categories.name, slug: job.categories.slug }
        : null,
      badge_info: {
        badge_label: isExpired ? 'Hết hạn' : 'Đang tuyển',
        badge_status: isExpired ? 'EXPIRED' : 'ACTIVE',
      },
      updated_at: job.updated_at || job.created_at,
      created_at: job.created_at,
      // Fields expected by JobParseUtils.detailInit
      categories: job.categories ? [{ id: job.categories.id, name: job.categories.name }] : [],
      salary: { id: salaryType, name: salaryType === 1 ? 'Thỏa thuận' : salaryType === 2 ? 'Khoảng' : 'Cố định' },
      time: null,
      job_bids: { items: [], total: 0 },
      job_results: [],
      job_histories: [],
      job_contract_overview: null,
    };

    return res.status(200).json(responseData);
  } catch (error: any) {
    console.error('[/api/v2/projects/:jobId] Error:', error);
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
}
