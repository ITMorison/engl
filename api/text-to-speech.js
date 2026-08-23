const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let text = '';
  try {
    text = typeof req.body === 'string' ? JSON.parse(req.body).text : req.body.text;
  } catch (e) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    const response = await openai.audio.speech.create({
      model: 'tts-1-hd',
      voice: 'nova',
      input: text,
      response_format: 'mp3',
    });

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', buffer.length);
    res.send(buffer);
  } catch (error) {
    console.error('TTS error:', error);
    return res.status(500).json({ error: error.message || 'TTS generation failed' });
  }
};
