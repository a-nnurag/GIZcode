import { Router } from 'express';
import { signToken } from '../lib/token';
import { config } from '../config';

export const sessionRouter = Router();

sessionRouter.post('/', (req, res) => {
  const originHeader = req.headers.origin;
  const refererHeader = req.headers.referer;
  const candidate = originHeader ?? refererHeader ?? '';

  const matchedOrigin = config.allowedOrigins.find((allowed) => candidate.startsWith(allowed));
  if (!matchedOrigin) {
    res.status(403).json({ error: 'Origin not allowed' });
    return;
  }

  const { token, expiresAt } = signToken(matchedOrigin);
  res.json({ token, expiresAt });
});
