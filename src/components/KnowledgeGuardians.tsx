import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, X } from 'lucide-react';

export function KnowledgeGuardians() {
  const [guardians, setGuardians] = useState<any[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', subject: '', description: '', level: '' });

  useEffect(() => {
    const q = collection(db, 'educationalEntities');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: any[] = [];
      snapshot.forEach((doc) => data.push({ id: doc.id, ...doc.data() }));
      setGuardians(data);
    });
    return unsubscribe;
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'educationalEntities'), formData);
      setIsFormOpen(false);
      setFormData({ name: '', subject: '', description: '', level: '' });
    } catch (error) {
      console.error('Error adding guardian:', error);
    }
  };

  return (
    <div className="p-6 bg-emerald-950 text-emerald-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-amber-400">Knowledge Guardians</h2>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 bg-amber-600 text-emerald-950 px-4 py-2 rounded-lg font-bold hover:bg-amber-500"
        >
          <Plus size={20} /> Create New Guardian
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {guardians.map(g => (
          <div key={g.id} className="bg-emerald-900 p-4 rounded-xl border border-emerald-700">
            <h3 className="text-lg font-bold text-amber-400">{g.name}</h3>
            <p className="text-sm text-emerald-300">{g.subject} - {g.level}</p>
            <p className="mt-2 text-emerald-100">{g.description}</p>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
          >
            <motion.form
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onSubmit={handleSubmit}
              className="bg-emerald-900 p-6 rounded-xl border border-emerald-700 w-full max-w-md space-y-4"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-amber-400">New Guardian</h3>
                <button onClick={() => setIsFormOpen(false)} className="text-emerald-400"><X /></button>
              </div>
              <input placeholder="Name" className="w-full p-2 rounded bg-emerald-800" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              <input placeholder="Subject" className="w-full p-2 rounded bg-emerald-800" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} required />
              <textarea placeholder="Description" className="w-full p-2 rounded bg-emerald-800" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
              <input placeholder="Level" className="w-full p-2 rounded bg-emerald-800" value={formData.level} onChange={e => setFormData({...formData, level: e.target.value})} required />
              <button type="submit" className="w-full bg-amber-600 text-emerald-950 py-2 rounded font-bold">Save Guardian</button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
