import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { motion } from 'motion/react';

export function KnowledgeGuardians() {
  const [guardians, setGuardians] = useState<any[]>([]);

  useEffect(() => {
    const q = collection(db, 'educationalEntities');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: any[] = [];
      snapshot.forEach((doc) => data.push({ id: doc.id, ...doc.data() }));
      setGuardians(data);
    });
    return unsubscribe;
  }, []);

  return (
    <div className="p-6 bg-emerald-950 text-emerald-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-amber-400">Knowledge Guardians</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {guardians.map(g => (
          <div key={g.id} className="bg-emerald-900 p-4 rounded-xl border border-emerald-700">
            <h3 className="text-lg font-bold text-amber-400">{g.name}</h3>
            <p className="text-sm text-emerald-300">{g.subject} - {g.level}</p>
            <p className="mt-2 text-emerald-100">{g.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
