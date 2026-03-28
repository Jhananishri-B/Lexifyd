import React from 'react';
import {
  Dumbbell,
  PenTool,
  Brain,
  GitBranch,
  Share2,
  Mic,
  ChevronRight,
} from 'lucide-react';
import PageBackNav from '../components/PageBackNav';

const BG_TAMIL_WORDS = [
  { text: 'தமிழ்', top: '6%', left: '2%', size: 'clamp(2.8rem, 7vw, 4.8rem)', rotate: '-10deg' },
  { text: 'அறிவு', top: '18%', right: '4%', size: 'clamp(2.2rem, 5vw, 3.6rem)', rotate: '8deg' },
  { text: 'சொல்', top: '42%', left: '6%', size: 'clamp(3rem, 6vw, 4.2rem)', rotate: '-6deg' },
  { text: 'பொருள்', top: '28%', left: '38%', size: 'clamp(2.4rem, 5.5vw, 3.8rem)', rotate: '5deg' },
  { text: 'எழுத்து', bottom: '32%', right: '6%', size: 'clamp(2.6rem, 6vw, 4rem)', rotate: '-4deg' },
  { text: 'கற்றல்', top: '55%', right: '18%', size: 'clamp(2rem, 4.5vw, 3.2rem)', rotate: '12deg' },
  { text: 'மொழி', bottom: '18%', left: '10%', size: 'clamp(2.5rem, 5vw, 3.9rem)', rotate: '-7deg' },
  { text: 'நூல்', bottom: '8%', right: '12%', size: 'clamp(2.8rem, 6vw, 4rem)', rotate: '6deg' },
  { text: 'இலக்கணம்', top: '72%', left: '4%', size: 'clamp(1.6rem, 3.5vw, 2.4rem)', rotate: '4deg' },
  { text: 'பாடம்', top: '10%', left: '48%', size: 'clamp(2rem, 4vw, 2.8rem)', rotate: '-5deg' },
];

const LearningWindow = ({ onNavigateBack, onNavigate }) => {
  const windows = [
    {
      id: 'practice',
      title: 'Practice Window',
      description: 'Refine your core skills with adaptive daily drills and pronunciation checks.',
      icon: <Dumbbell size={24} />,
      color: '#8B4513',
      bgType: 'accent-1'
    },
    {
      id: 'builder',
      title: 'Semantic Builder',
      description: 'Master Tamil syntax by constructing complex sentences from simple concepts.',
      icon: <PenTool size={24} />,
      color: '#065F46',
      bgType: 'accent-2'
    },
    {
      id: 'ai',
      title: 'Explainable AI',
      description: 'Deep-dive into grammar logic with our real-time AI tutor that knows why.',
      icon: <Brain size={24} />,
      color: '#6D28D9',
      bgType: 'accent-3'
    },
    {
      id: 'variation',
      title: 'Context Variation',
      description: 'Learn how meaning shifts in formal, informal, and poetic Tamil settings.',
      icon: <GitBranch size={24} />,
      color: '#D97706',
      bgType: 'accent-4'
    },
    {
      id: 'semantic',
      title: 'Semantic Web',
      description: 'Visualize connections between root words and their diverse derivatives.',
      icon: <Share2 size={24} />,
      color: '#991B1B',
      bgType: 'accent-5'
    },
    {
      id: 'voice',
      title: 'Voice Based Learning',
      description: 'Master pronunciation and conversational Tamil with real-time feedback.',
      icon: <Mic size={24} />,
      color: '#EA580C',
      bgType: 'accent-6'
    }
  ];

  return (
    <div className="learning-window-page">
      <div className="bg-tamil-words" aria-hidden>
        {BG_TAMIL_WORDS.map((item, i) => (
          <span
            key={`${item.text}-${i}`}
            className="bg-tamil-word"
            style={{
              top: item.top,
              left: item.left,
              right: item.right,
              bottom: item.bottom,
              fontSize: item.size,
              transform: `rotate(${item.rotate})`,
            }}
          >
            {item.text}
          </span>
        ))}
      </div>

      <div className="learning-window-foreground">
        <PageBackNav title="Learning Window" onBack={onNavigateBack} />

        <main className="window-content">
        <h1 className="section-title">
          <span className="title-bar"></span>
          Select Your Window
        </h1>

        <div className="window-grid">
          {windows.map((win) => (
            <div 
              key={win.id} 
              className="window-card"
              onClick={() => {
                const routeMap = {
                  'practice': 'practice',
                  'builder': 'builder',
                  'ai': 'ai',
                  'variation': 'variation',
                  'semantic': 'web',
                  'voice': 'voice'
                };
                if (routeMap[win.id]) onNavigate(routeMap[win.id]);
              }}
            >
              <div className="card-top">
                <div className="icon-container" style={{ backgroundColor: win.color }}>
                  {win.icon}
                </div>
              </div>
              <div className="card-body">
                <h3>{win.title}</h3>
                <p>{win.description}</p>
              </div>
              <div className="card-footer">
                <ChevronRight size={20} className="arrow-icon" style={{ color: win.color }} />
              </div>
              <div className={`decorative-circle ${win.bgType}`}></div>
            </div>
          ))}
        </div>
      </main>
      </div>

      <style>{`
        .learning-window-page {
          min-height: 100vh;
          padding: 40px 80px;
          position: relative;
          overflow-x: hidden;
        }

        .bg-tamil-words {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }

        .bg-tamil-word {
          position: absolute;
          font-family: var(--font-tamil);
          font-weight: 800;
          color: rgba(74, 44, 0, 0.07);
          line-height: 1;
          user-select: none;
          white-space: nowrap;
        }

        .learning-window-foreground {
          position: relative;
          z-index: 1;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 16px;
          font-size: 2rem;
          font-weight: 800;
          margin-bottom: 48px;
          color: var(--primary-brown);
        }

        .title-bar {
          width: 6px;
          height: 36px;
          background: #8B4513;
          border-radius: 3px;
        }

        .window-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 32px;
        }

        .window-card {
          background: #FFF9F5;
          border-radius: 32px;
          padding: 32px;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          gap: 20px;
          border: 1px solid rgba(139, 69, 19, 0.05);
          transition: var(--transition);
          cursor: pointer;
        }

        .window-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(139, 69, 19, 0.06);
          background: #FFFFFF;
        }

        .icon-container {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          margin-bottom: 8px;
        }

        .card-body h3 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 12px;
          color: var(--primary-brown);
        }

        .card-body p {
          font-size: 1rem;
          line-height: 1.6;
          color: #5C3317;
          opacity: 0.7;
          max-width: 260px;
        }

        .card-footer {
          margin-top: auto;
          display: flex;
          justify-content: flex-end;
        }

        .decorative-circle {
          position: absolute;
          top: -20px;
          right: -20px;
          width: 120px;
          height: 120px;
          border-radius: 50%;
          z-index: 0;
          opacity: 0.5;
        }

        .accent-1 { background: #FEF3C7; opacity: 0.3; transform: scale(1.2) translate(10%, -10%); }
        .accent-2 { background: #D1FAE5; opacity: 0.3; transform: scale(1.2) translate(10%, -10%); }
        .accent-3 { background: #EDE9FE; opacity: 0.3; transform: scale(1.2) translate(10%, -10%); }
        .accent-4 { background: #FFEDD5; opacity: 0.3; transform: scale(1.2) translate(10%, -10%); }
        .accent-5 { background: #FEE2E2; opacity: 0.3; transform: scale(1.2) translate(10%, -10%); }
        .accent-6 { background: #FFEDD5; opacity: 0.3; transform: scale(1.2) translate(10%, -10%); }

        @media (max-width: 768px) {
          .learning-window-page {
            padding: 20px;
          }
          .window-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default LearningWindow;
