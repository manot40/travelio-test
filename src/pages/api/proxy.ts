import type { NextApiRequest, NextApiResponse } from 'next';

import axios, { AxiosError } from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (typeof req.query.url !== 'string') throw new Error('url is required to be string');
    const { data } = await axios(req.query.url, { method: req.method, data: req.body });
    return res.status(200).send(data);
  } catch (e: any) {
    if (axios.isAxiosError(e)) {
      const error = e as AxiosError;
      return res.status(error.response?.status || 500).send(error.response?.data);
    }
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
}
