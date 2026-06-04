import type { NextApiRequest, NextApiResponse } from 'next';
import { createAdminClient } from '@/lib/supabase';

/**
 * GET /api/v2/v2/user/info
 * Returns user profile in the format matching RawProfileResponse
 * Called by BackendAuthServices and AuthServices.getFullInfo()
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

    // Verify token and get user
    const { data: { user }, error: authError } = await admin.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    // Fetch profile from profiles table
    const { data: profile } = await admin
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    // Build response in the format AuthParseUtils.profile() expects (RawProfileResponse)
    const responseData = {
      id: profile?.id || user.id,
      name: profile?.display_name || user.user_metadata?.display_name || user.email?.split('@')[0] || '',
      type: 1,
      account_type: profile?.account_type || user.user_metadata?.account_type || 'PERSONAL',
      is_admin: profile?.is_admin ? 1 : 0,
      email: user.email || null,
      email_verified_at: user.email_confirmed_at || null,
      sex: profile?.sex || 0,
      bithday: profile?.birthday || null,
      phone: profile?.phone || user.user_metadata?.phone || null,
      status: 1,
      avatar: profile?.avatar_url || user.user_metadata?.avatar_url || null,
      partner: null,
      level_display: profile?.level_display || null,
      google_id: user.user_metadata?.provider_id || null,
      citizen_id: profile?.citizen_id || null,
      account_type_created: 0,
      user_reviews: { items: [], total: 0 },
      user_services: null,
      user_packages: null,
      name_rep: profile?.name_rep || null,
      tax_code: profile?.tax_code || null,
      card_number: profile?.card_number || null,
      front_card: profile?.front_card || null,
      back_card: profile?.back_card || null,
      business_license: profile?.business_license || null,
      documents: null,
      referral_code: null,
      referred_by: null,
    };

    return res.status(200).json(responseData);
  } catch (error: any) {
    console.error('[/api/v2/v2/user/info] Error:', error);
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
}
