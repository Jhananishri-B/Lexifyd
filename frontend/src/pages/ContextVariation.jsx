import React from 'react';
import { Search, Sun, Flower2, User } from 'lucide-react';
import PageBackNav from '../components/PageBackNav';
import LexiMascot from '../components/LexiMascot';

const ContextVariation = ({ onNavigateBack }) => {
  return (
    <div className="variation-page">
      <PageBackNav
        title="Context Variation"
        onBack={onNavigateBack}
        trailing={
          <div className="profile-pill">
            <User size={18} />
          </div>
        }
      />

      <main className="variation-container">
        {/* Title Section */}
        <div className="page-title-section">
          <h1>Context Variation</h1>
          <p>Explore how words shift meaning across different landscapes.</p>
        </div>

        {/* Search Bar */}
        <div className="search-section">
          <div className="search-bar glass-card">
            <Search size={20} className="search-icon" />
            <span className="lang-tag">A</span>
            <input type="text" defaultValue="மாலை" />
            <button className="analyze-btn">
              Analyze <Search size={16} />
            </button>
          </div>
        </div>

        {/* Comparison Cards */}
        <div className="comparison-grid">
          {/* Evening Card */}
          <div className="variation-card">
            <div className="card-header">
              <div className="icon-box orange">
                <Sun size={24} fill="white" color="white" />
              </div>
              <div className="header-text">
                <h3>மாலை</h3>
                <p>MAALAI • EVENING</p>
              </div>
            </div>

            <div className="sub-contexts">
              <div className="context-item formal">
                <span className="context-tag">FORMAL</span>
                <p className="tamil">மாலை நேரத்தில் சூரியன் மறையும்.</p>
                <p className="english">"The sun sets during the evening hours."</p>
              </div>
              <div className="context-item informal">
                <span className="context-tag">INFORMAL</span>
                <p className="tamil">சாயங்காலம் விளையாட வரயா?</p>
                <p className="english">"Coming to play this evening? (Colloquial use)"</p>
              </div>
            </div>
            <div className="bg-shape orange-shape"></div>
          </div>

          {/* Garland Card */}
          <div className="variation-card">
            <div className="card-header">
              <div className="icon-box purple">
                <Flower2 size={24} fill="white" color="white" />
              </div>
              <div className="header-text">
                <h3>மாலை</h3>
                <p>MAALAI • GARLAND</p>
              </div>
            </div>

            <div className="sub-contexts">
              <div className="context-item poetic">
                <span className="context-tag">POETIC</span>
                <p className="tamil">வாடாத மலர் மாலை சூடினாள் வஞ்சி.</p>
                <p className="english">"The maiden wore a garland of never-fading flowers."</p>
              </div>
              <div className="context-item ritual">
                <span className="context-tag">RITUAL</span>
                <p className="tamil">கோவிலில் சுவாமிக்கு மலர் மாலை சாத்தப்பட்டது.</p>
                <p className="english">"A flower garland was offered to the deity in the temple."</p>
              </div>
            </div>
            <div className="bg-shape purple-shape"></div>
          </div>
        </div>

        {/* Linguistic Insight Section */}
        <section className="insight-section">
          <div className="insight-content">
            <span className="insight-badge">LINGUISTIC INSIGHT</span>
            <h2>Polysemy in Classical Tamil</h2>
            <p>
              Tamil is rich with words like <span className="highlight-text">மாலை</span> where the context isn't just a physical meaning, but an emotional landscape (Thinai). In poetic tradition, 'Maalai' evokes longing and transition.
            </p>
          </div>
          <div className="insight-image">
            <img src="/garland.png" alt="Flower Garland" />
          </div>
        </section>

        {/* AI Tutor Mascot */}
        <LexiMascot
          mood="idle"
          position="bottom-right"
          scale={0.6}
          autoTips
          tipInterval={16000}
        />
      </main>

      <style jsx>{`
        .variation-page {
          min-height: 100vh;
          padding: 40px 80px;
          position: relative;
        }

        .profile-pill {
          width: 40px;
          height: 40px;
          background: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 10px rgba(0,0,0,0.05);
          color: #B45309;
        }

        .variation-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .page-title-section {
          margin-bottom: 40px;
        }

        .page-title-section h1 {
          font-size: 3rem;
          font-weight: 800;
          color: #4B2C00;
          margin-bottom: 8px;
        }

        .page-title-section p {
          font-size: 1.1rem;
          color: #5C3317;
          opacity: 0.7;
          font-weight: 600;
        }

        .search-section {
          margin-bottom: 60px;
          display: flex;
          justify-content: center;
        }

        .search-bar {
          width: 100%;
          max-width: 700px;
          display: flex;
          align-items: center;
          background: #FEF3C7;
          padding: 12px 12px 12px 24px;
          border-radius: 100px;
          box-shadow: 0 10px 30px rgba(180, 83, 9, 0.05);
        }

        .search-icon { color: #B45309; opacity: 0.5; margin-right: 12px; }

        .lang-tag {
          font-weight: 800;
          color: #B45309;
          margin-right: 12px;
          opacity: 0.8;
        }

        .search-bar input {
          flex: 1;
          background: transparent;
          border: none;
          font-size: 1.1rem;
          font-family: var(--font-tamil);
          color: #4B2C00;
          font-weight: 700;
        }

        .search-bar input:focus { outline: none; }

        .analyze-btn {
          background: #78350F;
          color: white;
          padding: 12px 24px;
          border-radius: 100px;
          border: none;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }

        .comparison-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          margin-bottom: 60px;
        }

        .variation-card {
           background: white;
           padding: 40px;
           border-radius: 40px;
           position: relative;
           overflow: hidden;
           box-shadow: 0 10px 40px rgba(0,0,0,0.03);
           display: flex;
           flex-direction: column;
           gap: 32px;
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .icon-box {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .icon-box.orange { background: #F59E0B; }
        .icon-box.purple { background: #8B5CF6; }

        .header-text h3 { font-size: 1.5rem; font-weight: 800; margin-bottom: 2px; }
        .header-text p { font-size: 0.85rem; font-weight: 700; color: #5C3317; opacity: 0.6; letter-spacing: 0.5px; }

        .sub-contexts {
          display: flex;
          flex-direction: column;
          gap: 24px;
          position: relative;
          z-index: 2;
        }

        .context-item {
          padding: 24px;
          border-radius: 24px;
          background: #FDF2F2;
        }

        .formal { background: #FFEDD5; border: 1px solid #FED7AA; }
        .informal { background: #FFFFFF; border: 1px solid #F3F4F6; }
        .poetic { background: #FFEDD5; border: 1px solid #FED7AA; } /* Colors based on screenshot */
        .ritual { background: #FFFFFF; border: 1px solid #F3F4F6; }

        .context-tag {
          font-size: 0.65rem;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 6px;
          margin-bottom: 12px;
          display: inline-block;
          color: white;
        }

        .formal .context-tag { background: #4B2C00; }
        .informal .context-tag { background: #166534; }
        .poetic .context-tag { background: #5B21B6; }
        .ritual .context-tag { background: #78350F; }

        .context-item .tamil {
          font-family: var(--font-tamil);
          font-size: 1.2rem;
          font-weight: 700;
          margin-bottom: 6px;
          color: #4B2C00;
        }

        .context-item .english {
          font-size: 0.95rem;
          font-style: italic;
          color: #5C3317;
          opacity: 0.7;
        }

        .bg-shape {
          position: absolute;
          top: -20px;
          right: -20px;
          width: 150px;
          height: 150px;
          border-radius: 50%;
          opacity: 0.15;
          z-index: 1;
        }

        .orange-shape { background: #F59E0B; }
        .purple-shape { background: #8B5CF6; }

        /* Insight Section */
        .insight-section {
          background: #3E2211;
          border-radius: 40px;
          padding: 48px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          align-items: center;
          color: white;
          overflow: hidden;
        }

        .insight-badge {
          background: #78350F;
          padding: 6px 14px;
          border-radius: 8px;
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.5px;
          margin-bottom: 16px;
          display: inline-block;
        }

        .insight-content h2 { font-size: 2.2rem; margin-bottom: 24px; font-weight: 800; }

        .insight-content p {
          font-size: 1.1rem;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.7);
          font-weight: 500;
        }

        .highlight-text { color: #F59E0B; font-weight: 700; font-family: var(--font-tamil); }

        .insight-image {
          height: 280px;
          border-radius: 32px;
          overflow: hidden;
        }

        .insight-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        @media (max-width: 900px) {
          .comparison-grid, .insight-section { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default ContextVariation;
