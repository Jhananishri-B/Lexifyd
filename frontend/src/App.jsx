import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Lightbulb, Chrome, Facebook } from 'lucide-react';
import LearningWindow from './pages/LearningWindow';
import PracticeWindow from './pages/PracticeWindow';
import SemanticBuilder from './pages/SemanticBuilder';
import ExplainableAI from './pages/ExplainableAI';
import ContextVariation from './pages/ContextVariation';
import SemanticWeb from './pages/SemanticWeb';
import VoiceLearning from './pages/VoiceLearning';

const DEMO_EMAIL = 'user@gmail.com';
const DEMO_PASSWORD = '123';

const App = () => {
  const [view, setView] = useState('landing');
  const [email, setEmail] = useState(DEMO_EMAIL);
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [loginError, setLoginError] = useState('');

  const handleLogin = (e) => {
    if (e?.preventDefault) e.preventDefault();
    setLoginError('');
    const trimmedEmail = email.trim().toLowerCase();
    if (trimmedEmail === DEMO_EMAIL.toLowerCase() && password === DEMO_PASSWORD) {
      setView('learning');
      return;
    }
    setLoginError('Invalid email or password. Use user@gmail.com / 123');
  };
  const handleNavigate = (page) => setView(page);
  const handleBackToLearning = () => setView('learning');
  const handleBackToLanding = () => setView('landing');

  if (view === 'learning') {
    return <LearningWindow onNavigateBack={handleBackToLanding} onNavigate={handleNavigate} />;
  }

  if (view === 'practice') {
    return <PracticeWindow onNavigateBack={handleBackToLearning} />;
  }

  if (view === 'builder') {
    return <SemanticBuilder onNavigateBack={handleBackToLearning} />;
  }

  if (view === 'ai') {
    return <ExplainableAI onNavigateBack={handleBackToLearning} />;
  }

  if (view === 'variation') {
    return <ContextVariation onNavigateBack={handleBackToLearning} />;
  }

  if (view === 'web') {
    return <SemanticWeb onNavigateBack={handleBackToLearning} />;
  }

  if (view === 'voice') {
    return <VoiceLearning onNavigateBack={handleBackToLearning} />;
  }

  return (
    <div className="landing-page">
      {/* Background Tamil Characters Apparent at bottom */}
      <div className="bg-characters">
        <span>அ</span>
        <span>ஆ</span>
        <span>இ</span>
        <span>ஈ</span>
      </div>

      <nav className="navbar">
        <div className="logo">
          <span className="logo-text">Lexi<span className="accent">Sense</span></span>
        </div>
      </nav>

      <main className="content-grid">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="badge">
            <span className="dot"></span>
            TAMIL ADVENTURES
          </div>
          <h1 className="hero-title">
            Unlock the <em>Rhythm</em> of Words.
          </h1>
          <p className="hero-subtitle">
            Step into a living canvas where every character tells a story and every lesson is a discovery.
          </p>

          <div className="discovery-card glass-card">
            <div className="plate-bg">
              {/* This is where the generated image will be used */}
              <div className="image-placeholder"></div>
            </div>
            <div className="card-content">
              <div className="floating-bulb">
                <Lightbulb size={20} fill="#FFD700" color="#FFD700" />
              </div>
              <p className="kicker">DID YOU KNOW?</p>
              <p className="fact">
                The Tamil word <span className="tamil-highlight">திங்கள்</span> (Thingal) means both 'Moon' and 'Monday'.
              </p>
              <a href="#" className="card-link">Explore more semantic layers inside.</a>
            </div>
          </div>
        </section>

        {/* Login Section */}
        <section className="login-card-container">
          <div className="login-card">
            <div className="login-header">
              <h2>Welcome Back</h2>
              <p>Ready to continue your quest?</p>
            </div>

            <div className="social-login">
              <button className="btn-social">
                <Chrome size={18} className="icon-google" /> Google
              </button>
              <button className="btn-social">
                <Facebook size={18} fill="#1877F2" color="#1877F2" /> Facebook
              </button>
            </div>

            <div className="divider">
              <span>OR WITH EMAIL</span>
            </div>

            <form className="login-form" onSubmit={handleLogin}>
              <div className="field">
                <label>Email Address</label>
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="user@gmail.com"
                  value={email}
                  onChange={(ev) => setEmail(ev.target.value)}
                />
              </div>
              <div className="field">
                <div className="label-row">
                  <label>Password</label>
                  <a href="#" className="forgot-link">Forgot?</a>
                </div>
                <input
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(ev) => setPassword(ev.target.value)}
                />
              </div>
              {loginError ? <p className="login-error" role="alert">{loginError}</p> : null}
              <button className="btn-primary login-btn" type="submit">
                Enter the Playground <ArrowRight size={20} />
              </button>
            </form>

            <div className="login-footer">
              New to the Tamil script? <a href="#">Start your free lesson</a>
            </div>
          </div>
        </section>
      </main>

      <style>{`
        .landing-page {
          min-height: 100vh;
          padding: 60px 80px;
          max-width: 1400px;
          margin: 0 auto;
          position: relative;
        }

        .navbar {
          margin-bottom: 40px;
          display: flex;
          justify-content: center;
        }

        .logo-text {
          font-size: 2.8rem;
          font-weight: 800;
          letter-spacing: -1.5px;
          color: var(--primary-brown);
        }

        .logo-text .accent {
          background: linear-gradient(90deg, #9333EA 0%, #22C55E 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-left: -2px;
        }

        .content-grid {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 100px;
          align-items: flex-start;
          padding-top: 40px;
        }

        .hero-section {
          max-width: 600px;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #DCFCE7;
          color: #166534;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 800;
          margin-bottom: 32px;
          letter-spacing: 1px;
        }

        .badge .dot {
          width: 6px;
          height: 6px;
          background: #22C55E;
          border-radius: 50%;
        }

        .hero-title {
          font-size: 5.5rem;
          line-height: 0.9;
          font-weight: 800;
          margin-bottom: 32px;
          color: var(--primary-brown);
          letter-spacing: -2px;
        }

        .hero-title em {
          font-style: italic;
          color: #78350F;
          font-weight: 800;
        }

        .hero-subtitle {
          font-size: 1.3rem;
          line-height: 1.6;
          color: #5C3317;
          opacity: 0.7;
          margin-bottom: 54px;
          max-width: 480px;
        }

        .discovery-card {
          width: 400px;
          height: 240px;
          border-radius: 24px;
          display: flex;
          overflow: hidden;
          position: relative;
          box-shadow: 0 10px 30px rgba(0,0,0,0.04);
        }

        .plate-bg {
          width: 45%;
          background: #3E2211;
          position: relative;
        }

        .image-placeholder {
          width: 100%;
          height: 100%;
          background: url('/wooden_plate.png') center/cover;
          opacity: 0.9;
        }

        .card-content {
          width: 55%;
          padding: 32px 24px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background: white;
          color: var(--primary-brown);
          position: relative;
        }

        .floating-bulb {
          position: absolute;
          top: -24px;
          right: 24px;
          background: white;
          width: 48px;
          height: 56px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 20px rgba(0,0,0,0.06);
        }

        .kicker {
          font-size: 0.75rem;
          font-weight: 800;
          color: #5B21B6;
          margin-bottom: 12px;
          letter-spacing: 0.5px;
        }

        .fact {
          font-size: 1.1rem;
          font-weight: 600;
          line-height: 1.5;
          margin-bottom: 16px;
        }

        .tamil-highlight {
          color: #7C3AED;
          font-family: var(--font-tamil);
          font-weight: 700;
        }

        .card-link {
          font-size: 0.85rem;
          color: var(--text-muted);
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .card-link:hover {
          color: var(--primary-brown);
        }

        /* Login Section */
        .login-card-container {
          display: flex;
          justify-content: flex-end;
        }

        .login-card {
          background: white;
          padding: 64px 50px;
          border-radius: 48px;
          box-shadow: 0 30px 80px rgba(0,0,0,0.05);
          width: 100%;
          max-width: 500px;
          border: 1px solid rgba(0,0,0,0.02);
        }

        .login-header h2 {
          font-size: 2.4rem;
          margin-bottom: 12px;
          font-weight: 700;
        }

        .login-header p {
          color: var(--text-muted);
          font-size: 1.1rem;
          margin-bottom: 48px;
        }

        .social-login {
          display: flex;
          gap: 20px;
          margin-bottom: 40px;
        }

        .btn-social {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 16px;
          border: 1px solid #F3F4F6;
          background: #FFFFFF;
          border-radius: 16px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: var(--transition);
        }

        .btn-social:hover {
          background: #F9FAFB;
          border-color: #E5E7EB;
          transform: translateY(-1px);
        }

        .divider {
          display: flex;
          align-items: center;
          text-align: center;
          margin-bottom: 40px;
          color: #9CA3AF;
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 1.5px;
        }

        .divider::before, .divider::after {
          content: "";
          flex: 1;
          border-bottom: 1px solid #F3F4F6;
        }

        .divider span {
          padding: 0 20px;
        }

        .field {
          margin-bottom: 28px;
        }

        .field label {
          display: block;
          font-size: 0.95rem;
          font-weight: 600;
          margin-bottom: 10px;
          color: #374151;
        }

        .label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .forgot-link {
          font-size: 0.85rem;
          color: #9CA3AF;
          text-decoration: none;
          font-weight: 600;
        }

        .forgot-link:hover {
          color: var(--primary-brown);
        }

        .field input {
          width: 100%;
          padding: 18px 20px;
          border: none;
          background: #F9FAFB;
          border-radius: 14px;
          font-family: inherit;
          font-size: 1rem;
          color: var(--primary-brown);
          transition: var(--transition);
        }

        .field input:focus {
          outline: none;
          background: #F3F4F6;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
        }

        .login-error {
          margin: 0 0 8px;
          font-size: 0.9rem;
          font-weight: 600;
          color: #B91C1C;
        }

        .login-btn {
          width: 100%;
          justify-content: center;
          margin-top: 12px;
          padding: 20px;
        }

        .login-footer {
          margin-top: 40px;
          text-align: center;
          font-size: 0.95rem;
          color: #6B7280;
        }

        .login-footer a {
          color: #059669;
          font-weight: 800;
          text-decoration: none;
          margin-left: 4px;
        }

        .login-footer a:hover {
          text-decoration: underline;
        }

        @media (max-width: 1200px) {
          .landing-page {
            padding: 40px;
          }
          .content-grid {
            grid-template-columns: 1fr;
            gap: 80px;
            text-align: center;
          }
          .hero-section, .hero-subtitle {
            margin-right: auto;
            margin-left: auto;
          }
          .discovery-card {
            margin: 0 auto;
          }
          .login-card-container {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default App;
