import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './LexiMascot.css';

/**
 * LexiMascot – The AI Tutor companion for LexiSense.
 *
 * Props:
 *  - mood:    'idle' | 'happy' | 'thinking' | 'sad'  (controls expression)
 *  - message: string | null  (speech bubble text)
 *  - position: 'bottom-right' | 'bottom-left' | 'inline'
 *  - scale: number (default 0.7)
 *  - onClick: function
 */
const TIPS = [
  'Try building a 3-word sentence! 🏗️',
  'Tamil has 247 letters in its script!',
  '"திங்கள்" means Moon AND Monday 🌙',
  'Drag tokens to form meaningful phrases!',
  'Great job! Keep your streak going! 🔥',
  'Swipe through contexts to understand nuance!',
  'Did you know "மாலை" means both Evening and Garland?',
  'Practice daily for best results! 📚',
];

const LexiMascot = ({
  mood = 'idle',
  message = null,
  position = 'bottom-right',
  scale = 0.7,
  onClick,
  autoTips = false,
  tipInterval = 12000,
}) => {
  const [currentTip, setCurrentTip] = useState(null);
  const [showBubble, setShowBubble] = useState(false);

  // Show message from props
  useEffect(() => {
    if (message) {
      setCurrentTip(message);
      setShowBubble(true);
      const timer = setTimeout(() => setShowBubble(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Auto-tips cycle
  useEffect(() => {
    if (!autoTips) return;
    const showTip = () => {
      const tip = TIPS[Math.floor(Math.random() * TIPS.length)];
      setCurrentTip(tip);
      setShowBubble(true);
      setTimeout(() => setShowBubble(false), 4000);
    };
    const interval = setInterval(showTip, tipInterval);
    // Show first tip after 3 seconds
    const firstTimer = setTimeout(showTip, 3000);
    return () => { clearInterval(interval); clearTimeout(firstTimer); };
  }, [autoTips, tipInterval]);

  const positionStyle =
    position === 'bottom-right'
      ? { position: 'fixed', bottom: '24px', right: '24px', zIndex: 999 }
      : position === 'bottom-left'
      ? { position: 'fixed', bottom: '24px', left: '24px', zIndex: 999 }
      : {};

  return (
    <motion.div
      className="lexi-mascot-wrapper"
      style={{ ...positionStyle, '--mascot-scale': scale }}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.5 }}
      onClick={onClick}
    >
      {/* Speech Bubble */}
      <AnimatePresence>
        {showBubble && currentTip && (
          <motion.div
            className="mascot-speech-bubble"
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            {currentTip}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mascot Character */}
      <div className={`scor ${mood}`}>
        <div className="scor-head">
          <div className="scor-face">
            <div className="scor-eye scor-eye-left"></div>
            <div className="scor-eye scor-eye-right"></div>
            <div className="scor-face-lower">
              <div className="scor-nose"></div>
              <div className="scor-mouth">
                <div className="scor-mouth-outer"></div>
                <div className="scor-mouth-inner"></div>
              </div>
              <div className="scor-mouth-line"></div>
            </div>
            <div className="scor-blush scor-blush-left"></div>
            <div className="scor-blush scor-blush-right"></div>
          </div>
          <div className="scor-face-fluff scor-face-fluff-left"></div>
          <div className="scor-face-fluff scor-face-fluff-right"></div>
          <div className="scor-ear scor-ear-left"></div>
          <div className="scor-ear-right-wrap">
            <div className="scor-ear scor-ear-right"></div>
            <div className="scor-ear-right-fluff"></div>
          </div>
        </div>
        <div className="scor-body">
          <div className="scor-tail"></div>
          <div className="scor-torso"></div>
          <div className="scor-neck"></div>
          <div className="scor-arm scor-arm-left"></div>
          <div className="scor-arm scor-arm-right"></div>
          <div className="scor-leg scor-leg-left">
            <div className="scor-leg-foot">
              <div className="scor-leg-foot-pad"></div>
            </div>
          </div>
          <div className="scor-leg scor-leg-right">
            <div className="scor-leg-foot">
              <div className="scor-leg-foot-pad"></div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LexiMascot;
