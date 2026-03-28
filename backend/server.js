import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import { GoogleGenerativeAI } from '@google/generative-ai';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = Number(process.env.PORT) || 5001;

/** Google Generative AI model id (e.g. gemini-1.5-flash; not the google/ prefix from some routers). */
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
/** OpenRouter slug — avoid deprecated ids like google/gemini-1.5-flash (invalid on OpenRouter). */
const OPENROUTER_MODEL =
  process.env.OPENROUTER_MODEL || 'google/gemini-2.0-flash-001';

/** quizId -> { questions (with correctLabel), expiresAt } */
const practiceQuizSessions = new Map();

function cleanupPracticeQuizSessions() {
  const now = Date.now();
  for (const [id, s] of practiceQuizSessions) {
    if (s.expiresAt < now) practiceQuizSessions.delete(id);
  }
}

function buildPracticeQuizUserMessage(sessionKey) {
  return `Session nonce (vary wording and examples each time): ${sessionKey}

You are an expert Tamil linguistics author. Produce exactly FIVE multiple-choice items on **Tamil polysemy** (பலபொருள்): one surface form carrying several **related** senses (etymologically or culturally linked). Avoid pure unrelated homonym tricks unless clearly marked as a contrast item.

**Pedagogical mix (strictly one question each, Q1→Q5):**
1. **Sense inventory** — For a well-known polysemous lexeme, which pair/list of glosses fits (e.g. celestial + calendrical, time + object, institution + artifact).
2. **Context disambiguation** — Short Tamil phrase or sentence; pick the meaning supported by context.
3. **Register / colloquial vs literary** — Same spelling, different typical readings (include at least one item with register nuance).
4. **Concept / metalanguage** — Terminology or mechanism (e.g. related senses vs accidental homonymy) applied to Tamil examples.
5. **Classical or cultural anchor** — Literature, calendar, nature, or institutions (e.g. திங்கள், மாலை, சங்கம், கண், நாள், வேள்-type patterns). Still polysemy-focused.

**Quality (non-negotiable):**
- Use a **different focal lexeme or contrast pair** in each question; do not recycle the same headword as the main target twice.
- **tamil**: clear, natural question in Tamil script (minimum ~12 characters).
- **english**: short gloss of what is being asked (not a full translation of all four answers).
- Four options in **semantic order A–D**; **exactly one** correct. Distractors must be **plausible** (wrong but related sense, partial truth, or register slip)—never absurd filler.
- Respect grapheme distinctions where it matters (ழ/ள, ற/ர, ந/ன, etc.).

**Output — machine-readable only:**
Return a single JSON object. No markdown fences, no commentary before or after.
Schema:
{"questions":[{"id":1,"topic":"Polysemy (பலபொருள்)","tamil":"…","english":"…","options":[{"label":"A","text":"…"},{"label":"B","text":"…"},{"label":"C","text":"…"},{"label":"D","text":"…"}],"correctLabel":"B"}, … repeat for ids 2,3,4,5]}

"options" array order must be A then B then C then D. "correctLabel" is exactly "A", "B", "C", or "D" matching the correct option.`;
}

function buildRepairUserMessage(rawSnippet) {
  const clipped = String(rawSnippet).slice(0, 16000);
  return `The following text should have been valid JSON with top-level key "questions" (array of exactly 5 objects).
Each object: id (1-5), topic (string), tamil (string), english (string), options (array of 4 {label:"A"|"B"|"C"|"D", text:string} in order), correctLabel ("A"|"B"|"C"|"D").

Output ONLY the fixed JSON object. No markdown, no explanation.

---BEGIN---
${clipped}
---END---`;
}

function messageContentFromOpenRouter(orJson) {
  return (
    orJson?.choices?.[0]?.message?.content ||
    orJson?.choices?.[0]?.text ||
    ''
  );
}

async function openRouterChat({ model, apiKey, referer, messages, temperature }) {
  const orRes = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': referer,
      'X-Title': 'LexiSense Practice',
    },
    body: JSON.stringify({ model, temperature, messages }),
  });
  const orJson = await orRes.json().catch(() => ({}));
  return { orRes, orJson };
}

function parseAndNormalizeQuiz(content) {
  const parsed = JSON.parse(extractJsonObject(content));
  if (!parsed || !Array.isArray(parsed.questions)) {
    throw new Error('JSON missing questions array');
  }
  return normalizeQuizQuestions(parsed.questions);
}

function extractJsonObject(text) {
  const trimmed = String(text).trim();
  if (trimmed.startsWith('```')) {
    return trimmed
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();
  }
  const start = trimmed.indexOf('{');
  const end = trimmed.lastIndexOf('}');
  if (start >= 0 && end > start) return trimmed.slice(start, end + 1);
  return trimmed;
}

function openRouterErrorMessage(orJson, status) {
  const e = orJson?.error;
  if (typeof e === 'string') return e;
  if (e?.message) return e.message;
  if (typeof orJson?.message === 'string') return orJson.message;
  return `OpenRouter request failed (HTTP ${status})`;
}

function normalizeQuizQuestions(rawList) {
  if (!Array.isArray(rawList) || rawList.length !== 5) {
    throw new Error('Quiz must contain exactly 5 questions');
  }
  return rawList.map((q, i) => {
    const id = i + 1;
    const options = q.options;
    if (!options || options.length !== 4) {
      throw new Error(`Question ${id}: need 4 options`);
    }
    const correct = String(q.correctLabel || '')
      .trim()
      .toUpperCase();
    if (!['A', 'B', 'C', 'D'].includes(correct)) {
      throw new Error(`Question ${id}: invalid correctLabel`);
    }
    const topic = String(q.topic || 'Polysemy (பலபொருள்)').trim();
    const tamil = String(q.tamil || '').trim();
    const english = String(q.english || '').trim();
    if (tamil.length < 12) {
      throw new Error(`Question ${id}: Tamil stem too short or empty`);
    }
    if (english.length < 4) {
      throw new Error(`Question ${id}: English gloss too short or empty`);
    }
    const normOptions = options.map((o, j) => {
      const text = String(o.text ?? '').trim();
      if (text.length < 1) {
        throw new Error(`Question ${id}: option ${j + 1} text empty`);
      }
      return { label: ['A', 'B', 'C', 'D'][j], text };
    });
    return {
      id,
      topic: topic || 'Polysemy (பலபொருள்)',
      tamil,
      english,
      options: normOptions,
      correctLabel: correct,
    };
  });
}

app.use(cors());
app.use(express.json());

/** Browsing http://localhost:<PORT>/ in a tab is the API root — not the React app (use Vite, usually :3000). */
app.get('/', (req, res) => {
  res.json({
    name: 'LexiSense API',
    note: 'Use the frontend dev server (e.g. http://localhost:3000) for the LexiSense UI.',
    endpoints: {
      health: 'GET /api/health',
      practiceQuiz: 'GET /api/practice-quiz',
      checkPracticeQuizAnswer: 'POST /api/practice-quiz/check',
      scorePracticeQuiz: 'POST /api/practice-quiz/score',
      chat: 'POST /api/chat',
    },
  });
});

/** Stops Chrome DevTools from requesting this path and logging a 404 (CSP noise in some versions). */
app.get('/.well-known/appspecific/com.chrome.devtools.json', (req, res) => {
  res.type('application/json').send('{}');
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'LexiSense Backend is running',
    geminiModel: GEMINI_MODEL,
    openRouterModel: OPENROUTER_MODEL,
    practiceQuizConfigured: Boolean(process.env.OPENROUTER_API_KEY),
  });
});

/**
 * GET /api/practice-quiz
 * Returns 5 AI-generated polysemy MCQs (OpenRouter + Gemini). Key: OPENROUTER_API_KEY.
 */
app.get('/api/practice-quiz', async (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.set('Pragma', 'no-cache');
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      error:
        'Missing OPENROUTER_API_KEY. Copy backend/.env.example to backend/.env and add your OpenRouter key.',
    });
  }

  const referer =
    process.env.OPENROUTER_SITE_URL || 'http://localhost:3000';
  const sessionKey = crypto.randomUUID();
  const modelsToTry = [
    OPENROUTER_MODEL,
    'google/gemini-2.5-flash',
    'google/gemini-2.0-flash-001',
  ].filter((m, i, a) => Boolean(m) && a.indexOf(m) === i);

  try {
    let orJson = {};
    let orRes = { ok: false, status: 0 };
    let usedModel = OPENROUTER_MODEL;
    let lastOpenRouterError = '';

    for (let i = 0; i < modelsToTry.length; i++) {
      const model = modelsToTry[i];
      usedModel = model;
      const gen = await openRouterChat({
        model,
        apiKey,
        referer,
        temperature: 0.74,
        messages: [
          {
            role: 'system',
            content:
              'You generate Tamil polysemy quizzes. Reply with a single valid JSON object only. No markdown fences, no prose outside JSON.',
          },
          {
            role: 'user',
            content: buildPracticeQuizUserMessage(sessionKey),
          },
        ],
      });
      orRes = gen.orRes;
      orJson = gen.orJson;
      if (orRes.ok) break;

      lastOpenRouterError = openRouterErrorMessage(orJson, orRes.status);
      console.error(`OpenRouter model ${model}:`, orJson);

      const maybeWrongModel =
        orRes.status === 400 ||
        orRes.status === 404 ||
        /model|not found|invalid/i.test(lastOpenRouterError);
      const hasFallbackModel = i < modelsToTry.length - 1;

      if (maybeWrongModel && hasFallbackModel) {
        continue;
      }

      return res.status(502).json({
        error: lastOpenRouterError,
        model,
        hint:
          'Check OPENROUTER_API_KEY and account credits at openrouter.ai. Set OPENROUTER_MODEL in backend/.env to a model id from openrouter.ai/models (e.g. google/gemini-2.5-flash).',
      });
    }

    if (!orRes.ok) {
      return res.status(502).json({
        error: lastOpenRouterError || 'OpenRouter request failed',
        model: usedModel,
        hint: 'Set OPENROUTER_MODEL in backend/.env.',
      });
    }

    const content = messageContentFromOpenRouter(orJson);
    if (!content) {
      return res.status(502).json({
        error: 'Empty model response',
        model: usedModel,
      });
    }

    let questions;
    try {
      questions = parseAndNormalizeQuiz(content);
    } catch (firstErr) {
      console.warn('Quiz parse/normalize failed, attempting JSON repair:', firstErr.message);
      const repair = await openRouterChat({
        model: usedModel,
        apiKey,
        referer,
        temperature: 0.12,
        messages: [
          {
            role: 'system',
            content:
              'You fix malformed JSON. Output only valid JSON. No markdown.',
          },
          { role: 'user', content: buildRepairUserMessage(content) },
        ],
      });
      if (!repair.orRes.ok) {
        console.error('Quiz repair OpenRouter:', repair.orJson);
        return res.status(502).json({
          error:
            firstErr.message ||
            'Model did not return valid quiz JSON. Try again.',
          model: usedModel,
          hint:
            'If this persists, change OPENROUTER_MODEL or simplify the prompt context.',
        });
      }
      const fixed = messageContentFromOpenRouter(repair.orJson);
      if (!fixed) {
        return res.status(502).json({
          error: 'Empty response from JSON repair step',
          model: usedModel,
        });
      }
      try {
        questions = parseAndNormalizeQuiz(fixed);
      } catch (secondErr) {
        console.error('Quiz repair still invalid:', secondErr);
        return res.status(502).json({
          error: secondErr.message || 'Quiz JSON still invalid after repair',
          model: usedModel,
        });
      }
    }
    cleanupPracticeQuizSessions();
    const quizId = crypto.randomUUID();
    practiceQuizSessions.set(quizId, {
      questions,
      expiresAt: Date.now() + 45 * 60 * 1000,
    });

    const clientQuestions = questions.map(({ correctLabel: _c, ...rest }) => rest);
    return res.json({ quizId, questions: clientQuestions, model: usedModel });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: err.message || 'Failed to generate practice quiz',
      model: OPENROUTER_MODEL,
    });
  }
});

/**
 * POST /api/practice-quiz/check
 * Body: { quizId, questionId (1–5), answer ("A"–"D") }
 * Returns whether the choice matches the stored key; does not end the session (use /score after all five).
 */
app.post('/api/practice-quiz/check', (req, res) => {
  cleanupPracticeQuizSessions();
  const { quizId, questionId, answer } = req.body || {};
  if (!quizId || typeof quizId !== 'string') {
    return res.status(400).json({ error: 'Body must include quizId (string).' });
  }
  const qid = Number(questionId);
  if (!Number.isInteger(qid) || qid < 1 || qid > 5) {
    return res.status(400).json({ error: 'Body must include questionId (integer 1–5).' });
  }

  const session = practiceQuizSessions.get(quizId);
  if (!session) {
    return res.status(410).json({
      error: 'Quiz session expired or invalid. Start a new practice round.',
    });
  }

  const q = session.questions[qid - 1];
  if (!q) {
    return res.status(400).json({ error: 'Invalid questionId for this quiz.' });
  }

  const sel = String(answer ?? '')
    .trim()
    .toUpperCase();
  const valid = ['A', 'B', 'C', 'D'].includes(sel);
  const isCorrect = valid && sel === q.correctLabel;

  return res.json({
    correct: isCorrect,
    correctLabel: q.correctLabel,
    selected: valid ? sel : null,
  });
});

/**
 * POST /api/practice-quiz/score  { "quizId": "...", "answers": ["A","B",...] } (length 5, order = questions 1–5)
 */
app.post('/api/practice-quiz/score', (req, res) => {
  cleanupPracticeQuizSessions();
  const { quizId, answers } = req.body || {};
  if (!quizId || typeof quizId !== 'string') {
    return res.status(400).json({ error: 'Body must include quizId (string).' });
  }
  if (!Array.isArray(answers) || answers.length !== 5) {
    return res.status(400).json({ error: 'Body must include answers: array of 5 strings (A–D).' });
  }

  const session = practiceQuizSessions.get(quizId);
  if (!session) {
    return res.status(410).json({
      error: 'Quiz session expired or invalid. Start a new practice round.',
    });
  }

  const details = session.questions.map((q, i) => {
    const selected = String(answers[i] ?? '')
      .trim()
      .toUpperCase();
    const valid = ['A', 'B', 'C', 'D'].includes(selected);
    const isCorrect = valid && selected === q.correctLabel;
    return {
      id: q.id,
      selected: valid ? selected : null,
      correctLabel: q.correctLabel,
      isCorrect,
      tamil: q.tamil,
      english: q.english,
    };
  });

  const score = details.filter((d) => d.isCorrect).length;
  practiceQuizSessions.delete(quizId);

  return res.json({ score, outOf: 5, details });
});

/**
 * POST /api/chat  { "message": "..." }
 * Uses Gemini 1.5 Flash by default (configurable via GEMINI_MODEL).
 */
app.post('/api/chat', async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      error: 'Missing GEMINI_API_KEY. Copy backend/.env.example to backend/.env and add your key.',
    });
  }

  const { message } = req.body;
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Body must include a string "message".' });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: GEMINI_MODEL,
      systemInstruction:
        'You are LexiSense, a helpful tutor for Tamil language, grammar, and polysemy. ' +
        'Answer clearly and accurately; use Tamil script when quoting words.',
    });
    const result = await model.generateContent(message);
    const text = result.response.text();
    return res.json({ reply: text, model: GEMINI_MODEL });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: err.message || 'Gemini request failed',
      model: GEMINI_MODEL,
    });
  }
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} (Gemini model: ${GEMINI_MODEL})`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(
      `\nPort ${PORT} is already in use. Another app (often a previous \`npm run dev\`) is listening.\n` +
        `Fix: stop that process, or set a different PORT in backend/.env and match frontend VITE_API_URL + vite.config.js proxy target.\n` +
        `Windows: netstat -ano | findstr :${PORT}  →  taskkill /PID <pid> /F\n`,
    );
  } else {
    console.error(err);
  }
  process.exit(1);
});
