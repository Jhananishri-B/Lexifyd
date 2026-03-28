import React, { useState } from 'react';
import { ChevronRight, Flame, Zap, Trophy, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import PageBackNav from '../components/PageBackNav';
import LexiMascot from '../components/LexiMascot';

const CORRECT_ANSWERS = ['B', 'B', 'B', 'B', 'C'];

const MASCOT_MESSAGES = {
  correct: ['நல்லது! Amazing! 🎉', 'You got it! +20 XP ⚡', 'Brilliant work! 🌟', 'Perfect answer! 🏆'],
  wrong: ['Not quite! Try next one 💪', 'Keep going, you\'ll get it!', 'Almost! Don\'t give up! 🔥'],
  start: 'Pick the right answer! 🤔',
  finish: 'You completed the round! 🎊',
};

const QUESTIONS = [
  {
    id: 1, topic: 'Polysemy (பலபொருள்)',
    tamil: '"திங்கள்" என்ற சொல் தமிழில் பொதுவாக எந்த பொருள்களைக் குறிக்கும்?',
    english: 'Which meanings does the Tamil word "திங்கள்" (thingal) commonly carry?',
    options: [
      { label: 'A', text: 'சூரியன் மற்றும் சமயம்' },
      { label: 'B', text: 'நிலவு மற்றும் திங்கட்கிழமை' },
      { label: 'C', text: 'மழை மற்றும் மலை' },
      { label: 'D', text: 'புத்தகம் மற்றும் எழுத்து' },
    ],
  },
  {
    id: 2, topic: 'Polysemy (பலபொருள்)',
    tamil: '"மாலை" என்ற ஒரே எழுத்துருப் படியமைப்பில் எந்த இரண்டு வேறுபட்ட கருத்துகள் அமைகின்றன?',
    english: 'Which two distinct senses are commonly associated with the same written form "மாலை"?',
    options: [
      { label: 'A', text: 'காலை மற்றும் இரவு' },
      { label: 'B', text: 'மாலை நேரம் மற்றும் மலர் மாலை' },
      { label: 'C', text: 'நிலா மற்றும் வாரம்' },
      { label: 'D', text: 'காற்று மற்றும் நீர்' },
    ],
  },
  {
    id: 3, topic: 'Polysemy (பலபொருள்)',
    tamil: 'ஒரே சொல் பல தரப்பட்ட ஆனால் தொடர்புடைய பொருள்களைக் கொண்டிருப்பது எது?',
    english: 'What is it called when one word carries several related shades of meaning?',
    options: [
      { label: 'A', text: 'இருமொழி (Bilingualism)' },
      { label: 'B', text: 'பலபொருள் / Polysemy' },
      { label: 'C', text: 'ஒலியியல் மாற்றம்' },
      { label: 'D', text: 'வினைச்சொல் மட்டும்' },
    ],
  },
  {
    id: 4, topic: 'Polysemy (பலபொருள்)',
    tamil: 'சாகித्यத்தில் "திங்கள்" சில சூழல்களில் எந்த கால இடைவெளியையும் சுட்டும்?',
    english: 'In some classical contexts, "திங்கள்" can also evoke which kind of time span?',
    options: [
      { label: 'A', text: 'ஒரு நாள் மட்டும்' },
      { label: 'B', text: 'நிலவு முறை / மாத அளவு' },
      { label: 'C', text: 'ஒரு நிமிடம்' },
      { label: 'D', text: 'ஒரு நூற்றாண்டு' },
    ],
  },
  {
    id: 5, topic: 'Polysemy (பலபொருள்)',
    tamil: '"சங்கம்" என்ற சொல் தமிழில் எந்த வகையான பொருள் இணைப்புகளைக் காட்டுகிறது?',
    english: 'The word "சங்கம்" illustrates polysemy by linking which kinds of senses?',
    options: [
      { label: 'A', text: 'மீன் மற்றும் காற்று' },
      { label: 'B', text: 'கோபுரம் மட்டும்' },
      { label: 'C', text: 'சங்கு (கைப்பு) மற்றும் இலக்கிய அமைப்பு' },
      { label: 'D', text: 'எண் மற்றும் நிறம்' },
    ],
  },
];

const PracticeWindow = ({ onNavigateBack }) => {
  const steps = [1, 2, 3, 4, 5];
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedLabel, setSelectedLabel] = useState(null);
  const [finished, setFinished] = useState(false);
  const [answerState, setAnswerState] = useState('idle'); // idle, correct, wrong
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [mascotMood, setMascotMood] = useState('idle');
  const [mascotMsg, setMascotMsg] = useState(MASCOT_MESSAGES.start);
  const [correctCount, setCorrectCount] = useState(0);

  const currentQuestion = QUESTIONS[currentStep - 1];
  const progressFill = `${(currentStep / 5) * 100}%`;

  const handleSubmitAnswer = () => {
    if (!selectedLabel) return;
    const isCorrect = selectedLabel === CORRECT_ANSWERS[currentStep - 1];

    if (isCorrect) {
      setAnswerState('correct');
      setXp(prev => prev + 20);
      setStreak(prev => prev + 1);
      setCorrectCount(prev => prev + 1);
      setMascotMood('happy');
      setMascotMsg(MASCOT_MESSAGES.correct[Math.floor(Math.random() * MASCOT_MESSAGES.correct.length)]);
      confetti({ particleCount: 60, spread: 50, origin: { y: 0.7 }, colors: ['#4ADE80', '#FBBF24', '#8B4513'] });
    } else {
      setAnswerState('wrong');
      setStreak(0);
      setMascotMood('sad');
      setMascotMsg(MASCOT_MESSAGES.wrong[Math.floor(Math.random() * MASCOT_MESSAGES.wrong.length)]);
    }

    setTimeout(() => {
      setAnswerState('idle');
      setMascotMood('idle');
      if (currentStep < 5) {
        setCurrentStep(s => s + 1);
        setSelectedLabel(null);
      } else {
        setFinished(true);
        setMascotMood('happy');
        setMascotMsg(MASCOT_MESSAGES.finish);
        confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 }, colors: ['#4ADE80', '#FBBF24', '#8B4513', '#F97316'] });
      }
    }, 1200);
  };

  const handlePracticeAgain = () => {
    setCurrentStep(1);
    setSelectedLabel(null);
    setFinished(false);
    setAnswerState('idle');
    setCorrectCount(0);
    setMascotMood('idle');
    setMascotMsg(MASCOT_MESSAGES.start);
  };

  return (
    <div className="practice-window-page">
      <aside className="progress-sidebar">
        <p className="sidebar-label">PROGRESS</p>
        <div className="step-list">
          {steps.map((s) => (
            <motion.div
              key={s}
              animate={s === currentStep && !finished ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.4 }}
              className={`step-circle ${s === currentStep && !finished ? 'active' : ''} ${s < currentStep || finished ? 'done' : ''}`}
            >
              {s < currentStep || finished ? '✓' : s}
            </motion.div>
          ))}
        </div>
        {/* XP Counter */}
        <div className="xp-counter">
          <Zap size={16} color="#F59E0B" />
          <span>{xp} XP</span>
        </div>
        {/* Streak */}
        <div className="streak-counter">
          <Flame size={16} color={streak > 0 ? '#F97316' : '#A8A29E'} />
          <span style={{ color: streak > 0 ? '#F97316' : '#A8A29E' }}>{streak}</span>
        </div>
        <div className="vertical-bar-container">
          <motion.div
            className="bar-fill"
            animate={{ height: finished ? '100%' : progressFill }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </aside>

      <main className="practice-content">
        <PageBackNav title="Practice Window" onBack={onNavigateBack} />

        <div className="questions-container">
          <AnimatePresence mode="wait">
            {finished ? (
              <motion.div
                key="complete"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="completion-card"
              >
                <div className="trophy-icon">
                  <Trophy size={48} color="#F59E0B" />
                </div>
                <h2 className="completion-title">Practice Round Complete! 🎉</h2>
                <div className="score-summary">
                  <div className="score-item">
                    <Star size={20} color="#F59E0B" />
                    <span>{correctCount}/5 Correct</span>
                  </div>
                  <div className="score-item">
                    <Zap size={20} color="#F59E0B" />
                    <span>{xp} XP Earned</span>
                  </div>
                </div>
                <p className="completion-text">
                  You have worked through five polysemy prompts. Run the set again
                  any time to reinforce how one Tamil form can carry several
                  related meanings.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  className="btn-primary again-btn"
                  onClick={handlePracticeAgain}
                >
                  Practice again
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.35 }}
                className="question-block"
              >
                <p className="step-meta">
                  Question {currentStep} of {QUESTIONS.length}
                </p>
                <motion.div
                  animate={answerState === 'wrong' ? { x: [-8, 8, -8, 8, 0] } : {}}
                  transition={{ duration: 0.4 }}
                  className={`question-card ${answerState}`}
                >
                  <div className="card-header">
                    <span className="question-badge">
                      QUESTION {currentQuestion.id}
                    </span>
                    <span className="topic-text">{currentQuestion.topic}</span>
                  </div>
                  <h2 className="tamil-text">{currentQuestion.tamil}</h2>
                  <p className="english-text">{currentQuestion.english}</p>
                </motion.div>

                <div className="options-grid">
                  {currentQuestion.options.map((opt) => (
                    <motion.button
                      key={opt.label}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      disabled={answerState !== 'idle'}
                      className={`option-btn ${selectedLabel === opt.label ? 'option-btn--selected' : ''} ${
                        answerState !== 'idle' && opt.label === CORRECT_ANSWERS[currentStep - 1] ? 'option-btn--correct' : ''
                      } ${
                        answerState === 'wrong' && selectedLabel === opt.label ? 'option-btn--wrong' : ''
                      }`}
                      onClick={() => setSelectedLabel(opt.label)}
                    >
                      <span className="opt-label">{opt.label}</span>
                      <span className="opt-text">{opt.text}</span>
                    </motion.button>
                  ))}
                </div>

                {/* XP Reward Toast */}
                <AnimatePresence>
                  {answerState === 'correct' && (
                    <motion.div
                      className="xp-toast"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <Zap size={20} /> +20 XP
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="question-actions">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    className="btn-next"
                    onClick={handleSubmitAnswer}
                    disabled={!selectedLabel || answerState !== 'idle'}
                  >
                    {currentStep === 5 ? 'Finish' : 'Check Answer'}
                    <ChevronRight size={20} />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* AI Tutor Mascot */}
        <LexiMascot
          mood={mascotMood}
          message={mascotMsg}
          position="bottom-right"
          scale={0.65}
        />
      </main>

      <style jsx>{`
        .practice-window-page { display: flex; min-height: 100vh; }
        .progress-sidebar { width: 100px; background: rgba(255, 255, 255, 0.5); backdrop-filter: blur(10px); display: flex; flex-direction: column; align-items: center; padding: 60px 0; position: fixed; height: 100vh; border-right: 1px solid rgba(0,0,0,0.03); }
        .sidebar-label { font-size: 0.65rem; font-weight: 800; color: #22C55E; letter-spacing: 1.5px; margin-bottom: 40px; }
        .step-list { display: flex; flex-direction: column; gap: 20px; margin-bottom: 24px; }
        .step-circle { width: 32px; height: 32px; border-radius: 50%; border: 1px solid #E5E7EB; display: flex; align-items: center; justify-content: center; font-weight: 700; background: #FFF9F5; color: #5C3317; font-size: 0.85rem; transition: var(--transition); }
        .step-circle.active { background: #22C55E; color: white; border-color: #22C55E; box-shadow: 0 0 12px rgba(34, 197, 94, 0.4); }
        .step-circle.done { background: #DCFCE7; color: #166534; border-color: #86EFAC; }

        .xp-counter { display: flex; align-items: center; gap: 6px; background: #FEF3C7; padding: 6px 12px; border-radius: 20px; font-weight: 800; font-size: 0.8rem; color: #92400E; margin-bottom: 12px; }
        .streak-counter { display: flex; align-items: center; gap: 4px; font-weight: 800; font-size: 0.9rem; margin-bottom: auto; }

        .vertical-bar-container { width: 4px; height: 80px; background: #E5E7EB; border-radius: 2px; position: relative; overflow: hidden; }
        .bar-fill { position: absolute; bottom: 0; left: 0; width: 100%; background: #22C55E; }
        .practice-content { flex: 1; margin-left: 100px; padding: 40px 8% 48px; position: relative; }
        .questions-container { display: flex; flex-direction: column; max-width: 720px; margin: 0 auto; width: 100%; }
        .step-meta { font-size: 0.8rem; font-weight: 700; color: #5C3317; opacity: 0.65; margin-bottom: 16px; letter-spacing: 0.04em; text-transform: uppercase; }
        .question-block { display: flex; flex-direction: column; gap: 28px; align-items: stretch; position: relative; }
        .question-card { background: #FFEEDD; padding: 32px 36px; border-radius: 32px; position: relative; text-align: left; border: 3px solid transparent; transition: border-color 0.3s, background 0.3s; }
        .question-card.correct { border-color: #4ADE80; background: #F0FDF4; }
        .question-card.wrong { border-color: #EF4444; background: #FEF2F2; }
        .card-header { display: flex; align-items: center; flex-wrap: wrap; gap: 12px 16px; margin-bottom: 20px; }
        .question-badge { background: #4B2C00; color: white; font-size: 0.65rem; font-weight: 800; padding: 6px 12px; border-radius: 30px; letter-spacing: 0.5px; }
        .topic-text { font-size: 0.88rem; color: #5C3317; opacity: 0.65; font-weight: 600; line-height: 1.3; }
        .tamil-text { font-family: var(--font-tamil); font-size: 1.28rem; font-weight: 600; line-height: 1.55; margin: 0 0 14px; color: var(--primary-brown); max-width: 62ch; }
        .english-text { font-size: 1rem; color: #5C3317; opacity: 0.75; font-style: italic; line-height: 1.5; margin: 0; max-width: 58ch; }
        .options-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; width: 100%; }
        @media (max-width: 640px) { .options-grid { grid-template-columns: 1fr; } }
        .option-btn { background: white; border: 2px solid transparent; padding: 18px 20px; border-radius: 22px; display: flex; align-items: flex-start; gap: 14px; font-family: inherit; cursor: pointer; transition: var(--transition); box-shadow: 0 4px 12px rgba(0,0,0,0.04); text-align: left; width: 100%; min-height: 72px; }
        .option-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.06); border-color: rgba(139, 69, 19, 0.15); }
        .option-btn:disabled { cursor: default; }
        .option-btn--selected { border-color: #8B4513; background: #FFF9F5; box-shadow: 0 4px 16px rgba(139, 69, 19, 0.12); }
        .option-btn--correct { border-color: #4ADE80 !important; background: #F0FDF4 !important; box-shadow: 0 4px 16px rgba(74, 222, 128, 0.2) !important; }
        .option-btn--correct .opt-label { background: #22C55E !important; color: white !important; }
        .option-btn--wrong { border-color: #EF4444 !important; background: #FEF2F2 !important; }
        .option-btn--wrong .opt-label { background: #EF4444 !important; color: white !important; }
        .opt-label { flex-shrink: 0; width: 34px; height: 34px; background: #FFEEDD; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; color: #5C3317; font-size: 0.8rem; margin-top: 2px; transition: 0.3s; }
        .option-btn--selected .opt-label { background: #8B4513; color: white; }
        .opt-text { font-size: 1.05rem; font-weight: 600; color: var(--primary-brown); line-height: 1.45; font-family: var(--font-tamil), var(--font-body), sans-serif; }

        .xp-toast { position: absolute; top: -20px; right: 20px; background: #FEF3C7; color: #92400E; padding: 8px 16px; border-radius: 20px; font-weight: 800; font-size: 1rem; display: flex; align-items: center; gap: 6px; box-shadow: 0 8px 20px rgba(245, 158, 11, 0.2); z-index: 20; }

        .question-actions { display: flex; justify-content: flex-end; margin-top: 8px; }
        .btn-next { display: inline-flex; align-items: center; gap: 8px; padding: 14px 24px; border-radius: 100px; border: none; background: linear-gradient(180deg, #8B4513 0%, #5C3317 100%); color: white; font-family: var(--font-main); font-weight: 700; font-size: 1rem; cursor: pointer; transition: var(--transition); }
        .btn-next:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(92, 51, 23, 0.25); }
        .btn-next:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }

        .completion-card { background: #FFF9F5; border-radius: 32px; padding: 40px; text-align: center; border: 1px solid rgba(139, 69, 19, 0.08); }
        .trophy-icon { margin-bottom: 20px; }
        .completion-title { font-size: 1.5rem; font-weight: 800; color: var(--primary-brown); margin-bottom: 20px; }
        .score-summary { display: flex; justify-content: center; gap: 24px; margin-bottom: 20px; }
        .score-item { display: flex; align-items: center; gap: 8px; font-weight: 800; color: #92400E; font-size: 1rem; background: #FEF3C7; padding: 8px 16px; border-radius: 20px; }
        .completion-text { font-size: 1rem; color: #5C3317; opacity: 0.8; line-height: 1.6; margin-bottom: 28px; max-width: 48ch; margin-left: auto; margin-right: auto; }
        .again-btn { margin: 0 auto; justify-content: center; }
      `}</style>
    </div>
  );
};

export default PracticeWindow;
