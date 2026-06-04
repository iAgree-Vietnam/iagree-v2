import type { NextApiRequest, NextApiResponse } from 'next';
import { createAdminClient } from '@/lib/supabase';

/**
 * GET /api/v2/categories
 * Returns categories list from Supabase
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from('categories')
      .select('id, name, slug, parent_id, icon, description, created_at')
      .order('name');

    if (error) {
      console.error('[/api/v2/categories] Supabase error:', error);
      return res.status(200).json({ items: [], total: 0 });
    }

    return res.status(200).json({
      items: (data || []).map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        parent_id: cat.parent_id,
        icon: cat.icon || null,
        description: cat.description || null,
      })),
      total: (data || []).length,
    });
  } catch (error: any) {
    console.error('[/api/v2/categories] Error:', error);
    return res.status(200).json({ items: [], total: 0 });
  }
}
