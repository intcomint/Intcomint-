import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, GraduationCap, Users, Video } from 'lucide-react';

export function Dashboard({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const stages = [
    { title: 'Kindergarten', icon: BookOpen },
    { title: 'Elementary', icon: BookOpen },
    { title: 'Middle School', icon: BookOpen },
    { title: 'High School', icon: GraduationCap },
    { title: 'University', icon: GraduationCap },
  ];

  return (
    <div className="p-6 bg-emerald-950 text-emerald-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-amber-400">مرحباً بك في بن مرشد</h1>
      <div className="grid grid-cols-2 gap-4">
        {stages.map((stage) => (
          <motion.button
            key={stage.title}
            whileHover={{ scale: 1.05 }}
            onClick={() => setActiveTab('ai')}
            className="bg-emerald-900 p-6 rounded-xl flex flex-col items-center gap-3 border border-emerald-700"
          >
            <stage.icon size={32} className="text-amber-400" />
            <span className="font-semibold">{stage.title}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
