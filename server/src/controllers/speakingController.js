import * as geminiService from '../services/geminiService.js';

const SPEAKING_TOPICS = [
  'Describe a project where you faced a significant obstacle and how you overcame it.',
  'Why do you want to transition or advance in your current software engineering career?',
  'Explain how you prioritize tasks when multiple high-urgency deadlines clash.',
  'How do you explain complex technical concepts to non-technical stakeholders?',
  'Describe your ideal engineering team culture and what kind of manager brings out your best work.',
  'Tell me about a time you had to adapt quickly to a completely unfamiliar technology or tool.',
  'What are your strategies for maintaining focus and avoiding burnout during intense sprints?'
];

// @desc    Get random speaking topic
// @route   GET /api/speaking/topic
export const getRandomTopic = (req, res) => {
  const randomIndex = Math.floor(Math.random() * SPEAKING_TOPICS.length);
  res.json({
    topic: SPEAKING_TOPICS[randomIndex],
    allTopics: SPEAKING_TOPICS,
  });
};

// @desc    Evaluate spoken response
// @route   POST /api/speaking/evaluate
export const evaluateSpeech = async (req, res) => {
  try {
    const { topic, transcript } = req.body;

    if (!transcript || transcript.trim().length < 5) {
      return res.status(400).json({
        message: 'Speech transcript was too short. Please speak a complete sentence.',
      });
    }

    const evaluation = await geminiService.evaluateSpeaking({
      topic: topic || 'Professional Communication',
      transcript,
    });

    res.json(evaluation);
  } catch (error) {
    console.error('Speaking evaluation error:', error);
    res.status(500).json({ message: 'Failed to evaluate speech' });
  }
};
