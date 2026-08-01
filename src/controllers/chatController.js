import https from 'https';

const getGeminiConfig = () => ({
  apiKey: process.env.GEMINI_API_KEY,
  model: process.env.GEMINI_MODEL || 'gemini-3.6-flash',
});

const buildPrompt = (message, files = []) => {
  const baseInstruction = [
    'You are a helpful Indonesian health assistant.',
    'Provide supportive, general health guidance in Bahasa Indonesia.',
    'Do not diagnose or replace a licensed doctor.',
    'If symptoms are severe, urgent, or concerning, advise contacting a medical professional immediately.',
    'When the user mentions a condition, mention that it is not a diagnosis and recommend seeking professional care if needed.',
    `User message: ${message}`,
  ].join('\n');

  if (files.length === 0) {
    return baseInstruction;
  }

  const fileContext = files
    .map((file) => `Attached file: ${file.originalname} (${file.mimetype})`)
    .join('\n');

  return `${baseInstruction}\n\n${fileContext}`;
};

const callGemini = async (prompt) => {
  const { apiKey, model } = getGeminiConfig();

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured.');
  }

  const requestBody = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.3,
    },
  };

  const payload = JSON.stringify(requestBody);

  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models/${model}:generateContent?key=${apiKey}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
    }, (res) => {
      let raw = '';
      res.on('data', (chunk) => {
        raw += chunk;
      });
      res.on('end', () => {
        try {
          const data = JSON.parse(raw);
          if (data.error) {
            reject(new Error(data.error.message || 'Gemini API error'));
            return;
          }

          const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';
          resolve(text);
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
};

export const chatController = async (req, res, next) => {
  try {
    const message = req.body.message || req.body.prompt || '';
    const files = Array.isArray(req.files) ? req.files : [];

    if (!message && files.length === 0) {
      return res.status(400).json({ success: false, error: 'Please provide a message or upload a file.' });
    }

    const prompt = buildPrompt(message, files);
    const reply = await callGemini(prompt);

    res.json({ success: true, reply });
  } catch (error) {
    next(error);
  }
};

export const generateTextController = async (req, res, next) => {
  try {
    const message = req.body.message || req.body.prompt || '';

    if (!message) {
      return res.status(400).json({ success: false, error: 'Please provide a message.' });
    }

    const prompt = buildPrompt(message, []);
    const reply = await callGemini(prompt);

    res.json({ success: true, reply });
  } catch (error) {
    next(error);
  }
};

export const generateImageController = async (req, res, next) => {
  try {
    const message = req.body.message || req.body.prompt || '';
    const image = req.file;

    if (!message || !image) {
      return res.status(400).json({ success: false, error: 'Please provide a message and an image file.' });
    }

    const prompt = buildPrompt(message, [image]);
    const reply = await callGemini(prompt);

    res.json({ success: true, reply });
  } catch (error) {
    next(error);
  }
};

export const generateDocumentController = async (req, res, next) => {
  try {
    const message = req.body.message || req.body.prompt || '';
    const document = req.file;

    if (!message || !document) {
      return res.status(400).json({ success: false, error: 'Please provide a message and a document file.' });
    }

    const prompt = buildPrompt(message, [document]);
    const reply = await callGemini(prompt);

    res.json({ success: true, reply });
  } catch (error) {
    next(error);
  }
};

export const generateAudioController = async (req, res, next) => {
  try {
    const message = req.body.message || req.body.prompt || '';
    const audio = req.file;

    if (!message || !audio) {
      return res.status(400).json({ success: false, error: 'Please provide a message and an audio file.' });
    }

    const prompt = buildPrompt(message, [audio]);
    const reply = await callGemini(prompt);

    res.json({ success: true, reply });
  } catch (error) {
    next(error);
  }
};
