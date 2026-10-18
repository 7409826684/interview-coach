import express from 'express';
import { getRandomTopic, evaluateSpeech } from '../controllers/speakingController.js';
import { aiRateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.get('/topic', getRandomTopic);
router.post('/evaluate', aiRateLimiter, evaluateSpeech);

export default router;
