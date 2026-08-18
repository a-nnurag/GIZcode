import express from 'express';
import type { ErrorRequestHandler } from 'express';
import { config } from './config';
import { corsMiddleware } from './middleware/cors';
import { requireSession } from './middleware/session';
import { noStore } from './middleware/noStore';
import { sessionLimiter, dataLimiter, tilesLimiter, blockInfoLimiter } from './middleware/rateLimit';
import { sessionRouter } from './routes/session';
import { dataRouter } from './routes/data';
import { tilesRouter } from './routes/tiles';
import { blockInfoRouter } from './routes/blockInfo';

const app = express();

app.use(corsMiddleware);
app.use(noStore);

app.get('/healthz', (_req, res) => res.json({ ok: true }));

app.use('/api/session', sessionLimiter, sessionRouter);
app.use('/api/data', dataLimiter, requireSession, dataRouter);
app.use('/api/tiles', tilesLimiter, requireSession, tilesRouter);
app.use('/api/block-info', blockInfoLimiter, requireSession, blockInfoRouter);

// The `cors` package rejects disallowed origins by passing an Error into next() rather
// than sending a response itself — turn that into an explicit 403 here.
const corsErrorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  if (err instanceof Error && err.message === 'Origin not allowed') {
    res.status(403).json({ error: 'Origin not allowed' });
    return;
  }
  next(err);
};
app.use(corsErrorHandler);

app.listen(config.port, () => {
  console.log(`Atlas API listening on port ${config.port}`);
});
