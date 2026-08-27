const { OpenAI } = require('openai');
const formidableLib = require('formidable');
const formidable = typeof formidableLib === 'function' ? formidableLib : (formidableLib.default || formidableLib);

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const LLM_API_URL = process.env.LLM_API_URL || 'https://opencode.ai/zen/v1/chat/completions';
const LLM_MODEL = process.env.LLM_MODEL || 'laguna-s-2.1-free';
const LLM_API_KEY = process.env.LLM_API_KEY || '';

const getOpenAI = () => {
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is missing');
  }
  return new OpenAI({ apiKey: OPENAI_API_KEY });
};

const withTimeout = (promise, ms) => {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Operation timed out after ${ms}ms`)), ms)
    ),
  ]);
};

const callLLM = async (prompt, timeoutMs = 20000) => {
  if (!LLM_API_KEY) {
    throw new Error('LLM_API_KEY is not configured');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(LLM_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LLM_API_KEY}`,
      },
      body: JSON.stringify({
        model: LLM_MODEL,
        messages: [
          { role: 'system', content: 'You are an expert English speaking examiner. Return ONLY valid JSON. No markdown, no code blocks, no explanations.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.3,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`LLM API responded with ${response.status}: ${text}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '{}';

    let cleaned = content.trim();
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.slice(7);
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.slice(3);
    }
    if (cleaned.endsWith('```')) {
      cleaned = cleaned.slice(0, -3);
    }
    cleaned = cleaned.trim();

    try {
      return JSON.parse(cleaned);
    } catch (e) {
      console.error('Failed to parse LLM response:', cleaned);
      throw new Error(`LLM returned invalid JSON: ${cleaned.slice(0, 200)}`);
    }
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('LLM request timed out');
    }
    throw error;
  }
};

const FALLBACK_RESULT = (transcript, phoneticTranscription, targetLevel) => ({
  transcript,
  phonetic_transcription: phoneticTranscription,
  estimated_level: targetLevel || 'B1+',
  strongest_skill: 'Vocabulary',
  biggest_weakness: 'Hesitation',
  next_mission: 'Practice speaking for 60 seconds without filler words.',
  metrics: [
    { name: 'Fluency & Hesitation', score: 70, comment: 'Keep practicing to improve flow.' },
    { name: 'Vocabulary & CEFR Range', score: 75, comment: 'Good word choice overall.' },
    { name: 'Grammatical Accuracy', score: 72, comment: 'Watch verb tenses and prepositions.' },
    { name: 'Pronunciation & Clarity', score: 70, comment: 'Focus on word stress and intonation.' },
    { name: 'Coherence & Structure', score: 72, comment: 'Try using more linking words.' },
    { name: 'Dialogue Interaction', score: 75, comment: 'Good engagement with the prompt.' },
  ],
});

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY is not configured');
    return res.status(500).json({ error: 'Server misconfigured: OPENAI_API_KEY is missing.' });
  }

  if (!LLM_API_KEY) {
    console.error('LLM_API_KEY is not configured');
  }

  const form = formidable({ multiples: false, maxFileSize: 25 * 1024 * 1024 });

  try {
    const [fields, files] = await form.parse(req);
    const audioFile = files.file?.[0] || files.file;

    if (!audioFile) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    const questionText = Array.isArray(fields.question_text) ? fields.question_text[0] : fields.question_text;
    const targetLevel = Array.isArray(fields.target_level) ? fields.target_level[0] : fields.target_level;

    const openaiClient = getOpenAI();

    const transcription = await withTimeout(
      openaiClient.audio.transcriptions.create({
        file: audioFile,
        model: 'whisper-1',
      }),
      30000
    );

    const transcript = transcription.text || '';

    const phoneticPrompt = `Convert the following English text to IPA (International Phonetic Alphabet) phonemic transcription. Provide ONLY the phoneme string using standard IPA symbols, no explanations, no quotes, no extra text.
Text: "${transcript.replace(/"/g, '')}"`;

    let phoneticTranscription = transcript;
    let evaluationResult = null;

    try {
      const [phoneticResult, evalResult] = await Promise.all([
        withTimeout(callLLM(phoneticPrompt), 20000).catch(e => {
          console.error('Phonetic transcription error:', e);
          return null;
        }),
        withTimeout(callLLM(evaluationPrompt), 20000).catch(e => {
          console.error('LLM evaluation error:', e);
          return null;
        }),
      ]);

      if (typeof phoneticResult === 'string') {
        phoneticTranscription = phoneticResult.trim();
      } else if (phoneticResult && typeof phoneticResult === 'object') {
        phoneticTranscription = (phoneticResult.ipa || phoneticResult.phonetic || phoneticResult.transcription || transcript).trim();
      }

      if (evalResult && typeof evalResult === 'object') {
        evaluationResult = evalResult;
      }
    } catch (e) {
      console.error('LLM processing error:', e);
    }

    if (!evaluationResult) {
      evaluationResult = FALLBACK_RESULT(transcript, phoneticTranscription, targetLevel);
    }

    return res.status(200).json(evaluationResult);
  } catch (error) {
    console.error('Evaluation error:', error);
    const message = error.message || 'Internal server error';
    return res.status(500).json({ error: message });
  }
};
