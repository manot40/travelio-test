import type { NextApiResponse } from 'next';
import { ValidationError } from 'joi';

export function reqErrorHandler(e: any, res: NextApiResponse) {
  if (e instanceof ValidationError)
    return res.status(400).json({
      success: false,
      message: e.message,
      errors: e.details,
    });

  console.error(e);
  return res.status(500).json({
    success: false,
    message: 'Internal Server Error',
  });
}
