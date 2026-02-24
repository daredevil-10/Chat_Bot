import { Button } from './ui/button';
import { FaArrowUp } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useState } from 'react';

type FormData = {
   prompt: string;
};

type ChatResponse = {
   message: string;
   sessionId: string;
};

type Messages = {
   content: string;
   role: 'user' | 'bot';
};

const Chatbot = () => {
   const [messages, setMessages] = useState<Messages[]>([]);
   const [sessionId, setSessionId] = useState<string | null>(null);
   const { register, handleSubmit, reset, formState } = useForm<FormData>({
      mode: 'onChange',
   });
   const onSubmit = async ({ prompt }: FormData) => {
      try {
         setMessages((prev) => [...prev, { content: prompt, role: 'user' }]);
         reset();
         const { data } = await axios.post<ChatResponse>('/api/chat', {
            prompt,
            ...(sessionId && { sessionId }),
         });
         setSessionId(data.sessionId);

         setMessages((prev) => [
            ...prev,
            { content: data.message, role: 'bot' },
         ]);
      } catch (err: unknown) {
         if (axios.isAxiosError(err)) {
            console.error(err.response?.data);
         } else {
            console.error(err);
         }
      }
   };
   const onKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         handleSubmit(onSubmit)();
      }
   };
   return (
      <div>
         <div className="flex flex-col gap-3 mb-10">
            {messages.map((message, index) => (
               <p
                  key={index}
                  className={`px-3 py-1 rounded-xl  ${
                     message.role === 'user'
                        ? 'bg-blue-600 text-white self-end'
                        : 'bg-gray-100 text-black self-start'
                  }`}
               >
                  {message.content}
               </p>
            ))}
         </div>
         <form
            onSubmit={handleSubmit(onSubmit)}
            onKeyDown={onKeyDown}
            className="flex flex-col gap-2 items-end border-2 p-4 rounded-3xl"
         >
            <textarea
               {...register('prompt', {
                  required: true,
                  validate: (data) => data.trim().length > 0,
               })}
               className="w-full border-0 focus:outline-0 resize-none "
               placeholder="Ask anything"
               maxLength={1000}
            />
            <Button
               disabled={!formState.isValid}
               className="rounded-full w-9 h-9"
            >
               <FaArrowUp />
            </Button>
         </form>
      </div>
   );
};

export default Chatbot;
