const { OpenAI } = require('openai');
const formidable = require('formidable');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const LLM_API_URL = process.env.LLM_API_URL || 'https://opencode.ai/zen/v1/chat/completions';
const LLM_MODEL = process.env.LLM_MODEL || 'laguna-s-2.1-free';
const LLM_API_KEY = process.env.LLM_API_KEY || '';

const callLLM = async (prompt) => {
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
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`LLM API responded with ${response.status}: ${text}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || '{}';
  return JSON.parse(content);
};

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
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

    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
    });

    const transcript = transcription.text || '';

    const evaluationPrompt = `You are an expert English speaking examiner. Evaluate the student's response to the following question.

Question: ${questionText}
Student's spoken response (transcript): ${transcript}
Target CEFR Level: ${targetLevel}

Return ONLY valid JSON matching this exact structure:
{
  "transcript": "${transcript.replace(/"/g, '\\"')}",
  "estimated_level": "B1+",
  "strongest_skill": "Vocabulary",
  "biggest_weakness": "Hesitation",
  "next_mission": "Speak for 60 seconds without filler words.",
  "metrics": [
    { "name": "Fluency & Hesitation", "score": 72, "comment": "..." },
    { "name": "Vocabulary & CEFR Range", "score": 85, "comment": "..." },
    { "name": "Grammatical Accuracy", "score": 78, "comment": "..." },
    { "name": "Pronunciation & Clarity", "score": 80, "comment": "..." },
    { "name": "Coherence & Structure", "score": 75, "comment": "..." },
    { "name": "Dialogue Interaction", "score": 82, "comment": "..." }
  ]
}`;

    const result = await callLLM(evaluationPrompt);

    return res.status(200).json(result);
  } catch (error) {
    console.error('Evaluation error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};
