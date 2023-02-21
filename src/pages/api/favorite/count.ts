import type { NextApiRequest, NextApiResponse } from 'next';

import db, { Favorite } from '@/models';
import { reqErrorHandler } from '@/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await db();

    switch (req.method) {
      case 'GET': {
        const count = await Favorite.count().lean();
        return res.status(200).json({ success: true, count });
      }

      default:
        return res.status(405).json({
          success: false,
          message: 'Method Not Allowed',
        });
    }
  } catch (e) {
    return reqErrorHandler(e, res);
  }
}
