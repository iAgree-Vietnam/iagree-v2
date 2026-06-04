import type { NextApiRequest, NextApiResponse } from 'next';
import { createAdminClient } from '@/lib/supabase';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * POST /api/v2/register
 * Called by AuthServices.register() via apiUtils after baseURL change
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password, name, name_rep, phone, citizen_id, tax_code } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: name || name_rep || email.split('@')[0],
          phone: phone || null,
        },
      },
    });

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    // Create profile row
    if (data.user) {
      const admin = createAdminClient();
      await admin.from('profiles').upsert({
        id: data.user.id,
        display_name: name || name_rep || '',
        role: 'both',
        phone: phone || null,
        account_type: tax_code ? 'BUSINESS' : 'PERSONAL',
        tax_code: tax_code || null,
        name_rep: name_rep || null,
      }, { onConflict: 'id' });
    }

    return res.status(200).json({
      email,
      message: null,
      user: {
        id: data.user?.id,
        email: data.user?.email,
      },
    });
  } catch (error: any) {
    console.error('[/api/v2/register] Error:', error);
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
}
