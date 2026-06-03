import type { NextApiRequest, NextApiResponse } from 'next'
// Auth handled by Supabase - this route kept for compatibility
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ message: 'Auth handled by Supabase' })
}