import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * POST /api/v2/login
 * Returns { token } in the format AuthParseUtils.login() expects (RawLoginResponse)
 * Called by AuthServices.login() via apiUtils after baseURL change
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return res.status(401).json({ message: error.message });
    }

    // Return in the format that AuthParseUtils.login() expects: { token: string }
    return res.status(200).json({
      token: data.session?.access_token,
      access_token: data.session?.access_token,
      user: {
        id: data.user?.id,
        email: data.user?.email,
        name: data.user?.user_metadata?.display_name || data.user?.email?.split('@')[0],
      },
    });
  } catch (error: any) {
    console.error('[/api/v2/login] Error:', error);
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
}
