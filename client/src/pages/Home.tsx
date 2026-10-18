import React from 'react';
import { Link } from 'react-router-dom';
import {
  BrainCircuit,
  Mic,
  Briefcase,
  Code2,
  FileText,
  TrendingUp,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Volume2,
} from 'lucide-react';

export const Home: React.FC = () => {
  const features = [
    {
      icon: BrainCircuit,
      color: 'from-blue-500 to-indigo-600',
      title: 'AI Mock Interviews',
      desc: 'Simulate realistic technical interviews for Frontend, Backend, Full Stack, Java, or HR with real-time scoring and follow-ups.',
      link: '/mock-interview',
    },
    {
      icon: Mic,
      color: 'from-emerald-500 to-teal-600',
      title: 'English Speaking Practice',
      desc: 'Improve conversational fluency, vocabulary, and sentence structures with automated speech-to-text and AI grammar evaluation.',
      link: '/speaking',
    },
    {
      icon: Briefcase,
      color: 'from-amber-500 to-orange-600',
      title: 'HR Round Simulator',
      desc: 'Master tough behavioral questions like "Tell me about yourself" and salary negotiation using the STAR framework.',
      link: '/hr-round',
    },
    {
      icon: Code2,
      color: 'from-purple-500 to-pink-600',
      title: 'Technical Quiz Arena',
      desc: 'Test your grasp on JavaScript, React, Node.js, MongoDB, and DSA with instant explanations and score tracking.',
      link: '/technical-quiz',
    },
    {
      icon: FileText,
      color: 'from-cyan-500 to-blue-600',
      title: 'Resume-Based Questions',
      desc: 'Paste your resume bullet points. AI detects your specific tech stack and generates deep architectural questions.',
      link: '/resume-prep',
    },
    {
      icon: TrendingUp,
      color: 'from-rose-500 to-red-600',
      title: 'Streak & Analytics',
      desc: 'Build daily interview habits with streak tracking, weak-spot analysis, and session score histories.',
      link: '/dashboard',
    },
  ];

  return (
    <div className="space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 md:pt-20 text-center max-w-5xl mx-auto px-4">
        {/* Glow background accent */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-indigo-500/30 text-indigo-300 text-xs sm:text-sm font-semibold mb-6">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Next-Gen AI Interview Coaching for Students & Engineers</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Ace Your Next Job Interview with{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-violet-300 to-teal-300">
            PrepMate AI
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
          Practice role-based technical rounds, polish your English speaking confidence, and get instant, 
          actionable feedback on your tone, grammar, and technical depth.
        </p>

        {/* Action CTAs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/mock-interview"
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
          >
            Start Mock Interview
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/speaking"
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl glass hover:bg-slate-800 text-slate-200 font-semibold border border-slate-700/80 transition-all"
          >
            <Volume2 className="w-4 h-4 text-emerald-400" />
            Practice Speaking
          </Link>
        </div>

        {/* Benefit Checkmarks */}
        <div className="mt-12 flex flex-wrap justify-center items-center gap-6 text-xs sm:text-sm text-slate-400">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Free Web Speech Voice Input
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Instant 1-10 Scoring & Suggestions
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Daily Streak Gamification
          </span>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white tracking-tight">Everything You Need to Get Hired</h2>
          <p className="mt-2 text-slate-400 text-sm sm:text-base">
            Structured modules designed to take you from nervous applicant to confident offer-holder.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Link
                key={idx}
                to={item.link}
                className="group p-6 rounded-2xl glass-card hover:bg-slate-800/80 border border-slate-800 hover:border-indigo-500/40 transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${item.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                <div className="mt-4 flex items-center text-xs font-semibold text-indigo-400 group-hover:text-indigo-300">
                  <span>Explore practice module</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
};
