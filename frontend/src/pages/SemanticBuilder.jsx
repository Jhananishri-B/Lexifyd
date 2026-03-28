import React, { useState, useRef, useCallback, useEffect } from 'react';
import { HelpCircle, Settings, X, Sparkles, Info, Database, Bookmark, History, ScrollText } from 'lucide-react';
import PageBackNav from '../components/PageBackNav';

const BANK_TOKENS = [
  'நான்',
  'அவன்',
  'புத்தகம்',
  'படி -்தான்',
  'படி',
  'அழகான',
  'பார்த்தேன்',
  'படம்',
  'வாங்குகிறான்',
];

const SemanticBuilder = ({ onNavigateBack }) => {
  const tokenIdRef = useRef(3);
  const [lineTokens, setLineTokens] = useState([
    { id: 1, text: 'அவன்' },
    { id: 2, text: 'புத்தகம்' },
  ]);
  const [lineDragDepth, setLineDragDepth] = useState(0);
  const lineDragDepthRef = useRef(0);

  useEffect(() => {
    const clearDragDepth = () => {
      lineDragDepthRef.current = 0;
      setLineDragDepth(0);
    };
    window.addEventListener('dragend', clearDragDepth);
    return () => window.removeEventListener('dragend', clearDragDepth);
  }, []);

  const addTokenToLine = useCallback((text) => {
    const trimmed = text?.trim();
    if (!trimmed) return;
    const id = tokenIdRef.current++;
    setLineTokens((prev) => [...prev, { id, text: trimmed }]);
  }, []);

  const removeTokenFromLine = useCallback((id) => {
    setLineTokens((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleBankDragStart = (e, text) => {
    e.dataTransfer.setData('text/plain', text);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleLineDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const bumpLineDragDepth = (delta) => {
    lineDragDepthRef.current += delta;
    if (lineDragDepthRef.current < 0) lineDragDepthRef.current = 0;
    setLineDragDepth(lineDragDepthRef.current);
  };

  const handleLineDragEnter = (e) => {
    e.preventDefault();
    bumpLineDragDepth(1);
  };

  const handleLineDragLeave = () => {
    bumpLineDragDepth(-1);
  };

  const handleLineDrop = (e) => {
    e.preventDefault();
    lineDragDepthRef.current = 0;
    setLineDragDepth(0);
    const text = e.dataTransfer.getData('text/plain');
    addTokenToLine(text);
  };

  const lineHighlighted = lineDragDepth > 0;

  return (
    <div className="semantic-builder-page">
      <PageBackNav
        title="Semantic Builder"
        onBack={onNavigateBack}
        trailing={
          <div className="header-actions">
            <HelpCircle size={24} color="var(--nav-back-ink)" />
            <Settings size={24} color="var(--nav-back-ink)" />
          </div>
        }
      />

      <div className="builder-layout">
        <main className="builder-canvas-container">
          <div className="canvas">
            <div className="watermarks">
              <span className="w-1">அ</span>
              <span className="w-2">வி</span>
              <span className="w-3">க</span>
            </div>

            <div className="sentence-bar-wrapper">
              <div
                className={`sentence-bar glass-card ${lineHighlighted ? 'sentence-bar--drop-target' : ''}`}
                onDragOver={handleLineDragOver}
                onDragEnter={handleLineDragEnter}
                onDragLeave={handleLineDragLeave}
                onDrop={handleLineDrop}
              >
                {lineTokens.map((t) => (
                  <div key={t.id} className="active-token">
                    <span className="active-token-text">{t.text}</span>
                    <button
                      type="button"
                      className="remove-token-btn"
                      onClick={() => removeTokenFromLine(t.id)}
                      aria-label={`Remove ${t.text}`}
                    >
                      <X size={14} className="remove-icon" />
                    </button>
                  </div>
                ))}
                <div className="drop-target dashed" aria-hidden>
                  Drop here
                </div>
              </div>
            </div>

            <div className="canvas-footer">
              <button type="button" className="btn-primary check-btn">
                <Sparkles size={18} /> இயல்பைச் சரிபார்க்க (Check)
              </button>
              <p className="instruction">
                <Info size={16} /> Drag word tokens from the bank into the line to build a sentence.
              </p>
            </div>
          </div>
        </main>

        <aside className="token-bank-sidebar">
          <div className="sidebar-header">
            <h3>Token Bank</h3>
            <p>Tamil Word Chunks</p>
          </div>

          <nav className="nav-categories">
            <div className="category-item active">
              <Database size={18} /> Token Bank
            </div>
            <div className="category-item">
              <Bookmark size={18} /> Saved Phrases
            </div>
            <div className="category-item">
              <History size={18} /> History
            </div>
            <div className="category-item">
              <ScrollText size={18} /> Rules
            </div>
          </nav>

          <div className="token-grid" role="list">
            {BANK_TOKENS.map((t) => (
              <div
                key={t}
                role="listitem"
                draggable
                onDragStart={(e) => handleBankDragStart(e, t)}
                className="token-pill"
              >
                {t}
              </div>
            ))}
          </div>
        </aside>
      </div>

      <style>{`
        .semantic-builder-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          padding: 24px 40px;
        }

        .header-actions {
          display: flex;
          gap: 20px;
        }

        .builder-layout {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 40px;
          flex: 1;
          align-items: start;
        }

        .builder-canvas-container {
          background: rgba(255, 255, 255, 0.4);
          border: 2px dashed rgba(139, 69, 19, 0.1);
          border-radius: 48px;
          position: relative;
          overflow: hidden;
          background-image: radial-gradient(rgba(139, 69, 19, 0.1) 1px, transparent 1px);
          background-size: 30px 30px;
          min-height: 480px;
        }

        .canvas {
          min-height: 480px;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          padding: 60px;
          position: relative;
        }

        .watermarks {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }

        .watermarks span {
          position: absolute;
          font-family: var(--font-tamil);
          font-size: 12rem;
          color: rgba(74, 44, 0, 0.03);
          font-weight: 700;
        }

        .w-1 { top: 40px; left: 40px; }
        .w-2 { bottom: 40px; left: 40px; }
        .w-3 { bottom: 40px; right: 40px; }

        .sentence-bar-wrapper {
          margin-top: auto;
          margin-bottom: auto;
          z-index: 10;
          max-width: 100%;
        }

        .sentence-bar {
          background: #FFEEDD;
          padding: 16px 32px;
          border-radius: 100px;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
          box-shadow: 0 10px 30px rgba(139, 69, 19, 0.08);
          border: 2px solid transparent;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .sentence-bar--drop-target {
          border-color: rgba(139, 69, 19, 0.45);
          box-shadow: 0 10px 36px rgba(139, 69, 19, 0.18);
        }

        .active-token {
          background: #8B4513;
          color: white;
          padding: 12px 12px 12px 24px;
          border-radius: 50px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 8px;
          max-width: 100%;
        }

        .active-token-text {
          font-family: var(--font-tamil);
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .remove-token-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          margin: 0;
          border: none;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 50%;
          cursor: pointer;
          color: inherit;
          flex-shrink: 0;
        }

        .remove-token-btn:hover {
          background: rgba(255, 255, 255, 0.28);
        }

        .remove-icon {
          opacity: 0.85;
          display: block;
        }

        .drop-target {
          padding: 12px 32px;
          border-radius: 50px;
          border: 2px dashed rgba(139, 69, 19, 0.2);
          color: rgba(139, 69, 19, 0.4);
          font-style: italic;
          font-weight: 600;
          flex: 1;
          min-width: 140px;
          text-align: center;
        }

        .canvas-footer {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
          z-index: 10;
        }

        .check-btn {
          width: 320px;
          justify-content: center;
          background: linear-gradient(180deg, #8B4513 0%, #3E2211 100%);
        }

        .instruction {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #5C3317;
          opacity: 0.7;
          font-size: 0.95rem;
          font-weight: 600;
          text-align: center;
        }

        .token-bank-sidebar {
          background: #FFF5EC;
          border-radius: 32px;
          padding: 32px;
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .sidebar-header h3 {
          font-size: 1.4rem;
          margin-bottom: 4px;
        }

        .sidebar-header p {
          color: var(--text-muted);
          font-size: 0.9rem;
          font-weight: 600;
        }

        .nav-categories {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .category-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 20px;
          border-radius: 16px;
          font-weight: 700;
          color: #5C3317;
          transition: var(--transition);
          cursor: pointer;
        }

        .category-item:hover {
          background: rgba(139, 69, 19, 0.05);
        }

        .category-item.active {
          background: #8B4513;
          color: white;
        }

        .token-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .token-pill {
          background: white;
          padding: 14px 20px;
          border-radius: 40px;
          text-align: center;
          font-family: var(--font-tamil);
          font-weight: 700;
          color: var(--primary-brown);
          box-shadow: 0 4px 10px rgba(0,0,0,0.02);
          cursor: grab;
          transition: var(--transition);
          touch-action: none;
          user-select: none;
        }

        .token-pill:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(0,0,0,0.05);
        }

        .token-pill:active {
          cursor: grabbing;
        }
      `}</style>
    </div>
  );
};

export default SemanticBuilder;
