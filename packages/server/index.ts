import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import { Ollama } from 'ollama';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const OllamaClient = new Ollama();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.get('/', (req: Request, res: Response) => {
   res.send('Hello World! This is a test response.');
});
app.get('/api/hello', (req: Request, res: Response) => {
   res.send({ message: 'Hello World!' });
});
const sessions: Record<string, any[]> = {};
app.post('/api/chat', async (req: Request, res: Response) => {
   let { sessionId, prompt } = req.body;
   if (!sessionId) {
      sessionId = uuidv4();
      sessions[sessionId] = [];
   }
   const history = (sessions[sessionId] ??= []);
   /* if (!sessions[sessionId]) {
       sessions[sessionId] = [];
   }
     const history = sessions[sessionId];*/

   history.push({ role: 'user', content: prompt });

   const response = await OllamaClient.chat({
      model: 'llama3.1',
      messages: history,
      options: {
         num_predict: 100,
      },
   });
   history?.push(response.message);
   res.json({ sessionId, message: response.message.content });
});

app.listen(port, (): void => {
   console.log(`Server is running on port http://localhost:${port}`);
});
