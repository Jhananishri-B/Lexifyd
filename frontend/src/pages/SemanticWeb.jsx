import React from 'react';
import { Search, Moon, Calendar, History, TrendingUp, BookOpen, Layers, Library } from 'lucide-react';
import PageBackNav from '../components/PageBackNav';

const SemanticWeb = ({ onNavigateBack }) => {
  return (
    <div className="semantic-web-page">
      <PageBackNav
        title="Semantic Web"
        onBack={onNavigateBack}
        trailing={
          <div className="web-header-trailing">
            <nav className="header-nav">
              <span className="active">Explore</span>
              <span>Dictionary</span>
              <span>Library</span>
            </nav>
            <div className="profile-icon">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jane" alt="profile" />
            </div>
          </div>
        }
      />

      <main className="web-container">
        {/* Large Watermark */}
        <div className="bg-watermark">தி</div>

        <div className="search-section">
          <div className="search-bar">
            <Search size={20} className="search-icon" />
            <input type="text" defaultValue="திங்கள்" />
            <button className="explore-btn">Explore</button>
          </div>
          <div className="trending-tags">
            <span className="label">Trending:</span>
            <span className="tag-pill">அன்பு (Love)</span>
            <span className="tag-pill">காலம் (Time)</span>
            <span className="tag-pill">ஆற்றல் (Energy)</span>
          </div>
        </div>

        <div className="radial-graph-area">
          {/* Central Node */}
          <div className="core-node">
            <h2>திங்கள்</h2>
            <p>THINGAL</p>
          </div>

          {/* Dotted Lines (Simplified with CSS) */}
          <div className="connector line-tl"></div>
          <div className="connector line-tr"></div>
          <div className="connector line-bl"></div>
          <div className="connector line-br"></div>

          {/* Connected Cards */}
          <div className="web-card tl">
            <div className="card-badge celestial">CELESTIAL</div>
            <div className="card-icon blue"><Moon size={20} fill="white" color="white" /></div>
            <h3>Moon</h3>
            <p>The natural satellite of Earth. Derived from the luminous quality of the night sky.</p>
            <span className="link-text">14 Synonyms →</span>
          </div>

          <div className="web-card tr">
            <div className="card-badge temporal">TEMPORAL</div>
            <div className="card-icon green"><Calendar size={20} fill="white" color="white" /></div>
            <h3>Monday</h3>
            <p>The second day of the week. In Tamil culture, Monday is often dedicated to Lord Shiva.</p>
            <span className="link-text">Usage Stats →</span>
          </div>

          <div className="web-card bl">
            <div className="card-badge etymology">ETYMOLOGY</div>
            <div className="card-icon orange"><History size={20} color="white" /></div>
            <h3>Month</h3>
            <p>Archaic usage referring to lunar cycles or monthly intervals in classical literature.</p>
          </div>

          <div className="web-card br">
            <div className="card-badge contextual">CONTEXTUAL MAP</div>
            <div className="card-meta">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="user" />
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka" alt="user" />
            </div>
            <div className="stat-row">
              <label>Poetry</label>
              <div className="progress-bar"><div className="fill" style={{ width: '80%' }}></div></div>
            </div>
            <div className="stat-row">
              <label>Scientific</label>
              <div className="progress-bar"><div className="fill green" style={{ width: '20%' }}></div></div>
            </div>
          </div>
        </div>

        <div className="bottom-sections">
          <div className="sentential-usage glass-card">
            <h3>Sentential Usage</h3>
            <div className="usage-item">
              <p className="tamil">திங்கள் வானத்தில் அழகாகத் தெரிகிறது.</p>
              <p className="english">"The moon looks beautiful in the sky."</p>
            </div>
            <div className="usage-item">
              <p className="tamil">திங்கள் கிழமை வேலைக்குச் செல்வேன்.</p>
              <p className="english">"I will go to work on Monday."</p>
            </div>
          </div>

          <div className="mastery-card">
            <span className="mastery-badge">MASTERY TIP</span>
            <h2>Polysemy in Tamil Script</h2>
            <p>One word can anchor multiple concepts. Master 'Thingal' to unlock 3 distinct conversation paths.</p>
            <button className="library-btn">Add to Library</button>
          </div>
        </div>
      </main>

      <style>{`
        .semantic-web-page { min-height: 100vh; padding: 24px 60px; position: relative; overflow-x: hidden; }
        .web-header-trailing { display: flex; align-items: center; gap: 24px; flex-wrap: wrap; justify-content: flex-end; }
        .header-nav { display: flex; gap: 24px; font-weight: 600; color: #5C3317; opacity: 0.6; }
        .header-nav .active { color: #4B2C00; opacity: 1; text-decoration: underline; text-underline-offset: 8px; text-decoration-color: #FBBF24; }
        .profile-icon { width: 40px; height: 40px; border-radius: 50%; background: #FEF3C7; overflow: hidden; }
        
        .web-container { max-width: 1200px; margin: 0 auto; position: relative; }
        .bg-watermark { position: absolute; top: 0; right: -100px; font-family: var(--font-tamil); font-size: 30rem; color: rgba(74, 44, 0, 0.02); font-weight: 800; z-index: 0; pointer-events: none; }

        .search-section { display: flex; flex-direction: column; align-items: center; gap: 16px; margin-bottom: 80px; position: relative; z-index: 10; }
        .search-bar { width: 600px; background: #FEF3C7; padding: 8px 8px 8px 24px; border-radius: 100px; display: flex; align-items: center; box-shadow: 0 10px 30px rgba(139, 69, 19, 0.05); }
        .search-bar input { flex: 1; border: none; background: transparent; font-family: var(--font-tamil); font-size: 1.2rem; font-weight: 700; color: #4B2C00; padding: 0 12px; }
        .search-bar input:focus { outline: none; }
        .explore-btn { background: #78350F; color: white; border: none; padding: 12px 24px; border-radius: 100px; font-weight: 700; cursor: pointer; }
        .trending-tags { display: flex; gap: 12px; align-items: center; font-size: 0.85rem; }
        .trending-tags .label { color: #9CA3AF; font-weight: 600; }
        .tag-pill { background: #FFEDD5; color: #78350F; padding: 6px 14px; border-radius: 20px; font-weight: 700; cursor: pointer; }

        .radial-graph-area { height: 600px; position: relative; display: flex; align-items: center; justify-content: center; margin-bottom: 80px; }
        .core-node { width: 220px; height: 140px; background: linear-gradient(135deg, #78350F 0%, #3E2211 100%); border-radius: 100px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: white; border: 4px solid #FBBF24; box-shadow: 0 20px 40px rgba(62, 34, 17, 0.2); z-index: 10; position: relative; }
        .core-node h2 { font-family: var(--font-tamil); font-size: 2.2rem; margin-bottom: 4px; }
        .core-node p { font-size: 0.9rem; font-weight: 700; opacity: 0.6; letter-spacing: 1px; }

        .connector { position: absolute; border-top: 2px dashed rgba(139, 69, 19, 0.1); width: 200px; z-index: 1; }
        .line-tl { top: 30%; left: 30%; transform: rotate(-30deg); }
        .line-tr { top: 30%; right: 30%; transform: rotate(30deg); }
        .line-bl { bottom: 30%; left: 30%; transform: rotate(30deg); }
        .line-br { bottom: 30%; right: 30%; transform: rotate(-30deg); }

        .web-card { position: absolute; width: 220px; background: white; padding: 20px; border-radius: 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.03); z-index: 5; transition: 0.3s; cursor: pointer; }
        .web-card:hover { transform: translateY(-5px); box-shadow: 0 15px 40px rgba(0,0,0,0.06); }
        .tl { top: 50px; left: 100px; background: #FFF9F5; }
        .tr { top: 50px; right: 100px; background: #FCFAF2; }
        .bl { bottom: 50px; left: 150px; background: #FFFAF0; }
        .br { bottom: 80px; right: 150px; background: #FAF7F2; width: 240px; }

        .card-badge { font-size: 0.6rem; font-weight: 800; opacity: 0.5; letter-spacing: 1px; margin-bottom: 12px; }
        .card-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 12px; }
        .card-icon.blue { background: #8B5CF6; }
        .card-icon.green { background: #22C55E; }
        .card-icon.orange { background: #F59E0B; }
        
        .web-card h3 { font-size: 1.2rem; font-weight: 800; color: #4B2C00; margin-bottom: 8px; }
        .web-card p { font-size: 0.8rem; line-height: 1.5; color: #5C3317; opacity: 0.7; font-weight: 600; }
        .link-text { display: block; margin-top: 12px; font-size: 0.8rem; font-weight: 700; color: #4B2C00; }

        .card-meta { display: flex; gap: -8px; margin-bottom: 16px; }
        .card-meta img { width: 28px; height: 28px; border-radius: 50%; border: 2px solid white; margin-right: -8px; }
        .stat-row { margin-bottom: 12px; }
        .stat-row label { display: block; font-size: 0.75rem; font-weight: 700; margin-bottom: 6px; }
        .progress-bar { height: 6px; background: #E5E7EB; border-radius: 10px; overflow: hidden; }
        .progress-bar .fill { height: 100%; background: #78350F; border-radius: 10px; }
        .progress-bar .fill.green { background: #22C55E; }

        .bottom-sections { display: grid; grid-template-columns: 1fr 340px; gap: 40px; z-index: 10; position: relative; }
        .sentential-usage { background: rgba(255, 255, 255, 0.5); padding: 40px; border-radius: 40px; }
        .sentential-usage h3 { font-size: 1.8rem; color: #4B2C00; margin-bottom: 24px; }
        .usage-item { background: white; padding: 24px; border-radius: 20px; margin-bottom: 16px; border-left: 6px solid #B45309; }
        .usage-item .tamil { font-family: var(--font-tamil); font-size: 1.2rem; font-weight: 700; margin-bottom: 4px; }
        .usage-item .english { color: #9CA3AF; font-size: 0.9rem; font-style: italic; font-weight: 600; }

        .mastery-card { background: #78350F; border-radius: 40px; padding: 40px; color: white; display: flex; flex-direction: column; gap: 16px; box-shadow: 0 20px 50px rgba(120, 53, 15, 0.2); }
        .mastery-badge { background: #A16207; padding: 4px 10px; border-radius: 6px; font-size: 0.65rem; font-weight: 800; width: fit-content; }
        .mastery-card h2 { font-size: 1.5rem; font-weight: 800; }
        .mastery-card p { font-size: 0.95rem; opacity: 0.8; line-height: 1.5; }
        .library-btn { background: white; color: #78350F; border: none; padding: 16px; border-radius: 100px; font-weight: 800; margin-top: auto; cursor: pointer; }
      `}</style>
    </div>
  );
};

export default SemanticWeb;
