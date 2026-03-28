import React from 'react';
import { User, Sparkles, Mic, Send, Book, Dumbbell, UserCircle, Brain } from 'lucide-react';
import PageBackNav from '../components/PageBackNav';
import LexiMascot from '../components/LexiMascot';

const VoiceLearning = ({ onNavigateBack }) => {
  return (
    <div className="voice-learning-page">
      <div className="voice-header-wrap">
        <PageBackNav
          title="Voice Based Learning"
          onBack={onNavigateBack}
          trailing={
            <div className="voice-header-brand">
              <span className="logo-text">LexiSense</span>
              <div className="profile-pill">
                <User size={18} />
              </div>
            </div>
          }
        />
      </div>

      <main className="voice-container">
        <div className="chat-area">
          {/* Watermark Characters */}
          <div className="watermarks">
            <span className="w-1">அ</span>
            <span className="w-2">க</span>
          </div>

          <div className="message-stream">
            {/* User Message */}
            <div className="voice-message user">
              <div className="user-bubble">
                <span className="label">You said</span>
                <p>What are the different meanings of "Malai"?</p>
                <span className="timestamp">10:24 AM ✓✓</span>
              </div>
              <div className="user-decorator">
                <div className="emoji-sticker">😊</div>
              </div>
            </div>

            {/* AI Response */}
            <div className="ai-response-card glass-card">
              <div className="ai-badge">
                <Sparkles size={16} color="#7C3AED" /> LEXISENSE AI
              </div>
              <h2 className="ai-text">
                "மழை" (Maḻai) can have two distinct meanings depending on context and spelling:
              </h2>

              <div className="comparison-cards">
                <div className="comp-card brown-accent">
                   <div className="comp-header">
                      <h3>மழை</h3>
                      <p>(Maḻai)</p>
                   </div>
                   <p className="description">Means <strong>Rain</strong>. Precipitation from clouds.</p>
                </div>

                <div className="comp-card purple-accent">
                   <div className="comp-header">
                      <h3 className="purple-text">மலை</h3>
                      <p>(Malai)</p>
                   </div>
                   <p className="description">Means <strong>Mountain</strong>. A large natural elevation.</p>
                </div>
              </div>

              <div className="pro-tip">
                <div className="tip-icon">💡</div>
                <p><strong>Pro-tip:</strong> Pay attention to the "zha" (ழ) vs "la" (ல) sound. It completely changes the meaning!</p>
              </div>
              <span className="ai-time">10:25 AM</span>
            </div>
          </div>
        </div>

        {/* Voice Visualizer Section */}
        <div className="voice-control-section">
          <div className="visualizer-container glass-card">
            <div className="visualizer">
               <div className="bar b1"></div>
               <div className="bar b2"></div>
               <div className="bar b3"></div>
               <div className="bar b4"></div>
            </div>
            <p className="status-text">Listening for your Tamil questions...</p>
          </div>
          <div className="mic-outer-ring">
            <button className="main-mic-btn">
              <Mic size={32} fill="white" color="white" />
            </button>
          </div>
        </div>
        {/* AI Tutor Mascot */}
        <LexiMascot
          mood="happy"
          message="Speak clearly and I'll help with pronunciation! 🎤"
          position="bottom-left"
          scale={0.55}
          autoTips
          tipInterval={14000}
        />
      </main>

      <footer className="bottom-nav">
        <div className="nav-item">
          <Book size={20} />
          <span>Learn</span>
        </div>
        <div className="nav-item">
          <Dumbbell size={20} />
          <span>Practice</span>
        </div>
        <div className="nav-item active">
          <div className="voice-pill">
            <Mic size={20} />
            <span>Voice</span>
          </div>
        </div>
        <div className="nav-item">
          <UserCircle size={20} />
          <span>Profile</span>
        </div>
      </footer>

      <style>{`
        .voice-learning-page { min-height: 100vh; display: flex; flex-direction: column; background: #FFFBF7; position: relative; overflow: hidden; }
        
        .voice-header-wrap { padding: 24px 40px 0; z-index: 10; position: relative; }
        .voice-header-brand { display: flex; align-items: center; gap: 20px; }
        .logo-text { font-size: 1.4rem; font-weight: 800; color: var(--primary-brown); }
        .profile-pill { width: 36px; height: 36px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.05); color: #B45309; }

        .voice-container { flex: 1; display: flex; flex-direction: column; padding: 20px 100px; position: relative; }
        .watermarks span { position: absolute; font-family: var(--font-tamil); font-size: 25rem; color: rgba(74, 44, 0, 0.02); font-weight: 800; z-index: 0; }
        .w-1 { top: -100px; left: -100px; }
        .w-2 { bottom: 0; right: -50px; }

        .message-stream { display: flex; flex-direction: column; gap: 40px; position: relative; z-index: 5; }

        .voice-message.user { align-self: flex-end; display: flex; gap: 20px; align-items: flex-start; }
        .user-bubble { background: #78350F; color: white; padding: 24px 32px; border-radius: 32px 32px 4px 32px; min-width: 400px; box-shadow: 0 10px 40px rgba(120, 53, 15, 0.2); }
        .user-bubble .label { font-size: 0.75rem; opacity: 0.6; font-weight: 700; display: block; margin-bottom: 8px; }
        .user-bubble p { font-size: 1.2rem; font-weight: 600; }
        .user-bubble .timestamp { display: block; text-align: right; margin-top: 12px; font-size: 0.7rem; opacity: 0.6; font-weight: 700; }
        
        .user-decorator { position: relative; width: 120px; height: 120px; }
        .emoji-sticker { position: absolute; top: 0; left: 0; font-size: 4rem; background: #FEF3C7; width: 100px; height: 100px; border-radius: 20px; display: flex; align-items: center; justify-content: center; transform: rotate(10deg); box-shadow: 0 10px 30px rgba(0,0,0,0.05); }

        .ai-response-card { background: white; padding: 40px; border-radius: 12px 48px 48px 48px; max-width: 800px; box-shadow: 0 10px 50px rgba(0,0,0,0.04); align-self: flex-start; }
        .ai-badge { font-size: 0.8rem; font-weight: 800; color: #7C3AED; display: flex; align-items: center; gap: 8px; margin-bottom: 24px; letter-spacing: 1px; }
        .ai-text { font-size: 1.3rem; font-weight: 700; color: #374151; margin-bottom: 32px; line-height: 1.4; }

        .comparison-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px; }
        .comp-card { padding: 32px; border-radius: 32px; position: relative; }
        .brown-accent { background: #FFF9F5; border: 2px solid #8B4513; }
        .purple-accent { background: #FAF9FF; border: 2px solid #8B5CF6; }
        
        .comp-header { margin-bottom: 16px; }
        .comp-header h3 { font-family: var(--font-tamil); font-size: 2rem; font-weight: 800; color: #4B2C00; }
        .comp-header .purple-text { color: #8B5CF6; }
        .comp-header p { font-size: 1rem; color: #5C3317; opacity: 0.6; font-weight: 700; }
        .description { font-size: 1rem; line-height: 1.5; font-weight: 600; color: #374151; }
        .description strong { color: #B45309; }

        .pro-tip { background: #E8F5E9; padding: 20px 24px; border-radius: 20px; display: flex; gap: 16px; align-items: center; color: #2E7D32; font-size: 0.95rem; font-weight: 600; }
        .ai-time { display: block; margin-top: 16px; font-size: 0.75rem; color: #9CA3AF; font-weight: 700; }

        .voice-control-section { position: absolute; bottom: 80px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 24px; width: 100%; z-index: 20; }
        .visualizer-container { background: white; padding: 16px 40px; border-radius: 100px; display: flex; align-items: center; gap: 24px; box-shadow: 0 10px 40px rgba(0,0,0,0.06); }
        .visualizer { display: flex; align-items: center; gap: 6px; height: 32px; }
        .bar { width: 4px; border-radius: 10px; background: #F59E0B; }
        .b1 { height: 16px; } .b2 { height: 32px; } .b3 { height: 24px; } .b4 { height: 18px; }
        .status-text { font-size: 1rem; font-weight: 700; color: #5C3317; opacity: 0.8; }
        
        .mic-outer-ring { width: 100px; height: 100px; background: rgba(120, 53, 15, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; }
        .main-mic-btn { width: 72px; height: 72px; background: #78350F; border: none; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 10px 30px rgba(120, 53, 15, 0.3); }

        .bottom-nav { position: fixed; bottom: 0; left: 0; width: 100%; background: white; padding: 12px 60px 24px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #F3F4F6; z-index: 30; }
        .nav-item { display: flex; flex-direction: column; align-items: center; gap: 6px; color: #9CA3AF; font-size: 0.75rem; font-weight: 700; cursor: pointer; }
        .nav-item.active { color: #F59E0B; }
        .voice-pill { background: #78350F; color: white; padding: 10px 24px; border-radius: 100px; display: flex; align-items: center; gap: 10px; margin-top: -30px; border: 4px solid white; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
        .voice-pill span { font-size: 0.9rem; }
      `}</style>
    </div>
  );
};

export default VoiceLearning;
