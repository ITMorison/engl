import formidable from 'formidable';
import fs from 'fs';

// Важно для Vercel Serverless: отключаем стандартный bodyParser
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = formidable({
    keepExtensions: true,
    multiples: false,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Formidable parse error:', err);
      return res.status(500).json({ error: 'Error parsing form data' });
    }

    // formidable может вернуть массив или одиночный объект в зависимости от версии
    const uploadedFile = Array.isArray(files.file) ? files.file[0] : files.file;

    // Проверяем наличие файла и его размер
    if (!uploadedFile || uploadedFile.size === 0) {
      return res.status(400).json({ error: 'Audio file is empty' });
    }

    try {
      // Здесь ваш существующий код обработки (Whisper / OpenRouter / OpenAI)
      // Пример чтения файла:
      // const audioBuffer = fs.readFileSync(uploadedFile.filepath || uploadedFile.path);

      return res.status(200).json({ 
        success: true, 
        message: 'Audio received successfully',
        size: uploadedFile.size 
      });

    } catch (error) {
      console.error('Processing error:', error);
      return res.status(500).json({ error: 'Failed to process audio' });
    }
  });
             }
