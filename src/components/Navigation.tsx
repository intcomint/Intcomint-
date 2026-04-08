import { MessageSquare, Bot, Camera, Video, User, Users, LayoutDashboard, BrainCircuit } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export function Navigation({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) {
  const tabs = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Home' },
    { id: 'chat', icon: MessageSquare, label: 'Chat' },
    { id: 'ai', icon: Bot, label: 'AI' },
    { id: 'camera', icon: Camera, label: 'Camera' },
    { id: 'video', icon: Video, label: 'Video' },
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'friends', icon: Users, label: 'Friends' },
    { id: 'guardians', icon: BrainCircuit, label: 'Guardians' },
  ];

  return (
    <div className="fixed bottom-0 w-full bg-emerald-900 border-t border-emerald-700 flex justify-around p-4 md:top-0 md:left-0 md:h-screen md:w-20 md:flex-col md:justify-start md:gap-8 md:p-6 md:border-r md:border-t-0">
      {tabs.map((tab) => (
        <motion.button
          key={tab.id}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setActiveTab(tab.id)}
          className={cn("flex flex-col items-center", activeTab === tab.id ? "text-amber-400" : "text-emerald-400")}
        >
          <tab.icon size={24} />
          <span className="text-xs md:hidden">{tab.label}</span>
        </motion.button>
      ))}
    </div>
  );
}
