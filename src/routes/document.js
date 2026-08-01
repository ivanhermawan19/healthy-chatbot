import express from 'express';
import { generateDocumentController } from '../controllers/chatController.js';

const router = express.Router();

router.post('/', generateDocumentController);

export default router;
