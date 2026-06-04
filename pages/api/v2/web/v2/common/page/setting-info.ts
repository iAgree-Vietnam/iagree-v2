import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * GET /api/v2/web/v2/common/page/setting-info
 * Returns app setting data.
 * Matches EndpointConfig.SETTING_INIT = '/web/v2/common/page/setting-info'
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Return minimal setting structure to avoid breaking the app
  return res.status(200).json({
    setting: {
      id: 1,
      email: 'contact@iagree.asia',
      phone: null,
      address: null,
      facebook: null,
      youtube: null,
      zalo: null,
    },
    items: [],
    total: 0,
  });
}
