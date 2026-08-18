import cors from 'cors';
import { config } from '../config';

// Requests with no Origin header (curl, server-to-server) pass through here —
// CORS only ever constrains browsers, so the session-token gate (middleware/session.ts)
// is the real access control, not this check.
export const corsMiddleware = cors({
  origin(origin, callback) {
    if (!origin || config.allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error('Origin not allowed'));
  },
  credentials: false,
});
