import express from 'express';
import { generateAudioController } from '../controllers/chatController.js';

const router = express.Router();

router.post('/', generateAudioController);

export default router;
