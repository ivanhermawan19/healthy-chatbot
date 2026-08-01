import express from 'express';
import { generateImageController } from '../controllers/chatController.js';

const router = express.Router();

router.post('/', generateImageController);

export default router;
