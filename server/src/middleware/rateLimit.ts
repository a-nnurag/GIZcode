import rateLimit from 'express-rate-limit';

export const sessionLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

export const dataLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
});

export const tilesLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 1200,
  standardHeaders: true,
  legacyHeaders: false,
});

// Keyed by token, not IP: this is the endpoint that actually guards the analytical
// values, so a shared IP (office/NAT) shouldn't share one bucket with an attacker.
export const blockInfoLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.headers.authorization ?? req.ip ?? 'unknown',
});

// Each chat message costs an embedding call, a vector query, and an LLM call — keep this
// tighter than the other routes and keyed by token like blockInfoLimiter.
export const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 15,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.headers.authorization ?? req.ip ?? 'unknown',
});
