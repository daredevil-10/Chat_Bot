import express from 'express';
import type { Request, Response } from 'express';
import { chatController } from './controllers/chat.controller';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
   res.send('Hello World! This is a test response.');
});
router.get('/api/hello', (req: Request, res: Response) => {
   res.send({ message: 'Hello World!' });
});

router.post('/api/chat', chatController.sendMessage);

export default router;
