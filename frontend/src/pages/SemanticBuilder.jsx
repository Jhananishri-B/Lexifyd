import React, { useState, useRef, useCallback, useEffect } from 'react';
import { HelpCircle, Settings, X, Sparkles, Info, Database, Bookmark, History, ScrollText, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import PageBackNav from '../components/PageBackNav';
import LexiMascot from '../components/LexiMascot';

const BANK_TOKENS = ['நான்', 'அவன்', 'புத்தகம்', 'படி -்தான்', 'படி', 'அழகான', 'பார்த்தேன்', 'படம்', 'வாங்குகிறான்'];

const SemanticBuilder = ({ onNavigateBack }) => {
  const tokenIdRef = useRef(3);
  const [lineTokens, setLineTokens] = useState([
    { id: 1, text: 'அவன்' },
    { id: 2, text: 'புத்தகம்' },
  ]);
  const [isHoveringDrop, setIsHoveringDrop] = useState(false);
  const [validationState, setValidationState] = useState('idle'); // idle, checking, success, error
  const [streak, setStreak] = useState(3);

  const addTokenToLine = useCallback((text) => {
    if (!text?.trim()) return;
    const id = tokenIdRef.current++;
    setLineTokens((prev) => [...prev, { id, text: text.trim() }]);
  }, []);

  const removeTokenFromLine = (id) => {
    setLineTokens((prev) => prev.filter((t) => t.id !== id));
    setValidationState('idle');
  };

  const handleBankDragStart = (e, text) => {
    e.dataTransfer.setData('text/plain', text);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleLineDrop = (e) => {
    e.preventDefault();
    setIsHoveringDrop(false);
    setValidationState('idle');
    addTokenToLine(e.dataTransfer.getData('text/plain'));
  };

  // Gamified Check Function
  const handleCheckSentence = () => {
    if (lineTokens.length === 0) return;
    setValidationState('checking');

    // Simulate Backend NLP check
    setTimeout(() => {
      // Mock validation: if it has 3 or more tokens, it's "correct"
      if (lineTokens.length >= 3) {
        setValidationState('success');
        setStreak(s => s + 1);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#4ADE80', '#FBBF24', '#8B4513']
        });
      } else {
        setValidationState('error');
        setStreak(0);
        setTimeout(() => setValidationState('idle'), 800);
      }
    }, 600);
  };

  return (
    <div className="semantic-builder-page">
      <PageBackNav
        title="Semantic Builder"
        onBack={onNavigateBack}
        trailing={
          <div className="header-actions">
            <div className="streak-badge">
              <Flame size={20} color={streak > 0 ? "#F97316" : "#A8A29E"} />
              <span style={{ color: streak > 0 ? '#F97316' : '#A8A29E' }}>{streak}</span>
            </div>
            <HelpCircle size={24} className="icon-btn" />
            <Settings size={24} className="icon-btn" />
          </div>
        }
      />

      <div className="builder-layout">
        <main className="builder-canvas-container">
          <div className="canvas">
            <div className="watermarks">
              <span className="w-1">அ</span><span className="w-2">வி</span><span className="w-3">க</span>
            </div>

            <div className="sentence-bar-wrapper">
              <motion.div
                animate={validationState === 'error' ? { x: [-10, 10, -10, 10, 0] } : {}}
                transition={{ duration: 0.4 }}
                className={`sentence-bar glass-card ${isHoveringDrop ? 'drop-active' : ''} ${validationState}`}
                onDragOver={(e) => { e.preventDefault(); setIsHoveringDrop(true); }}
                onDragLeave={() => setIsHoveringDrop(false)}
                onDrop={handleLineDrop}
              >
                <AnimatePresence>
                  {lineTokens.map((t) => (
                    <motion.div
                      key={t.id}
                      initial={{ opacity: 0, scale: 0.5, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.5, y: -20 }}
                      layout
                      className="active-token"
                    >
                      <span className="active-token-text">{t.text}</span>
                      <button className="remove-token-btn" onClick={() => removeTokenFromLine(t.id)}>
                        <X size={14} className="remove-icon" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div className="drop-target dashed" aria-hidden>Drop here</div>
              </motion.div>
            </div>

            <div className="canvas-footer">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCheckSentence}
                className={`btn-primary check-btn ${validationState}`}
                disabled={validationState === 'checking'}
              >
                <Sparkles size={18} />
                {validationState === 'checking' ? 'சிந்திக்கிறது...' : 'இயல்பைச் சரிபார்க்க (Check)'}
              </motion.button>
            </div>
          </div>
        </main>

        <aside className="token-bank-sidebar">
          <div className="sidebar-header">
            <h3>Token Bank</h3>
            <p>Tamil Word Chunks</p>
          </div>
          <div className="token-grid" role="list">
            {BANK_TOKENS.map((t) => (
              <motion.div
                key={t}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95, cursor: 'grabbing' }}
                draggable
                onDragStart={(e) => handleBankDragStart(e, t)}
                className="token-pill"
              >
                {t}
              </motion.div>
            ))}
          </div>
        </aside>
      </div>

      {/* AI Tutor Mascot */}
      <LexiMascot
        mood={validationState === 'success' ? 'happy' : validationState === 'error' ? 'sad' : 'idle'}
        message={validationState === 'success' ? 'Perfect sentence! 🎉 +20 XP' : validationState === 'error' ? 'Add more words! 💪' : null}
        position="bottom-left"
        scale={0.6}
        autoTips={validationState === 'idle'}
        tipInterval={15000}
      />

      <style jsx>{`
        .semantic-builder-page { min-height: 100vh; display: flex; flex-direction: column; padding: 24px 40px; }
        .header-actions { display: flex; gap: 20px; align-items: center; }
        .streak-badge { display: flex; align-items: center; gap: 6px; background: white; padding: 6px 14px; border-radius: 20px; font-weight: 800; font-size: 1.1rem; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
        .icon-btn { color: var(--nav-back-ink); cursor: pointer; transition: transform 0.2s; }
        .icon-btn:hover { transform: scale(1.1); }
        
        .builder-layout { display: grid; grid-template-columns: 1fr 340px; gap: 40px; flex: 1; align-items: start; }
        .builder-canvas-container { background: rgba(255, 255, 255, 0.4); border: 2px dashed rgba(139, 69, 19, 0.1); border-radius: 48px; position: relative; overflow: hidden; background-image: radial-gradient(rgba(139, 69, 19, 0.15) 2px, transparent 2px); background-size: 40px 40px; min-height: 500px; }
        .canvas { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px; position: relative; }
        .watermarks span { position: absolute; font-family: var(--font-tamil); font-size: 15rem; color: rgba(74, 44, 0, 0.03); font-weight: 800; pointer-events: none; z-index: 0; }
        .w-1 { top: -20px; left: 20px; } .w-2 { bottom: -20px; right: 40px; }
        
        .sentence-bar-wrapper { width: 100%; max-width: 800px; z-index: 10; margin-bottom: 60px; }
        .sentence-bar { background: white; padding: 20px 32px; border-radius: 24px; display: flex; align-items: center; flex-wrap: wrap; gap: 16px; box-shadow: 0 10px 40px rgba(139, 69, 19, 0.1); border: 3px solid transparent; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); min-height: 90px; }
        .sentence-bar.drop-active { border-color: #8B4513; transform: scale(1.02); background: #FFF5EC; }
        .sentence-bar.success { border-color: #4ADE80; background: #F0FDF4; }
        .sentence-bar.error { border-color: #EF4444; background: #FEF2F2; }

        .active-token { background: linear-gradient(135deg, #8B4513, #5C3317); color: white; padding: 14px 20px 14px 28px; border-radius: 16px; font-weight: 700; display: flex; align-items: center; gap: 12px; font-size: 1.1rem; box-shadow: 0 4px 15px rgba(139, 69, 19, 0.3); }
        .active-token-text { font-family: var(--font-tamil); }
        .remove-token-btn { background: rgba(255, 255, 255, 0.2); border: none; padding: 6px; border-radius: 50%; color: white; cursor: pointer; transition: 0.2s; display: flex; }
        .remove-token-btn:hover { background: rgba(255, 255, 255, 0.4); transform: scale(1.1); }
        
        .drop-target { padding: 12px 32px; border-radius: 16px; border: 2px dashed rgba(139, 69, 19, 0.3); color: rgba(139, 69, 19, 0.5); font-weight: 700; flex: 1; min-width: 140px; text-align: center; }
        
        .check-btn { width: 340px; padding: 20px; border-radius: 24px; border: none; font-size: 1.2rem; font-weight: 800; color: white; background: #8B4513; display: flex; align-items: center; justify-content: center; gap: 12px; cursor: pointer; box-shadow: 0 10px 30px rgba(139, 69, 19, 0.3); z-index: 10; }
        .check-btn.success { background: #22C55E; box-shadow: 0 10px 30px rgba(34, 197, 94, 0.3); }
        .check-btn.error { background: #EF4444; }

        .token-bank-sidebar { background: #FFF5EC; border-radius: 40px; padding: 32px; display: flex; flex-direction: column; gap: 32px; box-shadow: inset 0 0 40px rgba(139, 69, 19, 0.05); }
        .sidebar-header h3 { font-size: 1.6rem; color: #4A2C00; margin-bottom: 4px; font-weight: 800; }
        .token-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .token-pill { background: white; padding: 18px 20px; border-radius: 20px; text-align: center; font-family: var(--font-tamil); font-weight: 800; font-size: 1.1rem; color: #5C3317; box-shadow: 0 4px 15px rgba(0,0,0,0.04); cursor: grab; border: 2px solid transparent; }
        .token-pill:hover { border-color: rgba(139, 69, 19, 0.2); color: #8B4513; }
      `}</style>
    </div>
  );
};

export default SemanticBuilder;