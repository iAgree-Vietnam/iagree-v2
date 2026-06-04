import type { NextApiRequest, NextApiResponse } from 'next';
import { createAdminClient } from '@/lib/supabase';

/**
 * POST /api/v2/v2/user/update
 * Updates user profile in Supabase.
 * Matches EndpointConfig.AUTH_FULL_INFO_UPDATE_V2 = 'v2/user/update'
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '').trim();

  if (!token || token === 'null') {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const admin = createAdminClient();
    const { data: { user }, error: authError } = await admin.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    // Parse body - could be FormData or JSON
    const body = req.body || {};
    const updateData: any = {};

    if (body.name) updateData.display_name = body.name;
    if (body.phone) updateData.phone = body.phone;
    if (body.sex !== undefined) updateData.sex = body.sex;
    if (body.birthday) updateData.birthday = body.birthday;
    if (body.avatar_url) updateData.avatar_url = body.avatar_url;

    if (Object.keys(updateData).length > 0) {
      await admin
        .from('profiles')
        .upsert({ id: user.id, ...updateData }, { onConflict: 'id' });
    }

    return res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error: any) {
    console.error('[/api/v2/v2/user/update] Error:', error);
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
}
