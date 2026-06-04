import type { NextApiRequest, NextApiResponse } from 'next';
import { createAdminClient } from '@/lib/supabase';

/**
 * GET /api/v2/web/v2/projects
 * Returns paginated jobs list in the format JobParseUtilsV2.list() expects.
 * Matches EndpointConfig.JOB_ADD_V2 = "web/v2/projects"
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const {
      page = 1,
      per_page = 12,
      name,
      price_min,
      price_max,
      salary_type,
      category_project_ids,
    } = req.query;

    const limit = Math.min(Number(per_page) || 12, 50);
    const pageNum = Math.max(Number(page) || 1, 1);
    const offset = (pageNum - 1) * limit;

    const admin = createAdminClient();

    let query = admin
      .from('jobs')
      .select(
        `id, title, description, status, budget_min, budget_max, duration_days,
         deadline, expires_at, created_at, updated_at, proposals_count,
         skills_required, category_id`,
        { count: 'exact' }
      )
      .eq('status', 'open')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (name) {
      query = query.ilike('title', `%${name}%`);
    }
    if (price_min) {
      query = query.gte('budget_min', Number(price_min));
    }
    if (price_max) {
      query = query.lte('budget_max', Number(price_max));
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('[/api/v2/web/v2/projects] Supabase error:', error);
      return res.status(200).json({ items: [], total: 0 });
    }

    const now = new Date();

    const items = (data || []).map((job: any) => {
      const expiresAt = job.expires_at ? new Date(job.expires_at) : null;
      const isExpired = expiresAt ? expiresAt < now : false;

      const budgetMin = job.budget_min || 0;
      const budgetMax = job.budget_max || 0;

      // salary_type: 1=DEAL, 2=RANGE, 3=FIXED
      let salaryType = 1; // DEAL
      if (budgetMin && budgetMax && budgetMin < budgetMax) {
        salaryType = 2; // RANGE
      } else if (budgetMax) {
        salaryType = 3; // FIXED
      }

      const badgeLabel = isExpired ? 'Hết hạn' : 'Đang tuyển';
      const badgeStatus = isExpired ? 'EXPIRED' : 'ACTIVE';

      return {
        id: job.id,
        name: job.title || '',
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
        description: job.description || '',
        job_duration_type: 1,
        duration: job.duration_days || 0,
        react: 0,
        is_expired: isExpired,
        applicants_count: job.proposals_count || 0,
        skills: (job.skills_required || []).map((name: string, i: number) => ({
          id: i,
          name,
        })),
        badge_info: { badge_label: badgeLabel, badge_status: badgeStatus },
        updated_at: job.updated_at || job.created_at,
      };
    });

    return res.status(200).json({
      items,
      total: count || 0,
      current_page: pageNum,
      per_page: limit,
    });
  } catch (error: any) {
    console.error('[/api/v2/web/v2/projects] Error:', error);
    return res.status(200).json({ items: [], total: 0 });
  }
}
