import { Ollama } from 'ollama';
import { sessionRepository } from '../repositories/session.repository';

const OllamaClient = new Ollama();

type ChatResponse = {
   id: string;
   message: string;
};
export const chatService = {
   async sendMessage(prompt: string, sessionId: string): Promise<ChatResponse> {
      const history = sessionRepository.get(sessionId);
      /* if (!sessions[sessionId]) {
         sessions[sessionId] = [];
     }
       const history = sessions[sessionId];*/

      sessionRepository.append(sessionId, { role: 'user', content: prompt });

      const response = await OllamaClient.chat({
         model: 'llama3.1',
         messages: history,
         options: {
            num_predict: 100,
         },
      });
      sessionRepository.append(sessionId, response.message);
      return {
         id: sessionId,
         message: response.message.content,
      };
   },
};
