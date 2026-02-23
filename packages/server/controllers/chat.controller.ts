import type { Request, Response } from 'express';
import z from 'zod';
import { sessionRepository } from '../repositories/session.repository';
import { chatService } from '../services/chat.service';
import { v4 as uuidv4 } from 'uuid';
const chatSchema = z.object({
   sessionId: z.uuid().optional(),
   prompt: z
      .string()
      .trim()
      .min(1, 'Prompt is required')
      .max(1000, 'Prompt is too long (max 1000 characters)'),
});
export const chatController = {
   async sendMessage(req: Request, res: Response) {
      const parseResult = chatSchema.safeParse(req.body);
      if (!parseResult.success) {
         res.status(400).json(z.treeifyError(parseResult.error));
         return;
      }

      try {
         let { sessionId, prompt } = req.body;
         if (!sessionId) {
            sessionId = uuidv4();
            sessionRepository.create(sessionId);
         }
         const response = await chatService.sendMessage(prompt, sessionId);
         res.json({ sessionId, message: response.message });
      } catch (error) {
         res.status(500).json({ error: 'Failed to generate a response.' });
      }
   },
};
