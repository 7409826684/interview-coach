import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import {
  Code2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Loader2,
  Award,
} from 'lucide-react';
import { QuizQuestion } from '../types';

export const TechnicalQuiz: React.FC = () => {
  const [topic, setTopic] = useState('JavaScript');
  const [difficulty, setDifficulty] = useState('Junior');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  const topics = ['JavaScript', 'React', 'Node.js', 'MongoDB', 'DSA'];

  useEffect(() => {
    fetchQuiz();
  }, [topic, difficulty]);

  const fetchQuiz = async () => {
    setLoading(true);
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setScore(0);
    setQuizFinished(false);

    try {
      const res = await axiosClient.get(
        `/interview/quiz?topic=${encodeURIComponent(topic)}&difficulty=${difficulty}&count=5`
      );
      setQuestions(res.data);
    } catch (err) {
      console.error('Failed to load quiz:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (idx: number) => {
    if (showExplanation) return; // Prevent changing after revealing
    setSelectedOption(idx);
    setShowExplanation(true);

    if (idx === questions[currentIndex].correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setQuizFinished(true);
      // Save session
      try {
        axiosClient.post('/interview/session', {
          type: 'technical',
          role: topic,
          difficulty,
          score: Math.round((score / questions.length) * 10),
          summaryFeedback: `Completed ${topic} quiz: ${score}/${questions.length} correct.`,
        });
      } catch (e) {}
    }
  };

  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2.5">
          <Code2 className="w-8 h-8 text-purple-400" />
          Technical Q&A & Quiz Arena
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Sharpen fundamental software engineering concepts with interactive quizzes and detailed explanations.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl glass border border-slate-800">
        <div className="flex flex-wrap gap-2">
          {topics.map((t) => (
            <button
              key={t}
              onClick={() => setTopic(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                topic === t
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-lg border border-slate-800">
          {['Junior', 'Mid', 'Senior'].map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                difficulty === d ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
          <p className="text-sm text-slate-400">Loading {topic} questions from AI engine...</p>
        </div>
      ) : quizFinished ? (
        /* Quiz Finished Card */
        <div className="p-8 rounded-2xl glass text-center border border-slate-800 space-y-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center">
            <Award className="w-8 h-8 text-purple-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Quiz Completed!</h2>
            <p className="text-sm text-slate-400 mt-1">
              You scored <strong className="text-purple-400">{score}</strong> out of{' '}
              <strong className="text-white">{questions.length}</strong> questions correctly.
            </p>
          </div>

          <button
            onClick={fetchQuiz}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 transition-all hover:scale-105"
          >
            <RotateCcw className="w-4 h-4" />
            Try Another Round
          </button>
        </div>
      ) : currentQ ? (
        /* Active Quiz Question */
        <div className="p-6 sm:p-8 rounded-2xl glass border border-slate-800 space-y-6">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span>
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span className="text-purple-400 uppercase tracking-wider">
              {topic} • {difficulty}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">
            {currentQ.question}
          </h2>

          {/* Options Grid */}
          <div className="space-y-3">
            {currentQ.options.map((option, idx) => {
              let optionClasses =
                'w-full p-4 rounded-xl text-left text-sm font-medium border transition-all flex items-center justify-between ';

              if (showExplanation) {
                if (idx === currentQ.correctIndex) {
                  optionClasses += 'bg-emerald-500/20 border-emerald-500/60 text-emerald-200 ';
                } else if (idx === selectedOption) {
                  optionClasses += 'bg-rose-500/20 border-rose-500/60 text-rose-200 ';
                } else {
                  optionClasses += 'bg-slate-900/60 border-slate-800 text-slate-400 opacity-60 ';
                }
              } else {
                optionClasses +=
                  'bg-slate-900 border-slate-800 text-slate-200 hover:border-purple-500/50 hover:bg-slate-800/80 ';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={showExplanation}
                  className={optionClasses}
                >
                  <span>{option}</span>
                  {showExplanation && idx === currentQ.correctIndex && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 ml-2" />
                  )}
                  {showExplanation && idx === selectedOption && idx !== currentQ.correctIndex && (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Banner */}
          {showExplanation && (
            <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-sm text-purple-200/90 space-y-1">
              <strong className="block text-purple-300 font-bold flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4" /> Explanation:
              </strong>
              <p>{currentQ.explanation}</p>
            </div>
          )}

          {/* Next Button */}
          {showExplanation && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 transition-all hover:scale-105"
              >
                <span>{currentIndex + 1 === questions.length ? 'Finish Quiz' : 'Next Question'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
