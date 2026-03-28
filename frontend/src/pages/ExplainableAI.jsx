import React from 'react';
import {
  Home,
  Info,
  Sparkles,
  Moon,
  Calendar,
  Send,
  Mic,
  BrainCircuit
} from 'lucide-react';
import PageBackNav from '../components/PageBackNav';
import LexiMascot from '../components/LexiMascot';

const ExplainableAI = ({ onNavigateBack }) => {
  return (
    <div className="ai-window-page">
      <PageBackNav
        title="Explainable AI"
        onBack={onNavigateBack}
        trailing={
          <>
            <Home size={22} className="icon-btn" />
            <Info size={22} className="icon-btn" />
          </>
        }
      />

      <main className="chat-container">
        {/* Watermarks */}
        <div className="chat-watermarks">
          <span className="cw-1">அ</span>
          <span className="cw-2">க</span>
        </div>

        <div className="guide-intro">
          <div className="guide-icon">
            <Sparkles size={28} fill="white" color="white" />
          </div>
          <h2>LexiSense Guide</h2>
          <p>Ask me about any Tamil word to explore its deep meanings and history.</p>
        </div>

        <div className="chat-flow">
          {/* User Message */}
          <div className="message user-message">
            <div className="bubble">
              Can you explain why the word <span className="highlight-tag">திங்கள்</span> is used for both a day and an object?
            </div>
            <span className="timestamp">Read 10:14 AM</span>
          </div>

          {/* AI Message */}
          <div className="message ai-message">
            <div className="ai-bubble-container">
              <div className="ai-icon-mini">
                <BrainCircuit size={16} />
              </div>
              <div className="ai-response-card glass-card">
                <p className="intro-text">
                  Great question! This is a perfect example of <strong>Polysemy</strong> (பலபொருள் ஒரு சொல்) in Tamil.
                </p>

                <div className="info-cards">
                  <div className="info-card moon-card">
                    <div className="card-top">
                      <h3>Moon</h3>
                      <Moon size={18} fill="#8B4513" color="#8B4513" />
                    </div>
                    <p>In ancient Tamil literature, <strong>திங்கள் (Thingal)</strong> refers to the Moon, representing beauty and coolness.</p>
                  </div>

                  <div className="info-card monday-card">
                    <div className="card-top">
                      <h3>Monday</h3>
                      <Calendar size={18} fill="#166534" color="#166534" />
                    </div>
                    <p>Because the day is ruled by the Moon's energy in the Vedic system, it became the word for <strong>Monday</strong>.</p>
                  </div>
                </div>

                <div className="tip-box">
                  <em>Tip: You can also use it to mean 'Month' (மாதம்) in some classical contexts!</em>
                </div>
              </div>
            </div>
          </div>

          <div className="message user-message next-prompt">
            <div className="bubble outline">
              Wow! Are there other words like this?
            </div>
          </div>
        </div>

        <div className="chat-input-wrapper">
          <div className="input-bar">
            <input type="text" placeholder="Ask about a Tamil word..." />
            <button className="send-btn">
              <Send size={18} fill="white" color="white" />
            </button>
          </div>
          <button className="mic-btn">
            <Mic size={20} />
          </button>
        </div>

        {/* AI Tutor Mascot */}
        <LexiMascot
          mood="happy"
          message="I'm your LexiSense AI tutor! Ask me anything about Tamil words 🧠"
          position="bottom-right"
          scale={0.6}
          autoTips
          tipInterval={20000}
        />
      </main>

      <style>{`
        .ai-window-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          padding: 24px 60px;
          position: relative;
        }

        .icon-btn { cursor: pointer; opacity: 0.85; color: var(--nav-back-ink); }

        .chat-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          max-width: 1000px;
          margin: 0 auto;
          width: 100%;
          position: relative;
        }

        .chat-watermarks span {
          position: absolute;
          font-family: var(--font-tamil);
          font-size: 15rem;
          color: rgba(74, 44, 0, 0.03);
          font-weight: 700;
          z-index: 0;
        }

        .cw-1 { top: 0; left: -100px; }
        .cw-2 { bottom: 0; right: -100px; }

        .guide-intro {
          text-align: center;
          margin-bottom: 60px;
          z-index: 5;
        }

        .guide-icon {
          width: 64px;
          height: 64px;
          background: #F59E0B;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          box-shadow: 0 8px 20px rgba(245, 158, 11, 0.3);
        }

        .guide-intro h2 {
          font-size: 1.8rem;
          font-weight: 800;
          color: var(--primary-brown);
          margin-bottom: 8px;
        }

        .guide-intro p {
          color: #5C3317;
          opacity: 0.7;
          font-weight: 600;
        }

        .chat-flow {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 40px;
          padding-bottom: 120px;
          z-index: 5;
        }

        .message { display: flex; flex-direction: column; max-width: 80%; }
        .user-message { align-self: flex-end; align-items: flex-end; }
        .ai-message { align-self: flex-start; max-width: 600px; }

        .bubble {
          background: #78350F;
          color: white;
          padding: 20px 28px;
          border-radius: 32px 32px 4px 32px;
          font-size: 1.1rem;
          font-weight: 600;
          line-height: 1.5;
          box-shadow: 0 10px 30px rgba(120, 53, 15, 0.15);
        }

        .bubble.outline {
          background: #78350F;
          color: white;
          border-radius: 32px;
        }

        .highlight-tag {
          background: rgba(255, 255, 255, 0.2);
          padding: 2px 8px;
          border-radius: 6px;
          font-family: var(--font-tamil);
        }

        .timestamp {
          font-size: 0.7rem;
          font-weight: 700;
          color: #9CA3AF;
          margin-top: 8px;
        }

        .ai-bubble-container {
          display: flex;
          gap: 12px;
        }

        .ai-icon-mini {
          width: 32px;
          height: 32px;
          background: #FEF3C7;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #F59E0B;
          flex-shrink: 0;
          margin-top: 20px;
        }

        .ai-response-card {
           background: white;
           padding: 32px;
           border-radius: 12px 32px 32px 32px;
           box-shadow: 0 10px 40px rgba(0,0,0,0.04);
        }

        .intro-text {
          font-size: 1.05rem;
          color: #374151;
          margin-bottom: 24px;
          line-height: 1.5;
        }

        .info-cards {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 24px;
        }

        .info-card {
          padding: 20px;
          border-radius: 24px;
        }

        .moon-card { background: #FFEDD5; color: #78350F; }
        .monday-card { background: #DCFCE7; color: #166534; }

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .card-top h3 { font-size: 1rem; font-weight: 800; }

        .info-card p {
          font-size: 0.85rem;
          line-height: 1.5;
          font-weight: 500;
        }

        .tip-box {
          font-size: 0.85rem;
          color: #6B7280;
          border-top: 1px solid #F3F4F6;
          padding-top: 16px;
        }

        /* Input Area */
        .chat-input-wrapper {
          position: fixed;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 16px;
          width: 800px;
          max-width: 90%;
          z-index: 20;
        }

        .input-bar {
          flex: 1;
          background: #FFFFFF;
          border-radius: 100px;
          padding: 8px 8px 8px 24px;
          display: flex;
          align-items: center;
          box-shadow: 0 10px 40px rgba(0,0,0,0.08);
        }

        .input-bar input {
          flex: 1;
          border: none;
          background: transparent;
          font-family: inherit;
          font-size: 1rem;
          color: var(--primary-brown);
        }

        .input-bar input:focus { outline: none; }

        .send-btn {
          width: 48px;
          height: 48px;
          background: #78350F;
          border-radius: 50%;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .mic-btn {
          width: 56px;
          height: 56px;
          background: #FDE68A;
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #78350F;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default ExplainableAI;
