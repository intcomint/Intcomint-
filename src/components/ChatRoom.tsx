import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, doc, updateDoc, arrayUnion, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { handleFirestoreError, OperationType } from '../lib/firebaseUtils';
import { useAuth } from './FirebaseProvider';
import { Send, CheckCheck, Video } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { VideoCall } from './VideoCall';

interface Message {
  id: string;
  text: string;
  uid: string;
  createdAt: any;
  readBy?: string[];
}

export function ChatRoom({ friendId }: { friendId?: string }) {
  const user = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [isVideoCall, setIsVideoCall] = useState(false);

  useEffect(() => {
    if (!user) return;
    const chatId = friendId ? [user.uid, friendId].sort().join('_') : 'global';
    const q = query(collection(db, 'chats', chatId, 'messages'), orderBy('createdAt'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: Message[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as Message;
        msgs.push({ id: doc.id, ...data });
        if (data.uid !== user.uid && (!data.readBy || !data.readBy.includes(user.uid))) {
          updateDoc(doc.ref, { readBy: arrayUnion(user.uid) }).catch(console.error);
        }
      });
      setMessages(msgs);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'messages');
    });

    const typingQ = query(collection(db, 'chats', chatId, 'typing'));
    const unsubscribeTyping = onSnapshot(typingQ, (snapshot) => {
      const typing: string[] = [];
      snapshot.forEach((doc) => {
        if (doc.id !== user.uid) typing.push(doc.id);
      });
      setTypingUsers(typing);
    });

    return () => { unsubscribe(); unsubscribeTyping(); };
  }, [user, friendId]);

  const handleTyping = (text: string) => {
    setNewMessage(text);
    const chatId = friendId ? [user!.uid, friendId].sort().join('_') : 'global';
    if (text.length > 0) {
      setDoc(doc(db, 'chats', chatId, 'typing', user!.uid), { timestamp: serverTimestamp() });
    } else {
      deleteDoc(doc(db, 'chats', chatId, 'typing', user!.uid));
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;
    const chatId = friendId ? [user.uid, friendId].sort().join('_') : 'global';
    try {
      await addDoc(collection(db, 'chats', chatId, 'messages'), {
        text: newMessage,
        uid: user.uid,
        createdAt: serverTimestamp(),
        readBy: [user.uid]
      });
      setNewMessage('');
      deleteDoc(doc(db, 'chats', chatId, 'typing', user.uid));
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'messages');
    }
  };

  return (
    <div className="flex flex-col h-screen p-4 bg-emerald-950 text-emerald-100">
      {isVideoCall && <VideoCall onClose={() => setIsVideoCall(false)} />}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-amber-400">Chat</h2>
        <button onClick={() => setIsVideoCall(true)} className="text-amber-400">
          <Video size={24} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn("p-3 rounded-lg max-w-[80%]", msg.uid === user?.uid ? "bg-emerald-700 text-white self-end" : "bg-emerald-800 self-start")}
          >
            {msg.text}
            {msg.uid === user?.uid && (
              <CheckCheck size={14} className={cn("inline ml-2", msg.readBy && msg.readBy.length > 1 ? "text-amber-400" : "text-emerald-400")} />
            )}
          </motion.div>
        ))}
      </div>
      {typingUsers.length > 0 && <p className="text-amber-400 text-xs italic">Someone is typing...</p>}
      <form onSubmit={sendMessage} className="flex gap-2 mt-4">
        <input
          value={newMessage}
          onChange={(e) => handleTyping(e.target.value)}
          className="flex-1 border border-emerald-700 bg-emerald-900 p-2 rounded text-emerald-100"
          placeholder="Type a message..."
        />
        <button type="submit" className="bg-amber-600 text-emerald-950 p-2 rounded">
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}
