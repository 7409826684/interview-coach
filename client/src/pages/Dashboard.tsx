import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import {
  TrendingUp,
  Flame,
  Award,
  Clock,
  AlertTriangle,
  BrainCircuit,
  Mic,
  Briefcase,
  Code2,
  FileText,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { DashboardStats } from '../types';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axiosClient.get('/dashboard/stats');
      setStats(res.data);
    } catch (err) {
      console.warn('Could not load remote dashboard stats, using initial state:', err);
      // Fallback demo state
      setStats({
        streak: user?.streak || 1,
        totalSessions: 3,
        averageScore: 7.8,
        weakAreas: user?.weakAreas?.length ? user.weakAreas : ['System Design', 'React Re-renders'],
        typeBreakdown: { mock: 2, speaking: 1, hr: 0, technical: 0, resume: 0 },
        recentSessions: [
          {
            _id: 'demo1',
            type: 'mock',
            role: 'Frontend',
            difficulty: 'Mid',
            score: 8,
            summaryFeedback: 'Good understanding of React hooks and closures.',
            createdAt: new Date().toISOString(),
          },
          {
            _id: 'demo2',
            type: 'speaking',
            topic: 'Overcoming technical challenges',
            score: 7.5,
            summaryFeedback: 'Good flow; reduce filler words like "basically".',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
          },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        <p className="text-sm text-slate-400">Loading your interview dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Top Welcome Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white">
            Candidate Progress Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Track your interview performance, daily streaks, and skill readiness.
          </p>
        </div>

        <Link
          to="/mock-interview"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
        >
          <BrainCircuit className="w-4 h-4" />
          <span>Launch Mock Session</span>
        </Link>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Daily Streak */}
        <div className="p-6 rounded-2xl glass-card border border-amber-500/20 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Daily Streak
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Flame className="w-5 h-5 text-amber-500 fill-amber-500 animate-pulse" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-amber-400">{stats?.streak || 1}</span>
            <span className="text-xs font-semibold text-slate-400">Days Active</span>
          </div>
          <p className="text-xs text-amber-300/80 mt-2">
            Practice daily to retain high cognitive fluency!
          </p>
        </div>

        {/* Average Score */}
        <div className="p-6 rounded-2xl glass-card border border-indigo-500/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Average Score
            </span>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
              <Award className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-1">
            <span className="text-4xl font-extrabold text-indigo-400">
              {stats?.averageScore || '0.0'}
            </span>
            <span className="text-sm font-semibold text-slate-400">/ 10</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Target benchmark for hiring: 8.5+</p>
        </div>

        {/* Total Sessions */}
        <div className="p-6 rounded-2xl glass-card border border-emerald-500/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Sessions Completed
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-emerald-400">
              {stats?.totalSessions || 0}
            </span>
            <span className="text-xs font-semibold text-slate-400">Rounds</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Across technical, speaking & HR</p>
        </div>

        {/* Weak Areas Card */}
        <div className="p-6 rounded-2xl glass-card border border-rose-500/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Focus Areas
            </span>
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {stats?.weakAreas && stats.weakAreas.length > 0 ? (
              stats.weakAreas.map((area, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold"
                >
                  {area}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400">No weak areas identified yet!</span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-2">Tagged from sub-6 scores</p>
        </div>
      </div>

      {/* Recent Practice History Table */}
      <div className="p-6 rounded-2xl glass border border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-400" />
          Recent Session History
        </h3>

        {stats?.recentSessions && stats.recentSessions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs uppercase bg-slate-900/80 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Role / Topic</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4">Key Feedback</th>
                  <th className="py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {stats.recentSessions.map((session) => (
                  <tr key={session._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <span className="capitalize px-2.5 py-1 rounded-full text-xs font-bold bg-slate-800 text-indigo-300 border border-indigo-500/20">
                        {session.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-white">
                      {session.role || session.topic || 'General Practice'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-emerald-400">
                        {session.score || 0} / 10
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-400 max-w-xs truncate">
                      {session.summaryFeedback || 'Session completed.'}
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-500">
                      {new Date(session.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400 space-y-2">
            <p>No practice sessions recorded yet.</p>
            <Link to="/mock-interview" className="text-indigo-400 hover:underline text-xs font-bold">
              Complete your first mock interview now →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
