import React, { useState } from 'react';
import { Search, Moon, Calendar, History, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import PageBackNav from '../components/PageBackNav';
import LexiMascot from '../components/LexiMascot';

const SemanticWeb = ({ onNavigateBack }) => {
  const [hoveredNode, setHoveredNode] = useState(null);

  // Animation variants for floating effect
  const floatingAnimation = {
    y: [-5, 5, -5],
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
  };

  const drawLine = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { pathLength: 1, opacity: 0.3, transition: { duration: 1.5, ease: "easeOut" } }
  };

  return (
    <div className="semantic-web-page">
      <PageBackNav title="Semantic Web" onBack={onNavigateBack} />

      <main className="web-container">
        <div className="search-section">
          <div className="search-bar">
            <Search size={22} color="#8B4513" />
            <input type="text" defaultValue="திங்கள்" />
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="explore-btn">Analyze</motion.button>
          </div>
        </div>

        <div className="graph-arena">
          {/* Dynamic SVG Connectors */}
          <svg className="connector-svg" width="100%" height="100%" style={{ position: 'absolute', zIndex: 0 }}>
            <motion.line x1="50%" y1="50%" x2="25%" y2="25%" stroke="#8B4513" strokeWidth="3" strokeDasharray="8 8" variants={drawLine} initial="hidden" animate="visible" />
            <motion.line x1="50%" y1="50%" x2="75%" y2="25%" stroke="#8B4513" strokeWidth="3" strokeDasharray="8 8" variants={drawLine} initial="hidden" animate="visible" />
            <motion.line x1="50%" y1="50%" x2="30%" y2="75%" stroke="#8B4513" strokeWidth="3" strokeDasharray="8 8" variants={drawLine} initial="hidden" animate="visible" />
            <motion.line x1="50%" y1="50%" x2="75%" y2="75%" stroke="#8B4513" strokeWidth="3" strokeDasharray="8 8" variants={drawLine} initial="hidden" animate="visible" />
          </svg>

          {/* Central Core */}
          <motion.div
            className="core-node"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <h2>திங்கள்</h2>
            <p>THINGAL</p>
          </motion.div>

          {/* Satellite Nodes */}
          <motion.div
            className={`web-card tl ${hoveredNode && hoveredNode !== 'moon' ? 'dimmed' : ''}`}
            animate={floatingAnimation}
            onHoverStart={() => setHoveredNode('moon')}
            onHoverEnd={() => setHoveredNode(null)}
          >
            <div className="card-badge celestial">CELESTIAL</div>
            <div className="icon-wrapper blue"><Moon size={24} color="white" /></div>
            <h3>Moon</h3>
            <p>The natural satellite. Derived from luminous quality.</p>
          </motion.div>

          <motion.div
            className={`web-card tr ${hoveredNode && hoveredNode !== 'monday' ? 'dimmed' : ''}`}
            animate={{ ...floatingAnimation, transition: { ...floatingAnimation.transition, delay: 0.5 } }}
            onHoverStart={() => setHoveredNode('monday')}
            onHoverEnd={() => setHoveredNode(null)}
          >
            <div className="card-badge temporal">TEMPORAL</div>
            <div className="icon-wrapper green"><Calendar size={24} color="white" /></div>
            <h3>Monday</h3>
            <p>The second day of the week, dedicated to Shiva.</p>
          </motion.div>

          <motion.div
            className={`web-card bl ${hoveredNode && hoveredNode !== 'month' ? 'dimmed' : ''}`}
            animate={{ ...floatingAnimation, transition: { ...floatingAnimation.transition, delay: 1 } }}
            onHoverStart={() => setHoveredNode('month')}
            onHoverEnd={() => setHoveredNode(null)}
          >
            <div className="card-badge etymology">ETYMOLOGY</div>
            <div className="icon-wrapper orange"><History size={24} color="white" /></div>
            <h3>Month</h3>
            <p>Archaic usage referring to lunar cycles.</p>
          </motion.div>

          <motion.div
            className={`web-card br ${hoveredNode && hoveredNode !== 'context' ? 'dimmed' : ''}`}
            animate={{ ...floatingAnimation, transition: { ...floatingAnimation.transition, delay: 1.5 } }}
            onHoverStart={() => setHoveredNode('context')}
            onHoverEnd={() => setHoveredNode(null)}
          >
            <div className="card-badge contextual">USAGE STATS</div>
            <div className="icon-wrapper purple"><Activity size={24} color="white" /></div>
            <div className="stat-bars">
              <label>Poetry 80%</label>
              <div className="bar"><div className="fill" style={{ width: '80%' }}></div></div>
              <label>Science 20%</label>
              <div className="bar"><div className="fill green" style={{ width: '20%' }}></div></div>
            </div>
          </motion.div>
        </div>

        {/* AI Tutor Mascot */}
        <LexiMascot
          mood={hoveredNode ? 'thinking' : 'idle'}
          message={hoveredNode ? `Exploring "${hoveredNode}" meaning... 🔍` : null}
          position="bottom-right"
          scale={0.6}
          autoTips
          tipInterval={18000}
        />
      </main>

      <style jsx>{`
        .semantic-web-page { min-height: 100vh; padding: 40px; background: #FFFAF5; overflow: hidden; }
        .web-container { max-width: 1200px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; }
        
        .search-section { z-index: 20; margin-bottom: 60px; }
        .search-bar { background: white; padding: 12px 12px 12px 24px; border-radius: 100px; display: flex; align-items: center; box-shadow: 0 20px 50px rgba(139, 69, 19, 0.1); width: 600px; border: 2px solid rgba(139, 69, 19, 0.1); }
        .search-bar input { flex: 1; border: none; font-family: var(--font-tamil); font-size: 1.4rem; font-weight: 800; color: #4B2C00; outline: none; margin-left: 16px; }
        .explore-btn { background: #8B4513; color: white; padding: 14px 32px; border-radius: 100px; font-weight: 800; border: none; cursor: pointer; font-size: 1.1rem; }

        .graph-arena { position: relative; width: 1000px; height: 600px; display: flex; align-items: center; justify-content: center; }
        
        .core-node { width: 200px; height: 200px; background: linear-gradient(135deg, #8B4513, #4A2C00); border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; color: white; border: 8px solid #FEF3C7; box-shadow: 0 30px 60px rgba(74, 44, 0, 0.3); z-index: 10; cursor: pointer; }
        .core-node h2 { font-family: var(--font-tamil); font-size: 2.8rem; margin: 0; }
        .core-node p { font-weight: 800; opacity: 0.7; letter-spacing: 2px; font-size: 0.9rem; }

        .web-card { position: absolute; width: 280px; background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px); padding: 24px; border-radius: 32px; box-shadow: 0 20px 40px rgba(0,0,0,0.06); border: 1px solid rgba(255, 255, 255, 0.5); z-index: 5; transition: opacity 0.3s, filter 0.3s; cursor: pointer; }
        .web-card.dimmed { opacity: 0.4; filter: blur(2px); }
        
        .tl { top: 0; left: 0; }
        .tr { top: 0; right: 0; }
        .bl { bottom: 0; left: 50px; }
        .br { bottom: 0; right: 50px; }

        .card-badge { font-size: 0.7rem; font-weight: 800; letter-spacing: 1.5px; margin-bottom: 16px; opacity: 0.6; }
        .icon-wrapper { width: 48px; height: 48px; border-radius: 16px; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
        .blue { background: linear-gradient(135deg, #60A5FA, #3B82F6); }
        .green { background: linear-gradient(135deg, #4ADE80, #22C55E); }
        .orange { background: linear-gradient(135deg, #FBBF24, #F59E0B); }
        .purple { background: linear-gradient(135deg, #A78BFA, #8B5CF6); }

        .web-card h3 { font-size: 1.4rem; font-weight: 800; color: #4B2C00; margin-bottom: 8px; }
        .web-card p { font-size: 0.95rem; line-height: 1.5; color: #5C3317; font-weight: 600; opacity: 0.8; }
        
        .stat-bars label { display: block; font-size: 0.8rem; font-weight: 800; margin-top: 12px; margin-bottom: 4px; }
        .bar { height: 8px; background: #F3F4F6; border-radius: 10px; overflow: hidden; }
        .bar .fill { height: 100%; background: #8B4513; border-radius: 10px; }
        .bar .fill.green { background: #22C55E; }
      `}</style>
    </div>
  );
};

export default SemanticWeb;