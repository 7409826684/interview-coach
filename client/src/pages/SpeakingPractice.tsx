import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { useSpeechToText } from '../hooks/useSpeechToText';
import {
  Mic,
  MicOff,
  Sparkles,
  RefreshCw,
  Award,
  AlertCircle,
  CheckCircle2,
  Lightbulb,
  Loader2,
  TrendingUp,
} from 'lucide-react';
import { SpeakingEvaluation } from '../types';

export const SpeakingPractice: React.FC = () => {
  const [topic, setTopic] = useState('Describe a project where you solved a difficult engineering problem.');
  const [loadingTopic, setLoadingTopic] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<SpeakingEvaluation | null>(null);

  const { isListening, transcript, startListening, stopListening, resetTranscript, setTranscript } =
    useSpeechToText();

  // Load initial random topic
  useEffect(() => {
    fetchNewTopic();
  }, []);

  const fetchNewTopic = async () => {
    setLoadingTopic(true);
    setEvaluation(null);
    resetTranscript();
    try {
      const res = await axiosClient.get('/speaking/topic');
      if (res.data?.topic) {
        setTopic(res.data.topic);
      }
    } catch (err) {
      console.error('Failed to get speaking topic:', err);
    } finally {
      setLoadingTopic(false);
    }
  };

  const handleEvaluate = async () => {
    if (!transcript.trim()) return;

    if (isListening) {
      stopListening();
    }

    setEvaluating(true);
    try {
      const res = await axiosClient.post('/speaking/evaluate', {
        topic,
        transcript,
      });

      setEvaluation(res.data);

      // Save to sessions history
      try {
        await axiosClient.post('/interview/session', {
          type: 'speaking',
          topic,
          score: res.data.overallScore,
          speakingEvaluation: res.data,
        });
      } catch (saveErr) {
        // Optional if unauthenticated
      }
    } catch (err) {
      console.error('Speaking analysis failed:', err);
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2.5">
          <Mic className="w-8 h-8 text-emerald-400" />
          English Speaking & Fluency Coach
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Speak out loud on interview topics to receive immediate grading on grammar, vocabulary, fluency, and executive presence.
        </p>
      </div>

      {/* Speaking Topic Card */}
      <div className="p-6 rounded-2xl glass-card border border-emerald-500/20 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider">
            Speaking Prompt
          </span>
          <button
            onClick={fetchNewTopic}
            disabled={loadingTopic}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingTopic ? 'animate-spin' : ''}`} />
            <span>Generate New Topic</span>
          </button>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">
          "{topic}"
        </h2>
      </div>

      {/* Speech Recorder & Live Transcript */}
      <div className="p-6 sm:p-8 rounded-2xl glass border border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Your Spoken Response
          </span>
          {isListening && (
            <div className="flex items-center gap-2 text-xs font-bold text-rose-400">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
              </span>
              Recording Live Speech...
            </div>
          )}
        </div>

        {/* Live transcript editable box */}
        <textarea
          rows={5}
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Click the 'Start Recording' button below and speak clearly into your microphone..."
          className="w-full p-4 bg-slate-900/90 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all resize-y"
        />

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={isListening ? stopListening : startListening}
            className={`flex items-center gap-2.5 px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg ${
              isListening
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30 animate-pulse'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30 hover:scale-105'
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-5 h-5" />
                Stop Recording
              </>
            ) : (
              <>
                <Mic className="w-5 h-5" />
                Start Speaking
              </>
            )}
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={resetTranscript}
              disabled={!transcript}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white border border-slate-700 disabled:opacity-30"
            >
              Clear
            </button>
            <button
              onClick={handleEvaluate}
              disabled={evaluating || !transcript.trim()}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50 hover:scale-105"
            >
              {evaluating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing Speech...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Analyze English Fluency
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* AI Speech Analysis Result */}
      {evaluation && (
        <div className="p-6 sm:p-8 rounded-2xl glass border border-slate-800 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <Award className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                  Speech Performance Report
                </span>
                <h3 className="text-lg font-bold text-white">Fluency & Vocabulary Breakdown</h3>
              </div>
            </div>

            <div className="text-right">
              <div className="text-3xl font-extrabold text-emerald-400">
                {evaluation.overallScore} <span className="text-xs text-slate-400">/ 10</span>
              </div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Overall Rating</span>
            </div>
          </div>

          {/* Metric Score Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Grammar', score: evaluation.grammarScore },
              { label: 'Vocabulary', score: evaluation.vocabularyScore },
              { label: 'Fluency', score: evaluation.fluencyScore },
              { label: 'Confidence', score: evaluation.confidenceScore },
            ].map((metric, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
                <span className="text-xs text-slate-400 font-semibold">{metric.label}</span>
                <div className="text-2xl font-bold text-white mt-1">{metric.score}/10</div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-emerald-400 h-full rounded-full"
                    style={{ width: `${(metric.score / 10) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Grammatical Mistakes */}
          {evaluation.mistakes && evaluation.mistakes.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" /> Detected Mistakes & Filler Words
              </h4>
              <ul className="space-y-1.5">
                {evaluation.mistakes.map((m, idx) => (
                  <li
                    key={idx}
                    className="text-sm text-slate-300 p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/10 flex items-start gap-2"
                  >
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Corrected Polished Version */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Polished Executive Version
            </h4>
            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-sm text-emerald-200/90 leading-relaxed font-medium">
              "{evaluation.correctedVersion}"
            </div>
          </div>

          {/* Professional Speaking Tips */}
          {evaluation.tips && evaluation.tips.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4" /> Coach's Delivery Tips
              </h4>
              <ul className="space-y-1.5">
                {evaluation.tips.map((t, idx) => (
                  <li
                    key={idx}
                    className="text-sm text-slate-300 p-2.5 rounded-lg bg-indigo-500/5 border border-indigo-500/10 flex items-start gap-2"
                  >
                    <span className="text-indigo-400 font-bold">•</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
