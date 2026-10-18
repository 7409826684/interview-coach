import React, { useState } from 'react';
import axiosClient from '../api/axiosClient';
import { useSpeechToText } from '../hooks/useSpeechToText';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import {
  BrainCircuit,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Send,
  Sparkles,
  Award,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  RefreshCw,
  Loader2,
  CheckCircle,
} from 'lucide-react';
import { InterviewQuestion, AnswerEvaluation } from '../types';

export const MockInterview: React.FC = () => {
  // Setup State
  const [role, setRole] = useState('Frontend');
  const [difficulty, setDifficulty] = useState('Junior');
  const [started, setStarted] = useState(false);

  // Interview state
  const [currentQuestion, setCurrentQuestion] = useState<InterviewQuestion | null>(null);
  const [answerText, setAnswerText] = useState('');
  const [loadingQuestion, setLoadingQuestion] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<AnswerEvaluation | null>(null);
  const [questionCount, setQuestionCount] = useState(1);
  const [sessionQuestions, setSessionQuestions] = useState<string[]>([]);
  const [sessionQA, setSessionQA] = useState<any[]>([]);

  // Speech Hooks
  const { isListening, transcript, startListening, stopListening, resetTranscript } = useSpeechToText();
  const { speak, stop: stopSpeech, isSpeaking } = useTextToSpeech();

  // Sync speech transcript with answer input
  React.useEffect(() => {
    if (transcript) {
      setAnswerText(transcript);
    }
  }, [transcript]);

  // Start interview session
  const startSession = async () => {
    setStarted(true);
    setQuestionCount(1);
    setSessionQuestions([]);
    setSessionQA([]);
    fetchNextQuestion([], 1);
  };

  // Fetch next AI question
  const fetchNextQuestion = async (prevQs = sessionQuestions, nextNum = questionCount) => {
    setLoadingQuestion(true);
    setEvaluation(null);
    setAnswerText('');
    resetTranscript();

    try {
      const res = await axiosClient.post('/interview/question', {
        role,
        difficulty,
        previousQuestions: prevQs,
      });

      setCurrentQuestion(res.data);
      const newQuestions = [...prevQs, res.data.question];
      setSessionQuestions(newQuestions);
      setQuestionCount(nextNum);

      // Automatically speak the question aloud
      speak(res.data.question);
    } catch (err) {
      console.error('Error fetching question:', err);
    } finally {
      setLoadingQuestion(false);
    }
  };

  // Submit Answer for AI Evaluation
  const submitAnswer = async () => {
    if (!answerText.trim() || !currentQuestion) return;

    if (isListening) {
      stopListening();
    }

    setEvaluating(true);
    try {
      const res = await axiosClient.post('/interview/evaluate', {
        role,
        difficulty,
        question: currentQuestion.question,
        answer: answerText,
      });

      setEvaluation(res.data);

      const updatedQA = [
        ...sessionQA,
        {
          question: currentQuestion.question,
          answer: answerText,
          score: res.data.score,
          mistakes: res.data.mistakes,
          sampleAnswer: res.data.sampleAnswer,
          followUpQuestion: res.data.followUpQuestion,
        },
      ];
      setSessionQA(updatedQA);

      // Save partial session in background
      try {
        await axiosClient.post('/interview/session', {
          type: 'mock',
          role,
          difficulty,
          score: res.data.score,
          summaryFeedback: res.data.feedback,
          qaList: updatedQA,
        });
      } catch (saveErr) {
        // Non-critical if user isn't logged in
      }
    } catch (err) {
      console.error('Evaluation failed:', err);
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-2.5">
            <BrainCircuit className="w-8 h-8 text-indigo-500" />
            AI Mock Interview
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time, interactive question rounds tailored to your target engineering domain.
          </p>
        </div>

        {started && (
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold">
              Round: {role} ({difficulty})
            </span>
            <button
              onClick={() => {
                stopSpeech();
                setStarted(false);
              }}
              className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded border border-slate-700"
            >
              Change Role
            </button>
          </div>
        )}
      </div>

      {/* Role & Difficulty Selector (Shown before interview starts) */}
      {!started ? (
        <div className="p-8 rounded-2xl glass border border-slate-800 space-y-8">
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Configure Your Interview Session</h2>
            <p className="text-sm text-slate-400">Select the target job track and experience level.</p>
          </div>

          <div className="space-y-4">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Target Engineering Role
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {['Frontend', 'Backend', 'Full Stack', 'Java', 'HR'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`py-3 px-4 rounded-xl text-sm font-semibold transition-all border ${
                    role === r
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/30'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Experience Level
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['Junior', 'Mid', 'Senior'].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDifficulty(d)}
                  className={`py-3 px-4 rounded-xl text-sm font-semibold transition-all border ${
                    difficulty === d
                      ? 'bg-violet-600 text-white border-violet-500 shadow-lg shadow-violet-600/30'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={startSession}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-base shadow-xl shadow-indigo-600/25 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Start Interview Practice
          </button>
        </div>
      ) : (
        /* Active Interview Arena */
        <div className="space-y-6">
          {/* Question Card */}
          <div className="p-6 rounded-2xl glass-card border border-indigo-500/20 relative space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                Question {questionCount} • {currentQuestion?.category || 'Technical'}
              </span>
              <button
                onClick={() =>
                  isSpeaking ? stopSpeech() : speak(currentQuestion?.question || '')
                }
                title={isSpeaking ? 'Stop voice' : 'Listen to question'}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                    <span>Mute</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Read Aloud</span>
                  </>
                )}
              </button>
            </div>

            {loadingQuestion ? (
              <div className="py-8 flex items-center justify-center gap-2 text-slate-400">
                <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
                <span>Interviewer is preparing your question...</span>
              </div>
            ) : (
              <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                {currentQuestion?.question}
              </h2>
            )}

            {currentQuestion?.hint && !evaluation && (
              <div className="flex items-start gap-2 pt-2 text-xs text-slate-400">
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Hint: {currentQuestion.hint}</span>
              </div>
            )}
          </div>

          {/* Answer Input Area (Only visible before evaluation) */}
          {!evaluation ? (
            <div className="p-6 rounded-2xl glass border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Your Answer (Speak or Type)
                </label>
                {isListening && (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-rose-400 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    Listening to your microphone...
                  </span>
                )}
              </div>

              <textarea
                rows={5}
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                placeholder="Explain clearly using technical terms, code structure, or the STAR framework..."
                className="w-full p-4 bg-slate-900/90 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-y"
              />

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                {/* Voice Input Toggle Button */}
                <button
                  type="button"
                  onClick={isListening ? stopListening : startListening}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                    isListening
                      ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 animate-pulse'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-4 h-4" />
                      Stop Recording
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4 text-emerald-400" />
                      Speak Answer
                    </>
                  )}
                </button>

                {/* Submit Evaluation */}
                <button
                  onClick={submitAnswer}
                  disabled={evaluating || !answerText.trim()}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
                >
                  {evaluating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      AI Scoring...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit Answer
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* AI Evaluation Results Card */
            <div className="p-6 sm:p-8 rounded-2xl glass border border-slate-800 space-y-6">
              {/* Score header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
                    <Award className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                      Answer Evaluation
                    </span>
                    <h3 className="text-lg font-bold text-white">Feedback & Score</h3>
                  </div>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-indigo-400">
                    {evaluation.score}
                  </span>
                  <span className="text-sm font-semibold text-slate-400">/ 10</span>
                </div>
              </div>

              {/* Feedback paragraph */}
              <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                {evaluation.feedback}
              </p>

              {/* Mistakes / Weak areas */}
              {evaluation.mistakes && evaluation.mistakes.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" /> Things to Improve
                  </h4>
                  <ul className="space-y-1.5">
                    {evaluation.mistakes.map((m, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-slate-300 flex items-start gap-2 bg-amber-500/5 p-2 rounded-lg border border-amber-500/10"
                      >
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommended Sample Answer */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" /> 10/10 Benchmark Sample Answer
                </h4>
                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-sm text-emerald-200/90 leading-relaxed">
                  {evaluation.sampleAnswer}
                </div>
              </div>

              {/* Follow up question if any */}
              {evaluation.followUpQuestion && (
                <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/30 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-indigo-300 tracking-wider">
                    Recommended Follow-up Question:
                  </span>
                  <p className="text-sm font-medium text-white">
                    "{evaluation.followUpQuestion}"
                  </p>
                </div>
              )}

              {/* Next Question Button */}
              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => fetchNextQuestion(sessionQuestions, questionCount + 1)}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
                >
                  <span>Next Interview Question</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
