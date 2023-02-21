import type { NextApiRequest, NextApiResponse } from 'next';

import db, { Favorite } from '@/models';
import { favoriteSchema } from '@/schema';
import { mongoosePagination, reqErrorHandler } from '@/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await db();

    switch (req.method) {
      case 'GET': {
        const data = await mongoosePagination(Favorite, req.query);

        return res.status(200).json({
          success: true,
          ...data,
        });
      }

      case 'POST': {
        const { value, error } = favoriteSchema.validate(req.body);
        if (error) throw error;

        const [book] = await Favorite.find({ title: value.title }).lean();
        if (book) return res.status(409).json({ success: false, message: 'Already exists', result: book._id });

        const favorite = new Favorite(value);
        const result = await favorite.save();

        return res.status(201).json({
          success: true,
          result,
        });
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
