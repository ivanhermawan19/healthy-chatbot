import express from 'express';
import { generateTextController } from '../controllers/chatController.js';

const router = express.Router();

router.post('/', generateTextController);

export default router;
