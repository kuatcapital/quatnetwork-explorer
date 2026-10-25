// Quat Capital, 2026-10-25: standalone runtime dictionary endpoint, restricted to supported locales.
import type { NextApiRequest, NextApiResponse } from 'next';

import { isLocale } from 'configs/app/i18n';
import { readRuntimeDictionary } from 'lib/i18n/server';

export default async function dictionaryHandler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  res.setHeader('Cache-Control', 'private, no-store, max-age=0');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.status(405).end();
    return;
  }
  if (!isLocale(req.query.locale)) {
    res.status(404).end();
    return;
  }
  try {
    res.status(200).json(await readRuntimeDictionary(req.query.locale));
  } catch (error) {
    res.status(503).end();
  }
}
