import express from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import chatRoutes from './routes/chat.js';
import textRoutes from './routes/text.js';
import imageRoutes from './routes/image.js';
import documentRoutes from './routes/document.js';
import audioRoutes from './routes/audio.js';

dotenv.config();

const app = express();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
});

app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'healthy-chatbot-api' });
});

app.use('/api/chat', upload.array('files', 5), chatRoutes);
app.use('/api/generate-text', upload.none(), textRoutes);
app.use('/api/generate-from-image', upload.single('image'), imageRoutes);
app.use('/api/generate-from-document', upload.single('document'), documentRoutes);
app.use('/api/generate-from-audio', upload.single('audio'), audioRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);

  if (err.statusCode) {
    return res.status(err.statusCode).json({ success: false, error: err.message });
  }

  res.status(500).json({ success: false, error: 'Internal server error' });
});

export default app;
