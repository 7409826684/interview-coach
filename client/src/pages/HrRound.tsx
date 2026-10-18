import React, { useState } from 'react';
import axiosClient from '../api/axiosClient';
import { useSpeechToText } from '../hooks/useSpeechToText';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import {
  Briefcase,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  Award,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { AnswerEvaluation } from '../types';

const COMMON_HR_QUESTIONS = [
  'Tell me about yourself, your background, and what drives you as an engineer.',
  'What are your greatest professional strengths, and what is one real weakness you are actively improving?',
  'Why do you want to join our company, and what sets you apart from other candidates?',
  'Tell me about a time you had a strong disagreement with a team member or leader. How did you resolve it?',
  'Where do you see yourself in 3 to 5 years in your engineering career?',
];

export const HrRound: React.FC = () => {
  const [selectedQuestion, setSelectedQuestion] = useState(COMMON_HR_QUESTIONS[0]);
  const [answerText, setAnswerText] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<AnswerEvaluation | null>(null);

  const { isListening, transcript, startListening, stopListening, resetTranscript } =
    useSpeechToText();
  const { speak, stop: stopSpeech, isSpeaking } = useTextToSpeech();

  React.useEffect(() => {
    if (transcript) setAnswerText(transcript);
  }, [transcript]);

  const handleSelectQuestion = (q: string) => {
    setSelectedQuestion(q);
    setEvaluation(null);
    setAnswerText('');
    resetTranscript();
    speak(q);
  };

  const submitHrAnswer = async () => {
    if (!answerText.trim()) return;

    if (isListening) stopListening();

    setEvaluating(true);
    try {
      const res = await axiosClient.post('/interview/evaluate', {
        role: 'HR',
        difficulty: 'Mid',
        question: selectedQuestion,
        answer: answerText,
      });

      setEvaluation(res.data);

      // Save session record
      try {
        await axiosClient.post('/interview/session', {
          type: 'hr',
          role: 'HR Behavioral',
          topic: selectedQuestion,
          score: res.data.score,
          summaryFeedback: res.data.feedback,
        });
      } catch (e) {}
    } catch (err) {
      console.error('HR evaluation failed:', err);
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2.5">
          <Briefcase className="w-8 h-8 text-amber-400" />
          HR Round & Behavioral Coach
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Master behavioral questions, salary discussions, and cultural fit assessments using the STAR technique.
        </p>
      </div>

      {/* STAR Technique Helper Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-200">
        <div>
          <strong className="text-amber-400 font-bold block mb-0.5">Use the STAR Framework for Behavioral Questions:</strong>
          <span><strong>S</strong>ituation (Context) → <strong>T</strong>ask (Your role) → <strong>A</strong>ction (What you did) → <strong>R</strong>esult (Measurable outcome)</span>
        </div>
      </div>

      {/* Question Selector List */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Select Standard HR Question
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {COMMON_HR_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectQuestion(q)}
              className={`p-3 rounded-xl text-left text-xs font-medium border transition-all ${
                selectedQuestion === q
                  ? 'bg-amber-500/15 text-amber-300 border-amber-500/40 shadow-sm'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Active Question Box */}
      <div className="p-6 rounded-2xl glass-card border border-amber-500/20 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            Current HR Question
          </span>
          <button
            onClick={() => (isSpeaking ? stopSpeech() : speak(selectedQuestion))}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors"
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                <span>Mute</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Listen Aloud</span>
              </>
            )}
          </button>
        </div>

        <h2 className="text-xl font-bold text-white leading-relaxed">
          "{selectedQuestion}"
        </h2>
      </div>

      {/* Answer Area */}
      <div className="p-6 sm:p-8 rounded-2xl glass border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Your Response (Speak or Type)
          </label>
          {isListening && (
            <span className="text-xs font-bold text-rose-400 animate-pulse flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              Listening...
            </span>
          )}
        </div>

        <textarea
          rows={5}
          value={answerText}
          onChange={(e) => setAnswerText(e.target.value)}
          placeholder="Deliver your structured STAR answer here with positive energy..."
          className="w-full p-4 bg-slate-900/90 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all resize-y"
        />

        <div className="flex items-center justify-between pt-2">
          <button
            onClick={isListening ? stopListening : startListening}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              isListening
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg animate-pulse'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-4 h-4" /> Stop
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 text-amber-400" /> Speak Answer
              </>
            )}
          </button>

          <button
            onClick={submitHrAnswer}
            disabled={evaluating || !answerText.trim()}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm shadow-lg shadow-amber-600/30 transition-all disabled:opacity-50"
          >
            {evaluating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Scoring Tone & Structure...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Submit for HR Feedback
              </>
            )}
          </button>
        </div>
      </div>

      {/* HR Feedback Result */}
      {evaluation && (
        <div className="p-6 sm:p-8 rounded-2xl glass border border-slate-800 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <Award className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                  HR Review
                </span>
                <h3 className="text-lg font-bold text-white">Tone & Delivery Assessment</h3>
              </div>
            </div>

            <div className="text-right">
              <div className="text-3xl font-extrabold text-amber-400">
                {evaluation.score} <span className="text-xs text-slate-400">/ 10</span>
              </div>
            </div>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            {evaluation.feedback}
          </p>

          {evaluation.mistakes && evaluation.mistakes.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" /> Missing Nuances or Red Flags
              </h4>
              <ul className="space-y-1.5">
                {evaluation.mistakes.map((m, idx) => (
                  <li
                    key={idx}
                    className="text-sm text-slate-300 p-2.5 rounded-lg bg-rose-500/5 border border-rose-500/10"
                  >
                    • {m}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Recommended Executive Response
            </h4>
            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-sm text-emerald-200/90 leading-relaxed font-medium">
              "{evaluation.sampleAnswer}"
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
