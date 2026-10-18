import React, { useState } from 'react';
import axiosClient from '../api/axiosClient';
import {
  FileText,
  Sparkles,
  HelpCircle,
  AlertCircle,
  Loader2,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { ResumeAnalysis } from '../types';

export const ResumeInterview: React.FC = () => {
  const [resumeText, setResumeText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);

  const sampleResume = `FULL STACK DEVELOPER
Skills: React, TypeScript, Node.js, Express, MongoDB, Tailwind CSS, Docker, AWS (S3, EC2).
Projects:
1. E-Commerce Platform: Built high-throughput shopping cart supporting 10k daily active users. Optimized database indexing reducing query response time by 45%.
2. Real-Time Chat App: Implemented WebSockets with Socket.io and Redis caching for distributed message delivery. Integrated JWT auth with refresh tokens.`;

  const handleGenerate = async () => {
    if (!resumeText.trim() || resumeText.length < 50) {
      setError('Please provide at least 50 characters of resume text or project descriptions.');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const res = await axiosClient.post('/interview/resume', { resumeText });
      setAnalysis(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to parse resume with AI.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2.5">
          <FileText className="w-8 h-8 text-cyan-400" />
          Resume-Tailored Interview Prep
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Paste your resume or project bullets. AI scans your exact tech stack and extracts high-probability interview questions.
        </p>
      </div>

      {/* Input Box */}
      <div className="p-6 sm:p-8 rounded-2xl glass border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Paste Resume Content / Project Highlights
          </label>
          <button
            onClick={() => setResumeText(sampleResume)}
            className="text-xs text-cyan-400 hover:text-cyan-300 underline underline-offset-4"
          >
            Insert Sample Developer Resume
          </button>
        </div>

        <textarea
          rows={7}
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          placeholder="Paste your resume sections, skills, work experience, or project bullet points..."
          className="w-full p-4 bg-slate-900 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-y"
        />

        {error && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            onClick={handleGenerate}
            disabled={loading || !resumeText.trim()}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm shadow-lg shadow-cyan-600/30 transition-all disabled:opacity-50 hover:scale-105"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Scanning Resume & Tech Stack...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Tailored Questions
              </>
            )}
          </button>
        </div>
      </div>

      {/* Questions Generated */}
      {analysis && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-sm text-cyan-200">
            <strong>Candidate Profile Summary:</strong> {analysis.summary}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Targeted Interview Questions</h3>
            {analysis.questions.map((q, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl glass-card border border-slate-800 space-y-3 hover:border-cyan-500/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-bold text-cyan-400 tracking-wider">
                    Question {idx + 1} • {q.category}
                  </span>
                </div>

                <h4 className="text-base sm:text-lg font-bold text-white leading-snug">
                  "{q.question}"
                </h4>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400 flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-slate-300">Why interviewers ask this:</strong>{' '}
                    {q.rationale}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
