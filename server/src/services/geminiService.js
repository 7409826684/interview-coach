/**
 * Gemini AI Service for PrepMate AI
 * Uses Gemini API with robust JSON parsing and realistic mock fallbacks if no API key is provided.
 */

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

// Helper to make direct Google Gemini API call
async function callGemini(prompt, systemInstruction = '') {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here') {
    console.warn('⚠️ GEMINI_API_KEY not set. Using smart fallback response.');
    return null;
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  
  const payload = {
    contents: [
      {
        parts: [
          { text: systemInstruction ? `${systemInstruction}\n\n${prompt}` : prompt }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1200,
      responseMimeType: 'application/json'
    }
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) return null;

    // Clean JSON markdown blocks if any exist
    const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error('Gemini Service call failed:', err.message);
    return null;
  }
}

// 1. Generate single interview question
export const generateInterviewQuestion = async ({ role, difficulty, topic, previousQuestions = [] }) => {
  const prompt = `
Generate ONE realistic interview question for a ${difficulty} level ${role} interview.
${topic ? `Topic focus: ${topic}.` : ''}
${previousQuestions.length > 0 ? `Do NOT repeat these questions: ${previousQuestions.join(' | ')}` : ''}

Respond in strictly valid JSON:
{
  "question": "The interview question here",
  "category": "Concepts / System Design / Coding / Behavioral",
  "hint": "Brief hint if the candidate gets stuck"
}
`;

  const result = await callGemini(prompt, 'You are a veteran technical interviewer at a top tech company.');
  if (result && result.question) return result;

  // Fallback if AI key is missing
  const fallbacks = {
    Frontend: [
      { question: 'Explain how the Virtual DOM works in React and how reconciliation optimizes re-renders.', category: 'React', hint: 'Think about diffing algorithm and fiber nodes.' },
      { question: 'What is the Event Loop in JavaScript and how do microtasks differ from macrotasks?', category: 'JavaScript', hint: 'Consider Promises vs setTimeout.' },
      { question: 'How do you optimize Core Web Vitals (LCP, FID, CLS) in a modern frontend application?', category: 'Performance', hint: 'Think of code splitting, image optimization, and CDN caching.' }
    ],
    Backend: [
      { question: 'Explain the difference between SQL and NoSQL databases. When would you choose MongoDB over PostgreSQL?', category: 'Database', hint: 'Consider schema rigidity, ACID transactions, and horizontal scaling.' },
      { question: 'How would you handle rate limiting and distributed caching in an Express.js microservice architecture?', category: 'System Design', hint: 'Think of Redis token buckets or sliding windows.' },
      { question: 'What are database indexes, how do B-Trees work, and what is the trade-off of having too many indexes?', category: 'Database', hint: 'Read speed vs Write latency.' }
    ],
    HR: [
      { question: 'Tell me about a time you had a strong disagreement with a team member or manager. How did you resolve it?', category: 'Behavioral', hint: 'Use the STAR method: Situation, Task, Action, Result.' },
      { question: 'What is your greatest technical or personal failure, and what concrete lessons did you take away from it?', category: 'Behavioral', hint: 'Focus on accountability and growth.' }
    ]
  };

  const pool = fallbacks[role] || fallbacks.Frontend;
  return pool[Math.floor(Math.random() * pool.length)];
};

// 2. Evaluate candidate answer
export const evaluateInterviewAnswer = async ({ role, difficulty, question, answer }) => {
  const prompt = `
You are an expert technical interviewer evaluating a candidate for a ${difficulty} ${role} position.
Question: "${question}"
Candidate Answer: "${answer}"

Evaluate the candidate's response and respond strictly with JSON:
{
  "score": 8, // Integer from 1 to 10
  "strengths": ["Clear explanation of concept", "Good practical example"],
  "mistakes": ["Missed edge cases", "Did not mention time complexity"],
  "feedback": "Concise 2-3 sentence assessment of their performance.",
  "sampleAnswer": "A stellar, concise 10/10 response that would impress a hiring manager.",
  "followUpQuestion": "A natural follow-up question digging deeper into their response."
}
`;

  const result = await callGemini(prompt, 'You are an exacting but encouraging interview coach.');
  if (result && typeof result.score === 'number') return result;

  // Fallback assessment
  const wordCount = answer ? answer.trim().split(/\s+/).length : 0;
  const score = wordCount > 40 ? 8 : wordCount > 15 ? 6 : 4;
  return {
    score,
    strengths: wordCount > 20 ? ['Understood the fundamental premise', 'Direct and relevant answer'] : ['Attempted the question'],
    mistakes: wordCount < 30 ? ['Answer was quite brief and lacked depth', 'Could explain with a concrete project example'] : ['Could mention edge cases and trade-offs'],
    feedback: 'Good baseline attempt. Expanding on real-world engineering trade-offs and underlying mechanics will raise your score significantly.',
    sampleAnswer: `A strong answer directly addresses '${question}' by structuring points with: 1) Definition, 2) Working mechanism, 3) Real-world example, and 4) Limitations or trade-offs.`,
    followUpQuestion: 'Can you describe a situation where you personally had to debug or architect this in production?'
  };
};

// 3. Evaluate English Speaking Practice
export const evaluateSpeaking = async ({ topic, transcript }) => {
  const prompt = `
Evaluate the candidate's spoken English response for a professional job interview.
Topic: "${topic}"
Spoken Transcript: "${transcript}"

Evaluate grammar, vocabulary, fluency, and confidence.
Respond in strictly valid JSON:
{
  "grammarScore": 8, // 1 to 10
  "vocabularyScore": 7, // 1 to 10
  "fluencyScore": 8, // 1 to 10
  "confidenceScore": 8, // 1 to 10
  "overallScore": 8, // average rounded
  "mistakes": ["Grammar slip: 'I discusses' should be 'I discussed'", "Filler words used repeatedly"],
  "correctedVersion": "Polished, grammatically pristine version of what the candidate was trying to say.",
  "tips": ["Avoid filler words like 'uh' and 'like'", "Use more active professional verbs such as 'spearheaded' or 'orchestrated'"]
}
`;

  const result = await callGemini(prompt, 'You are a professional corporate communication and English fluency coach.');
  if (result && result.overallScore) return result;

  return {
    grammarScore: 8,
    vocabularyScore: 7,
    fluencyScore: 8,
    confidenceScore: 8,
    overallScore: 8,
    mistakes: ['Sentence structure could be tighter', 'Opportunity to use stronger industry terminology'],
    correctedVersion: `In response to the topic "${topic}": "${transcript}" can be delivered with concise executive tone: "I have consistently leveraged proactive communication and structured methodology to deliver impactful outcomes."`,
    tips: [
      'Pause for 1 second instead of using fillers like "um" or "basically"',
      'Adopt the STAR method (Situation, Task, Action, Result) for structured storytelling'
    ]
  };
};

// 4. Resume-Based Questions Generator
export const generateResumeQuestions = async ({ resumeText }) => {
  const prompt = `
Extract key skills, tech stack, and project highlights from this candidate's resume and generate 4 targeted interview questions.
Resume text:
"""${resumeText.slice(0, 3000)}"""

Respond in strictly valid JSON:
{
  "summary": "Brief 1-sentence overview of candidate's profile.",
  "questions": [
    {
      "question": "Targeted technical or behavioral question based on their project",
      "category": "Project Deep-Dive / Architecture / Problem Solving",
      "rationale": "Why an interviewer would ask this based on their resume"
    }
  ]
}
`;

  const result = await callGemini(prompt, 'You are a Lead Hiring Manager reviewing resumes.');
  if (result && result.questions && result.questions.length > 0) return result;

  return {
    summary: 'Detected full-stack development experience with modern web technologies.',
    questions: [
      {
        question: 'Walk me through the most technically challenging architectural decision in your featured project.',
        category: 'System Architecture',
        rationale: 'Tests your depth of engineering ownership and ability to weigh trade-offs.'
      },
      {
        question: 'How did you approach state management and data fetching to ensure optimal performance?',
        category: 'Frontend & API',
        rationale: 'Validates practical familiarity with scalable frontend patterns.'
      },
      {
        question: 'Tell me about an unexpected production bug or database bottleneck you diagnosed and resolved.',
        category: 'Debugging & Reliability',
        rationale: 'Demonstrates real-world resilience and systematic troubleshooting ability.'
      }
    ]
  };
};

// 5. Technical Quiz Generator
export const generateTechnicalQuiz = async ({ topic = 'JavaScript', difficulty = 'Junior', count = 5 }) => {
  const prompt = `
Generate ${count} multiple choice questions for ${difficulty} level on topic: "${topic}".
Respond in strictly valid JSON:
{
  "questions": [
    {
      "id": 1,
      "question": "What is the output of ...?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0, // 0-based index
      "explanation": "Clear explanation of why this is correct."
    }
  ]
}
`;

  const result = await callGemini(prompt, 'You are a Senior Technical Examiner.');
  if (result && result.questions && result.questions.length > 0) return result.questions;

  // Static fallback questions for JavaScript
  return [
    {
      id: 1,
      question: 'What is the result of typeof NaN in JavaScript?',
      options: ['"nan"', '"undefined"', '"number"', '"object"'],
      correctIndex: 2,
      explanation: 'In JavaScript, NaN (Not-a-Number) is actually a numeric data type defined by IEEE 754 standard.'
    },
    {
      id: 2,
      question: 'Which of the following creates a closure in JavaScript?',
      options: ['An inner function accessing variables of an outer function', 'A try-catch block', 'JSON.parse()', 'A recursive function without a base case'],
      correctIndex: 0,
      explanation: 'A closure gives an inner function access to its outer enclosing function scope even after the outer function has returned.'
    },
    {
      id: 3,
      question: 'What does Promise.all() do if one of the promises rejects?',
      options: ['It waits for all others to finish', 'It rejects immediately with the first rejected error', 'It returns undefined', 'It resolves with null'],
      correctIndex: 1,
      explanation: 'Promise.all is "all-or-nothing". It rejects immediately upon the first rejection (fail-fast behavior).'
    }
  ];
};
