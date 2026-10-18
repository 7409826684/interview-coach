import Session from '../models/Session.js';
import User from '../models/User.js';

// @desc    Get dashboard metrics & statistics for current user
// @route   GET /api/dashboard/stats
export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch user for current streak & saved weak areas
    const user = await User.findById(userId).select('streak lastActiveDate weakAreas name email');

    // Fetch user sessions
    const sessions = await Session.find({ userId }).sort({ createdAt: -1 });

    const totalSessions = sessions.length;
    let totalScore = 0;
    let scoredSessionsCount = 0;

    const typeBreakdown = {
      mock: 0,
      speaking: 0,
      hr: 0,
      technical: 0,
      resume: 0,
    };

    sessions.forEach((s) => {
      if (typeBreakdown[s.type] !== undefined) {
        typeBreakdown[s.type]++;
      }
      if (s.score && s.score > 0) {
        totalScore += s.score;
        scoredSessionsCount++;
      }
    });

    const averageScore = scoredSessionsCount > 0 ? (totalScore / scoredSessionsCount).toFixed(1) : '0.0';

    res.json({
      streak: user?.streak || 1,
      totalSessions,
      averageScore: Number(averageScore),
      weakAreas: user?.weakAreas || [],
      typeBreakdown,
      recentSessions: sessions.slice(0, 10),
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Failed to retrieve dashboard stats' });
  }
};
