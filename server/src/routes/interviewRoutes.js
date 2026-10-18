import express from 'express';
import {
  getInterviewQuestion,
  evaluateAnswer,
  getResumeQuestions,
  getTechnicalQuiz,
  saveSession,
} from '../controllers/interviewController.js';
import { protect } from '../middleware/authMiddleware.js';
import { aiRateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Question generation & evaluation (with AI rate limiter)
router.post('/question', aiRateLimiter, getInterviewQuestion);
router.post('/evaluate', aiRateLimiter, evaluateAnswer);
router.post('/resume', aiRateLimiter, getResumeQuestions);
router.get('/quiz', aiRateLimiter, getTechnicalQuiz);

// Save completed session (requires user authentication)
router.post('/session', protect, saveSession);

export default router;
