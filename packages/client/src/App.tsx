import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

function App() {
   const [message, setMessage] = useState('');

   useEffect(() => {
      fetch('/api/hello')
         .then((response) => response.json())
         .then((data) => setMessage(data.message))
         .catch((error) => console.error('Error:', error));
   }, []);

   return (
      <div className="flex flex-col items-center justify-center h-screen">
         <p className="text-red-500 font-bold ">{message}</p>
         <Button>Click me</Button>
      </div>
   );
}

export default App;
