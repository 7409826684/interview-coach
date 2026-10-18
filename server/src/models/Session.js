import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['mock', 'speaking', 'hr', 'technical', 'resume'],
      required: true,
    },
    role: {
      type: String,
      default: 'General',
    },
    difficulty: {
      type: String,
      enum: ['Junior', 'Mid', 'Senior'],
      default: 'Junior',
    },
    topic: {
      type: String,
      default: '',
    },
    score: {
      type: Number,
      default: 0,
    },
    summaryFeedback: {
      type: String,
      default: '',
    },
    qaList: [
      {
        question: { type: String, required: true },
        answer: { type: String, default: '' },
        score: { type: Number, default: 0 },
        mistakes: [{ type: String }],
        sampleAnswer: { type: String },
        followUpQuestion: { type: String },
        feedback: { type: String },
      },
    ],
    speakingEvaluation: {
      grammarScore: { type: Number, default: 0 },
      vocabularyScore: { type: Number, default: 0 },
      fluencyScore: { type: Number, default: 0 },
      confidenceScore: { type: Number, default: 0 },
      correctedVersion: { type: String, default: '' },
      tips: [{ type: String }],
    },
  },
  {
    timestamps: true,
  }
);

const Session = mongoose.model('Session', sessionSchema);
export default Session;
