import * as geminiService from '../services/geminiService.js';
import Session from '../models/Session.js';
import User from '../models/User.js';

// @desc    Get next interview question
// @route   POST /api/interview/question
export const getInterviewQuestion = async (req, res) => {
  try {
    const { role = 'Frontend', difficulty = 'Junior', topic, previousQuestions = [] } = req.body;

    const questionData = await geminiService.generateInterviewQuestion({
      role,
      difficulty,
      topic,
      previousQuestions,
    });

    res.json(questionData);
  } catch (error) {
    console.error('Error generating question:', error);
    res.status(500).json({ message: 'Failed to generate interview question' });
  }
};

// @desc    Evaluate candidate's answer
// @route   POST /api/interview/evaluate
export const evaluateAnswer = async (req, res) => {
  try {
    const { role = 'Frontend', difficulty = 'Junior', question, answer } = req.body;

    if (!question || !answer) {
      return res.status(400).json({ message: 'Question and answer are both required' });
    }

    const evaluation = await geminiService.evaluateInterviewAnswer({
      role,
      difficulty,
      question,
      answer,
    });

    // If answer scored low (< 6), tag weak area
    if (req.user && evaluation.score < 6) {
      const user = await User.findById(req.user._id);
      if (user && !user.weakAreas.includes(role)) {
        user.weakAreas.push(role);
        await user.save();
      }
    }

    res.json(evaluation);
  } catch (error) {
    console.error('Error evaluating answer:', error);
    res.status(500).json({ message: 'Failed to evaluate answer' });
  }
};

// @desc    Generate questions based on candidate's resume
// @route   POST /api/interview/resume
export const getResumeQuestions = async (req, res) => {
  try {
    const { resumeText } = req.body;

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({ message: 'Please provide at least 50 characters of resume content.' });
    }

    const questions = await geminiService.generateResumeQuestions({ resumeText });
    res.json(questions);
  } catch (error) {
    console.error('Error parsing resume:', error);
    res.status(500).json({ message: 'Failed to generate questions from resume' });
  }
};

// @desc    Get technical quiz questions
// @route   GET /api/interview/quiz
export const getTechnicalQuiz = async (req, res) => {
  try {
    const { topic = 'JavaScript', difficulty = 'Junior', count = 5 } = req.query;
    const quiz = await geminiService.generateTechnicalQuiz({
      topic,
      difficulty,
      count: Number(count) || 5,
    });

    res.json(quiz);
  } catch (error) {
    console.error('Error getting quiz:', error);
    res.status(500).json({ message: 'Failed to fetch technical quiz' });
  }
};

// @desc    Save completed session
// @route   POST /api/interview/session
export const saveSession = async (req, res) => {
  try {
    const { type, role, difficulty, topic, score, summaryFeedback, qaList, speakingEvaluation } = req.body;

    const session = await Session.create({
      userId: req.user._id,
      type: type || 'mock',
      role,
      difficulty,
      topic,
      score: score || 0,
      summaryFeedback,
      qaList: qaList || [],
      speakingEvaluation: speakingEvaluation || {},
    });

    // Increment user streak if practice happened today
    const user = await User.findById(req.user._id);
    if (user) {
      user.updateStreak();
      await user.save();
    }

    res.status(201).json(session);
  } catch (error) {
    console.error('Error saving session:', error);
    res.status(500).json({ message: 'Failed to save session' });
  }
};
