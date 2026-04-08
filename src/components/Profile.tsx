import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './FirebaseProvider';
import { User, Save } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export function Profile() {
  const user = useAuth();
  const [profile, setProfile] = useState({ displayName: '', avatarUrl: '', bio: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProfile(docSnap.data() as any);
      }
      setLoading(false);
    };
    fetchProfile();
  }, [user]);

  const saveProfile = async () => {
    if (!user) return;
    await setDoc(doc(db, 'users', user.uid), profile, { merge: true });
    alert('Profile saved!');
  };

  if (loading) return <div className="p-4 text-emerald-100">Loading...</div>;

  return (
    <div className="p-6 bg-emerald-950 text-emerald-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-amber-400">Edit Profile</h2>
      <div className="space-y-4">
        <input
          value={profile.displayName}
          onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
          className="w-full border border-emerald-700 bg-emerald-900 p-3 rounded"
          placeholder="Display Name"
        />
        <input
          value={profile.avatarUrl}
          onChange={(e) => setProfile({ ...profile, avatarUrl: e.target.value })}
          className="w-full border border-emerald-700 bg-emerald-900 p-3 rounded"
          placeholder="Avatar URL"
        />
        <textarea
          value={profile.bio}
          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
          className="w-full border border-emerald-700 bg-emerald-900 p-3 rounded h-24"
          placeholder="Short Bio"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={saveProfile}
          className="flex items-center gap-2 bg-amber-600 text-emerald-950 px-6 py-3 rounded-full font-semibold"
        >
          <Save size={20} />
          Save Profile
        </motion.button>
      </div>
    </div>
  );
}
