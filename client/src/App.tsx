import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Pages
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { MockInterview } from './pages/MockInterview';
import { SpeakingPractice } from './pages/SpeakingPractice';
import { HrRound } from './pages/HrRound';
import { TechnicalQuiz } from './pages/TechnicalQuiz';
import { ResumeInterview } from './pages/ResumeInterview';
import { Dashboard } from './pages/Dashboard';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/mock-interview" element={<MockInterview />} />
              <Route path="/speaking" element={<SpeakingPractice />} />
              <Route path="/hr-round" element={<HrRound />} />
              <Route path="/technical-quiz" element={<TechnicalQuiz />} />
              <Route path="/resume-prep" element={<ResumeInterview />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
