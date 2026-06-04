import type { NextApiRequest, NextApiResponse } from 'next';
import { createAdminClient } from '@/lib/supabase';

/**
 * GET /api/v2/web/v2/common/page/home
 * Returns home page init data in the format HomeParseUtilsV2.init() expects.
 * Matches EndpointConfig.HOME_INIT_V2 = '/web/v2/common/page/home'
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const admin = createAdminClient();

    // Fetch latest open jobs
    const { data: jobs } = await admin
      .from('jobs')
      .select('id, title, description, status, budget_min, budget_max, expires_at, created_at, skills_required, proposals_count, category_id')
      .eq('status', 'open')
      .order('created_at', { ascending: false })
      .limit(8);

    // Fetch categories
    const { data: categories } = await admin
      .from('categories')
      .select('id, name, slug, parent_id')
      .order('name')
      .limit(20);

    const now = new Date();

    const mappedJobs = (jobs || []).map((job: any) => {
      const expiresAt = job.expires_at ? new Date(job.expires_at) : null;
      const isExpired = expiresAt ? expiresAt < now : false;
      const budgetMin = job.budget_min || 0;
      const budgetMax = job.budget_max || 0;
      let salaryType = 1;
      if (budgetMin && budgetMax && budgetMin < budgetMax) salaryType = 2;
      else if (budgetMax) salaryType = 3;

      return {
        id: job.id,
        name: job.title || '',
        description: job.description || '',
        status: job.status === 'open' ? 1 : 0,
        posting_end_date: job.expires_at || null,
        created_by_user_id: 0,
        partner_user_id: 0,
        start_date: job.created_at,
        end_date: job.expires_at || null,
        price: budgetMax || budgetMin || 0,
        connect: 0,
        salary_type: salaryType,
        price_min: budgetMin,
        price_max: budgetMax,
        description_short: (job.description || '').substring(0, 200),
        job_duration_type: 1,
        duration: 0,
        react: 0,
        is_expired: isExpired,
        applicants_count: job.proposals_count || 0,
        skills: (job.skills_required || []).map((name: string, i: number) => ({ id: i, name })),
        badge_info: { badge_label: isExpired ? 'Hết hạn' : 'Đang tuyển', badge_status: isExpired ? 'EXPIRED' : 'ACTIVE' },
        updated_at: job.created_at,
      };
    });

    const mappedCategories = (categories || []).map((cat: any) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      parent_id: cat.parent_id,
    }));

    return res.status(200).json({
      jobs: { items: mappedJobs, total: mappedJobs.length },
      templates: { items: [], total: 0 },
      popularSearch: { items: [], total: 0 },
      categoryTemplate: { items: [], total: 0 },
      categories: mappedCategories,
      partnersTop: [],
      banners: [],
      setting: null,
    });
  } catch (error: any) {
    console.error('[/api/v2/web/v2/common/page/home] Error:', error);
    // Return empty but valid structure to avoid breaking the app
    return res.status(200).json({
      jobs: { items: [], total: 0 },
      templates: { items: [], total: 0 },
      popularSearch: { items: [], total: 0 },
      categoryTemplate: { items: [], total: 0 },
      categories: [],
      partnersTop: [],
      banners: [],
      setting: null,
    });
  }
}
