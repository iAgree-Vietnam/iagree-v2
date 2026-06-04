import type { NextApiRequest, NextApiResponse } from 'next';
import { createAdminClient } from '@/lib/supabase';

/**
 * GET /api/v2/user
 * Returns current user profile. Simplified endpoint.
 * For the detailed profile used by BackendAuthServices, see /api/v2/v2/user/info
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '').trim();

  if (!token || token === 'null') {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const admin = createAdminClient();
    const { data: { user }, error } = await admin.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    const { data: profile } = await admin
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    return res.status(200).json({
      id: user.id,
      email: user.email,
      name: profile?.display_name || user.user_metadata?.display_name || user.email?.split('@')[0],
      avatar: profile?.avatar_url || null,
      role: profile?.role || 'both',
      account_type: profile?.account_type || 'PERSONAL',
      created_at: user.created_at,
    });
  } catch (error: any) {
    console.error('[/api/v2/user] Error:', error);
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
}
