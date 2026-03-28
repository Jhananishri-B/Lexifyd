import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronRight, Loader2, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import PageBackNav from '../components/PageBackNav';
import LexiMascot from '../components/LexiMascot';
import { apiUrl } from '../config/api.js';

/** Used only if the API is unavailable; includes correctLabel for local scoring. */
const FALLBACK_QUESTIONS_FULL = [
  {
    id: 1,
    topic: 'Polysemy (பலபொருள்)',
    tamil: '"திங்கள்" என்ற சொல் தமிழில் பொதுவாக எந்த பொருள்களைக் குறிக்கும்?',
    english: 'Which meanings does the Tamil word "திங்கள்" (thingal) commonly carry?',
    options: [
      { label: 'A', text: 'சூரியன் மற்றும் சமயம்' },
      { label: 'B', text: 'நிலவு மற்றும் திங்கட்கிழமை' },
      { label: 'C', text: 'மழை மற்றும் மலை' },
      { label: 'D', text: 'புத்தகம் மற்றும் எழுத்து' },
    ],
    correctLabel: 'B',
  },
  {
    id: 2,
    topic: 'Polysemy (பலபொருள்)',
    tamil: '"மாலை" என்ற ஒரே எழுத்துருப் படியமைப்பில் எந்த இரண்டு வேறுபட்ட கருத்துகள் அமைகின்றன?',
    english:
      'Which two distinct senses are commonly associated with the same written form "மாலை"?',
    options: [
      { label: 'A', text: 'காலை மற்றும் இரவு' },
      { label: 'B', text: 'மாலை நேரம் மற்றும் மலர் மாலை' },
      { label: 'C', text: 'நிலா மற்றும் வாரம்' },
      { label: 'D', text: 'காற்று மற்றும் நீர்' },
    ],
    correctLabel: 'B',
  },
  {
    id: 3,
    topic: 'Polysemy (பலபொருள்)',
    tamil: 'ஒரே சொல் பல தரப்பட்ட ஆனால் தொடர்புடைய பொருள்களைக் கொண்டிருப்பது எது?',
    english: 'What is it called when one word carries several related shades of meaning?',
    options: [
      { label: 'A', text: 'இருமொழி (Bilingualism)' },
      { label: 'B', text: 'பலபொருள் / Polysemy' },
      { label: 'C', text: 'ஒலியியல் மாற்றம்' },
      { label: 'D', text: 'வினைச்சொல் மட்டும்' },
    ],
    correctLabel: 'B',
  },
  {
    id: 4,
    topic: 'Polysemy (பலபொருள்)',
    tamil:
      'சாகித்யத்தில் "திங்கள்" சில சூழல்களில் எந்த கால இடைவெளியையும் சுட்டும்?',
    english:
      'In some classical contexts, "திங்கள்" can also evoke which kind of time span?',
    options: [
      { label: 'A', text: 'ஒரு நாள் மட்டும்' },
      { label: 'B', text: 'நிலவு முறை / மாத அளவு' },
      { label: 'C', text: 'ஒரு நிமிடம்' },
      { label: 'D', text: 'ஒரு நூற்றாண்டு' },
    ],
    correctLabel: 'B',
  },
  {
    id: 5,
    topic: 'Polysemy (பலபொருள்)',
    tamil: '"சங்கம்" என்ற சொல் தமிழில் எந்த வகையான பொருள் இணைப்புகளைக் காட்டுகிறது?',
    english:
      'The word "சங்கம்" illustrates polysemy by linking which kinds of senses?',
    options: [
      { label: 'A', text: 'மீன் மற்றும் காற்று' },
      { label: 'B', text: 'கோபுரம் மட்டும்' },
      { label: 'C', text: 'சங்கு (கைப்பு) மற்றும் இலக்கிய அமைப்பு' },
      { label: 'D', text: 'எண் மற்றும் நிறம்' },
    ],
    correctLabel: 'C',
  },
];

function stripCorrectLabels(list) {
  return list.map((q) => {
    const copy = { ...q };
    delete copy.correctLabel;
    return copy;
  });
}

const PracticeWindow = ({ onNavigateBack }) => {
  const steps = [1, 2, 3, 4, 5];
  const [loadStatus, setLoadStatus] = useState('loading');
  const [loadError, setLoadError] = useState('');
  const [usingFallback, setUsingFallback] = useState(false);
  const [quizId, setQuizId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedLabel, setSelectedLabel] = useState(null);
  const [responses, setResponses] = useState({});
  const [finished, setFinished] = useState(false);
  const [submittingScore, setSubmittingScore] = useState(false);
  const [scoreResult, setScoreResult] = useState(null);
  const [quizModel, setQuizModel] = useState(null);
  const [mascotMood, setMascotMood] = useState('thinking');
  const [mascotMsg, setMascotMsg] = useState('Loading your practice set…');
  /** null = idle; after submit, popup + auto-advance */
  const [stepFeedback, setStepFeedback] = useState(null);
  const checkTimerRef = useRef(null);

  const clearCheckTimer = useCallback(() => {
    if (checkTimerRef.current) {
      clearTimeout(checkTimerRef.current);
      checkTimerRef.current = null;
    }
  }, []);

  useEffect(() => () => clearCheckTimer(), [clearCheckTimer]);

  const loadQuiz = useCallback(async () => {
    setLoadStatus('loading');
    setLoadError('');
    setQuizId(null);
    setQuizModel(null);
    setUsingFallback(false);
    setQuestions([]);
    setCurrentStep(1);
    setSelectedLabel(null);
    setResponses({});
    setFinished(false);
    setSubmittingScore(false);
    setScoreResult(null);
    setStepFeedback(null);
    clearCheckTimer();
    setMascotMood('thinking');
    setMascotMsg('Generating five polysemy questions…');

    try {
      const url = `${apiUrl('/api/practice-quiz')}?t=${Date.now()}`;
      const res = await fetch(url, {
        cache: 'no-store',
        headers: { Accept: 'application/json' },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = [data.error, data.hint].filter(Boolean).join(' — ');
        throw new Error(msg || `Could not load quiz (${res.status})`);
      }
      if (!data.questions || data.questions.length !== 5 || !data.quizId) {
        throw new Error('Invalid quiz from server');
      }
      setQuizId(data.quizId);
      setQuestions(data.questions);
      setQuizModel(data.model || null);
      setUsingFallback(false);
      setLoadStatus('ready');
      setMascotMood('idle');
      setMascotMsg('Pick the best answer for each question!');
    } catch (e) {
      const msg = e.message || 'Failed to load quiz';
      console.warn('[PracticeWindow] AI quiz unavailable, using built-in set:', msg);
      setLoadError(msg);
      setQuizModel(null);
      setUsingFallback(true);
      setQuestions(stripCorrectLabels(FALLBACK_QUESTIONS_FULL));
      setLoadStatus('ready');
      setMascotMood('idle');
      setMascotMsg('Offline set — choose the best option for each prompt.');
    }
  }, [clearCheckTimer]);

  useEffect(() => {
    loadQuiz();
  }, [loadQuiz]);

  const currentQuestion = questions[currentStep - 1];
  const progressFill = `${(currentStep / 5) * 100}%`;

  const computeLocalScore = (orderedAnswers) => {
    const details = FALLBACK_QUESTIONS_FULL.map((q, i) => {
      const selected = orderedAnswers[i] || null;
      const isCorrect =
        selected && String(selected).toUpperCase() === q.correctLabel;
      return {
        id: q.id,
        selected,
        correctLabel: q.correctLabel,
        isCorrect,
        tamil: q.tamil,
        english: q.english,
      };
    });
    const score = details.filter((d) => d.isCorrect).length;
    return { score, outOf: 5, details };
  };

  const finishQuiz = async (finalResponses) => {
    const ordered = questions.map((q) => finalResponses[q.id] || '');
    setSubmittingScore(true);
    try {
      let result;
      if (quizId) {
        const res = await fetch(apiUrl('/api/practice-quiz/score'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quizId, answers: ordered }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data.error || 'Could not submit score');
        }
        result = {
          score: data.score,
          outOf: data.outOf,
          details: data.details,
        };
      } else {
        result = computeLocalScore(ordered);
      }
      setScoreResult(result);
      setFinished(true);
      if (result.score === 5) {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.65 },
          colors: ['#4ADE80', '#FBBF24', '#8B4513'],
        });
        setMascotMood('happy');
        setMascotMsg('Perfect score — outstanding! 🎉');
      } else if (result.score >= 3) {
        setMascotMood('happy');
        setMascotMsg('Solid work — check the review list and run another round.');
      } else {
        setMascotMood('idle');
        setMascotMsg('Polysemy is tricky — keep practicing!');
      }
    } catch {
      const result = computeLocalScore(ordered);
      setScoreResult(result);
      setFinished(true);
      setMascotMood('idle');
      setMascotMsg('Scored locally — try again when the server is back.');
    } finally {
      setSubmittingScore(false);
    }
  };

  const checkCurrentAnswer = async () => {
    const sel = String(selectedLabel).trim().toUpperCase();
    if (!usingFallback && quizId) {
      const res = await fetch(apiUrl('/api/practice-quiz/check'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizId,
          questionId: currentQuestion.id,
          answer: sel,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || 'Check failed');
      }
      return { correct: Boolean(data.correct), correctLabel: data.correctLabel };
    }
    const full = FALLBACK_QUESTIONS_FULL.find((q) => q.id === currentQuestion.id);
    if (!full) throw new Error('No answer key');
    return {
      correct: sel === full.correctLabel,
      correctLabel: full.correctLabel,
    };
  };

  const handleCheckAndContinue = async () => {
    if (!currentQuestion || !selectedLabel || stepFeedback !== null) return;
    clearCheckTimer();
    try {
      const { correct, correctLabel } = await checkCurrentAnswer();
      setStepFeedback(
        correct
          ? { kind: 'correct', atStep: currentStep }
          : { kind: 'wrong', correctLabel, atStep: currentStep },
      );
      setMascotMood(correct ? 'happy' : 'sad');
      setMascotMsg(
        correct
          ? 'நல்லது! That’s correct! 🎉'
          : `The correct option was ${correctLabel}.`,
      );
      if (correct) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.72 },
          colors: ['#4ADE80', '#FBBF24', '#8B4513'],
        });
      }
      const nextResponses = {
        ...responses,
        [currentQuestion.id]: selectedLabel,
      };
      const delay = correct ? 1600 : 1700;
      checkTimerRef.current = window.setTimeout(() => {
        checkTimerRef.current = null;
        setStepFeedback(null);
        setResponses(nextResponses);
        if (currentStep < 5) {
          setCurrentStep((s) => s + 1);
          setSelectedLabel(null);
          setMascotMood('idle');
          setMascotMsg('Pick the best answer for each question!');
        } else {
          finishQuiz(nextResponses);
        }
      }, delay);
    } catch (err) {
      console.warn('[PracticeWindow] Answer check failed:', err);
      clearCheckTimer();
      const nextResponses = {
        ...responses,
        [currentQuestion.id]: selectedLabel,
      };
      if (currentStep < 5) {
        setCurrentStep((s) => s + 1);
        setSelectedLabel(null);
      } else {
        finishQuiz(nextResponses);
      }
      setMascotMood('idle');
      setMascotMsg('Could not verify that answer — continuing.');
    }
  };

  const handlePracticeAgain = () => {
    loadQuiz();
  };

  return (
    <div className="practice-window-page">
      <aside className="progress-sidebar">
        <p className="sidebar-label">PROGRESS</p>
        <div className="step-list">
          {steps.map((s) => (
            <div
              key={s}
              className={`step-circle ${s === currentStep && !finished ? 'active' : ''} ${s < currentStep || finished ? 'done' : ''}`}
            >
              {s < currentStep || finished ? '✓' : s}
            </div>
          ))}
        </div>
        <div className="vertical-bar-container">
          <div
            className="bar-fill"
            style={{ height: finished ? '100%' : progressFill }}
          />
        </div>
      </aside>

      <main className="practice-content">
        <PageBackNav title="Practice Window" onBack={onNavigateBack} />

        {loadStatus === 'ready' && !usingFallback && quizModel && (
          <p className="quiz-source-badge" role="status">
            AI-generated set · {quizModel}
          </p>
        )}

        <div className="questions-container">
          {loadStatus === 'loading' && (
            <div className="load-state">
              <Loader2 className="load-spinner" size={40} aria-hidden />
              <p>Generating five polysemy questions…</p>
            </div>
          )}

          {loadStatus === 'ready' && loadError && usingFallback && (
            <div className="fallback-banner" role="status">
              <strong>Offline mode.</strong> {loadError} Showing built-in questions.
              Start the backend with <code>OPENROUTER_API_KEY</code> in{' '}
              <code>backend/.env</code> for AI-generated sets.
            </div>
          )}

          {loadStatus === 'ready' && finished && scoreResult && (
            <div className="completion-card completion-card--enter">
              <h2 className="completion-title">Your score</h2>
              <p className="score-big">
                {scoreResult.score} / {scoreResult.outOf}
              </p>
              <p className="completion-text">
                {scoreResult.score === 5
                  ? 'Perfect — strong grasp of Tamil polysemy.'
                  : scoreResult.score >= 3
                    ? 'Good work — review the items below to tighten meaning distinctions.'
                    : 'Keep practicing — polysemy takes time to recognize in context.'}
              </p>
              <ul className="review-list">
                {scoreResult.details.map((d) => (
                  <li
                    key={d.id}
                    className={`review-item ${d.isCorrect ? 'review-item--ok' : 'review-item--miss'}`}
                  >
                    <span className="review-q">Q{d.id}</span>
                    <span className="review-outcome">
                      {d.isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                    <span className="review-meta">
                      Your answer: {d.selected || '—'} · Correct: {d.correctLabel}
                    </span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className="btn-primary again-btn"
                onClick={handlePracticeAgain}
              >
                New practice round
              </button>
            </div>
          )}

          {loadStatus === 'ready' &&
            !finished &&
            currentQuestion &&
            !submittingScore && (
              <div className="question-block">
                <p className="step-meta">
                  Question {currentStep} of {questions.length}
                </p>
                <div className="question-card">
                  <div className="card-header">
                    <span className="question-badge">
                      QUESTION {currentQuestion.id}
                    </span>
                    <span className="topic-text">{currentQuestion.topic}</span>
                  </div>
                  <h2 className="tamil-text">{currentQuestion.tamil}</h2>
                  <p className="english-text">{currentQuestion.english}</p>
                </div>

                <div className="options-grid">
                  {currentQuestion.options.map((opt) => (
                    <button
                      key={opt.label}
                      type="button"
                      disabled={Boolean(stepFeedback)}
                      className={`option-btn ${selectedLabel === opt.label ? 'option-btn--selected' : ''} ${
                        stepFeedback?.kind === 'correct' &&
                        selectedLabel === opt.label
                          ? 'option-btn--confirmed-correct'
                          : ''
                      } ${
                        stepFeedback?.kind === 'wrong' &&
                        opt.label === stepFeedback.correctLabel
                          ? 'option-btn--reveal-correct'
                          : ''
                      }`}
                      onClick={() => setSelectedLabel(opt.label)}
                    >
                      <span className="opt-label">{opt.label}</span>
                      <span className="opt-text">{opt.text}</span>
                    </button>
                  ))}
                </div>

                {stepFeedback ? (
                  <div
                    key={`${stepFeedback.atStep}-${stepFeedback.kind}-${stepFeedback.correctLabel ?? 'ok'}`}
                    className={`feedback-popup ${
                      stepFeedback.kind === 'correct'
                        ? 'feedback-popup--ok'
                        : 'feedback-popup--miss'
                    }`}
                    role="status"
                  >
                    {stepFeedback.kind === 'correct' ? (
                      <>
                        <Zap size={22} className="feedback-popup-icon" aria-hidden />
                        <div className="feedback-popup-text">
                          <strong>Correct!</strong>
                          <span>
                            {currentStep < 5
                              ? 'Well done — next question in a moment.'
                              : 'Well done — scoring your round…'}
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="feedback-popup-text">
                        <strong>Not quite</strong>
                        <span>
                          The correct option was{' '}
                          <strong>{stepFeedback.correctLabel}</strong>.
                        </span>
                      </div>
                    )}
                  </div>
                ) : null}

                <div className="question-actions">
                  <button
                    type="button"
                    className="btn-next"
                    onClick={handleCheckAndContinue}
                    disabled={!selectedLabel || Boolean(stepFeedback)}
                  >
                    {currentStep === 5 ? 'Check & see score' : 'Check answer'}
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}

          {submittingScore && (
            <div className="load-state">
              <Loader2 className="load-spinner" size={40} aria-hidden />
              <p>Checking your answers…</p>
            </div>
          )}
        </div>

        <LexiMascot
          mood={mascotMood}
          message={mascotMsg}
          position="bottom-right"
          scale={0.65}
          autoTips={loadStatus === 'ready' && !finished}
          tipInterval={18000}
        />
      </main>

      <style>{`
        .practice-window-page { display: flex; min-height: 100vh; }
        .progress-sidebar { width: 100px; background: rgba(255, 255, 255, 0.5); backdrop-filter: blur(10px); display: flex; flex-direction: column; align-items: center; padding: 60px 0; position: fixed; height: 100vh; border-right: 1px solid rgba(0,0,0,0.03); }
        .sidebar-label { font-size: 0.65rem; font-weight: 800; color: #22C55E; letter-spacing: 1.5px; margin-bottom: 40px; }
        .step-list { display: flex; flex-direction: column; gap: 20px; margin-bottom: auto; }
        .step-circle { width: 32px; height: 32px; border-radius: 50%; border: 1px solid #E5E7EB; display: flex; align-items: center; justify-content: center; font-weight: 700; background: #FFF9F5; color: #5C3317; font-size: 0.85rem; transition: var(--transition); }
        .step-circle.active { background: #22C55E; color: white; border-color: #22C55E; box-shadow: 0 0 12px rgba(34, 197, 94, 0.4); animation: step-pulse 1.2s ease-in-out infinite; }
        .step-circle.done { background: #DCFCE7; color: #166534; border-color: #86EFAC; }
        @keyframes step-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.12); } }

        .vertical-bar-container { width: 4px; height: 80px; background: #E5E7EB; border-radius: 2px; position: relative; overflow: hidden; margin-top: 24px; }
        .bar-fill { position: absolute; bottom: 0; left: 0; width: 100%; background: #22C55E; transition: height 0.5s ease-out; }
        .practice-content { flex: 1; margin-left: 100px; padding: 40px 8% 48px; position: relative; }
        .quiz-source-badge { font-size: 0.78rem; font-weight: 700; color: #166534; margin: 0 auto 12px; max-width: 720px; width: 100%; }
        .questions-container { display: flex; flex-direction: column; max-width: 720px; margin: 0 auto; width: 100%; gap: 16px; }
        .load-state { text-align: center; padding: 48px 24px; color: #5C3317; }
        .load-state p { margin-top: 16px; font-weight: 600; opacity: 0.8; }
        .load-spinner { animation: spin 0.9s linear infinite; color: #8B4513; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .fallback-banner { background: #FFFBEB; border: 1px solid #FDE68A; color: #78350F; padding: 14px 18px; border-radius: 16px; font-size: 0.9rem; line-height: 1.5; }
        .fallback-banner code { font-size: 0.82rem; background: rgba(255,255,255,0.7); padding: 2px 6px; border-radius: 6px; }
        .step-meta { font-size: 0.8rem; font-weight: 700; color: #5C3317; opacity: 0.65; margin-bottom: 16px; letter-spacing: 0.04em; text-transform: uppercase; }
        .question-block { display: flex; flex-direction: column; gap: 28px; align-items: stretch; position: relative; }
        .question-card { background: #FFEEDD; padding: 32px 36px; border-radius: 32px; position: relative; text-align: left; border: 3px solid transparent; transition: border-color 0.3s, background 0.3s; }
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
        .opt-label { flex-shrink: 0; width: 34px; height: 34px; background: #FFEEDD; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; color: #5C3317; font-size: 0.8rem; margin-top: 2px; transition: 0.3s; }
        .option-btn--selected .opt-label { background: #8B4513; color: white; }
        .opt-text { font-size: 1.05rem; font-weight: 600; color: var(--primary-brown); line-height: 1.45; font-family: var(--font-tamil), var(--font-body), sans-serif; }
        .option-btn--reveal-correct { border-color: #22C55E !important; background: #F0FDF4 !important; box-shadow: 0 4px 16px rgba(34, 197, 94, 0.22) !important; }
        .option-btn--reveal-correct .opt-label { background: #22C55E !important; color: white !important; }
        .option-btn--confirmed-correct { border-color: #16A34A !important; background: #ECFDF5 !important; box-shadow: 0 6px 22px rgba(22, 163, 74, 0.28) !important; }
        .option-btn--confirmed-correct .opt-label { background: #16A34A !important; color: white !important; }

        .feedback-popup { display: flex; align-items: flex-start; gap: 14px; margin-top: 4px; padding: 18px 22px; border-radius: 20px; box-shadow: 0 14px 44px rgba(0,0,0,0.1); border: 2px solid transparent; animation: feedback-pop 0.22s ease-out; }
        @keyframes feedback-pop { from { opacity: 0; transform: translateY(14px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .feedback-popup--ok { background: linear-gradient(135deg, #F0FDF4, #DCFCE7); border-color: #4ADE80; color: #166534; }
        .feedback-popup--miss { background: linear-gradient(135deg, #FEF2F2, #FEE2E2); border-color: #F87171; color: #991B1B; }
        .feedback-popup-text { display: flex; flex-direction: column; gap: 4px; text-align: left; font-size: 0.98rem; line-height: 1.45; font-weight: 600; }
        .feedback-popup-text strong { font-size: 1.06rem; font-weight: 800; }
        .feedback-popup-text span { font-weight: 600; opacity: 0.92; }
        .feedback-popup-icon { flex-shrink: 0; color: #15803D; margin-top: 2px; }

        .question-actions { display: flex; justify-content: flex-end; margin-top: 8px; }
        .btn-next { display: inline-flex; align-items: center; gap: 8px; padding: 14px 24px; border-radius: 100px; border: none; background: linear-gradient(180deg, #8B4513 0%, #5C3317 100%); color: white; font-family: var(--font-main); font-weight: 700; font-size: 1rem; cursor: pointer; transition: var(--transition); }
        .btn-next:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(92, 51, 23, 0.25); }
        .btn-next:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }

        .completion-card { background: #FFF9F5; border-radius: 32px; padding: 40px; text-align: center; border: 1px solid rgba(139, 69, 19, 0.08); }
        .completion-card--enter { animation: completion-enter 0.35s ease-out; }
        @keyframes completion-enter { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .completion-title { font-size: 1.5rem; font-weight: 800; color: var(--primary-brown); margin-bottom: 8px; }
        .score-big { font-size: 2.75rem; font-weight: 800; color: #166534; margin: 12px 0 16px; font-family: var(--font-main); }
        .completion-text { font-size: 1rem; color: #5C3317; opacity: 0.85; line-height: 1.6; margin-bottom: 24px; max-width: 48ch; margin-left: auto; margin-right: auto; }
        .review-list { list-style: none; text-align: left; margin: 0 0 28px; padding: 0; display: flex; flex-direction: column; gap: 10px; max-width: 420px; margin-left: auto; margin-right: auto; }
        .review-item { display: grid; grid-template-columns: auto 1fr; gap: 4px 12px; padding: 12px 14px; border-radius: 14px; font-size: 0.9rem; }
        .review-item--ok { background: #DCFCE7; color: #166534; }
        .review-item--miss { background: #FEE2E2; color: #991B1B; }
        .review-q { font-weight: 800; }
        .review-outcome { font-weight: 700; }
        .review-meta { grid-column: 1 / -1; font-size: 0.82rem; opacity: 0.9; }
        .again-btn { margin: 0 auto; justify-content: center; display: flex; align-items: center; gap: 8px; padding: 14px 24px; border-radius: 100px; border: none; background: linear-gradient(180deg, #8B4513 0%, #5C3317 100%); color: white; font-family: var(--font-main); font-weight: 700; font-size: 1rem; cursor: pointer; }
      `}</style>
    </div>
  );
};

export default PracticeWindow;
