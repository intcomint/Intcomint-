import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Send } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export function AIChat() {
  const [messages, setMessages] = useState<{ text: string, isUser: boolean }[]>([]);
  const [input, setInput] = useState('');

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const userMsg = { text: input, isUser: true };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    try {
      const result = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite-preview',
        contents: [{ role: 'user', parts: [{ text: input }] }],
      });
      setMessages(prev => [...prev, { text: result.text || '', isUser: false }]);
    } catch (error) {
      console.error('AI Error:', error);
    }
  };

  return (
    <div className="flex flex-col h-screen p-4 pb-20 bg-emerald-950 text-emerald-100">
      <div className="flex-1 overflow-y-auto space-y-4">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: msg.isUser ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={cn("p-3 rounded-lg max-w-[80%]", msg.isUser ? "bg-emerald-700 text-white self-end" : "bg-emerald-800 self-start")}
          >
            {msg.text}
          </motion.div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="flex gap-2 mt-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border border-emerald-700 bg-emerald-900 p-2 rounded text-emerald-100"
          placeholder="Ask AI..."
        />
        <button type="submit" className="bg-amber-600 text-emerald-950 p-2 rounded">
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}
