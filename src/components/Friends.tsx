import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, where, onSnapshot, updateDoc, doc, arrayUnion, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './FirebaseProvider';
import { UserPlus, Check, X } from 'lucide-react';
import { motion } from 'motion/react';

export function Friends({ onChat }: { onChat: (id: string) => void }) {
  const user = useAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [friends, setFriends] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'friendRequests'), where('to', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reqs: any[] = [];
      snapshot.forEach((doc) => reqs.push({ id: doc.id, ...doc.data() }));
      setRequests(reqs);
    });

    const userDocRef = doc(db, 'users', user.uid);
    const unsubscribeFriends = onSnapshot(userDocRef, (doc) => {
      if (doc.exists()) {
        setFriends(doc.data().friends || []);
      }
    });

    return () => { unsubscribe(); unsubscribeFriends(); };
  }, [user]);

  const acceptRequest = async (request: any) => {
    await updateDoc(doc(db, 'users', user!.uid), { friends: arrayUnion(request.from) });
    await updateDoc(doc(db, 'users', request.from), { friends: arrayUnion(user!.uid) });
    await deleteDoc(doc(db, 'friendRequests', request.id));
  };

  return (
    <div className="p-6 bg-emerald-950 text-emerald-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-amber-400">Friend Requests</h2>
      <div className="space-y-4 mb-8">
        {requests.map(req => (
          <div key={req.id} className="flex justify-between items-center bg-emerald-900 p-4 rounded">
            <span>User {req.from}</span>
            <div className="flex gap-2">
              <button onClick={() => acceptRequest(req)} className="bg-emerald-700 p-2 rounded"><Check size={16} /></button>
              <button className="bg-red-700 p-2 rounded"><X size={16} /></button>
            </div>
          </div>
        ))}
      </div>
      <h2 className="text-2xl font-bold mb-6 text-amber-400">Friends</h2>
      <div className="space-y-4">
        {friends.map(friendId => (
          <div key={friendId} className="flex justify-between items-center bg-emerald-900 p-4 rounded">
            <span>User {friendId}</span>
            <button onClick={() => onChat(friendId)} className="bg-amber-600 text-emerald-950 p-2 rounded">Chat</button>
          </div>
        ))}
      </div>
    </div>
  );
}
