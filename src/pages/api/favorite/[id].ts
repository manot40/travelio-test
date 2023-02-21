import type { NextApiRequest, NextApiResponse } from 'next';

import { Types } from 'mongoose';
import db, { Favorite } from '@/models';
import { reqErrorHandler } from '@/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!Types.ObjectId.isValid(req.query.id + ''))
    return res.status(400).json({
      success: false,
      message: 'Invalid _id Provided',
    });

  try {
    await db();
    const id = req.query.id as string;

    switch (req.method) {
      case 'GET': {
        const result = await Favorite.findById(id).lean();

        if (!result)
          return res.status(404).json({
            success: false,
            message: 'Favorite book not found',
          });

        return res.status(200).json(result);
      }

      case 'DELETE': {
        const result = await Favorite.findByIdAndDelete(id).lean();

        if (!result)
          return res.status(404).json({
            success: false,
            message: 'Favorite book not found',
          });

        return res.status(204).end();
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
