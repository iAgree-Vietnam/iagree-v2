import type { NextApiRequest, NextApiResponse } from 'next';
import { createAdminClient } from '@/lib/supabase';

/**
 * GET /api/v2/v2/jobs/:id
 * Returns single job detail.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id } = req.query;
  const jobId = Array.isArray(id) ? id[0] : id;

  if (!jobId) {
    return res.status(400).json({ message: 'Job ID is required' });
  }

  try {
    const admin = createAdminClient();

    const { data: job, error } = await admin
      .from('jobs')
      .select(`*, categories(id, name, slug)`)
      .eq('id', jobId)
      .single();

    if (error || !job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const now = new Date();
    const expiresAt = job.expires_at ? new Date(job.expires_at) : null;
    const isExpired = expiresAt ? expiresAt < now : false;

    return res.status(200).json({
      id: job.id,
      title: job.title || '',
      description: job.description || '',
      skills: job.skills_required || [],
      budget_from: job.budget_min,
      budget_to: job.budget_max,
      time: job.expires_at || job.created_at,
      category: job.categories ? { id: job.categories.id, name: job.categories.name } : null,
      status: job.status === 'open' ? 'OPEN' : 'CLOSED',
      slug: job.id,
      url: job.id,
      is_expired: isExpired,
      applicants_count: job.proposals_count || 0,
      created_at: job.created_at,
      updated_at: job.updated_at,
    });
  } catch (error: any) {
    console.error('[/api/v2/v2/jobs/:id] Error:', error);
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
}
