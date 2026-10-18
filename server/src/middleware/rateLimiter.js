import rateLimit from 'express-rate-limit';

// Rate limiter for AI-powered routes to protect quota and prevent abuse
export const aiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 40, // Limit each IP to 40 AI queries per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many AI requests from this IP. Please wait a few minutes before trying again.',
  },
});

// General API rate limiter
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: {
    message: 'Too many requests. Please slow down.',
  },
});
