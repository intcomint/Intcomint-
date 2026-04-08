/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { FirebaseProvider, useAuth } from './components/FirebaseProvider';
import { ChatRoom } from './components/ChatRoom';
import { Login } from './components/Login';
import { Navigation } from './components/Navigation';
import { AIChat } from './components/AIChat';
import { Profile } from './components/Profile';
import { Camera } from './components/Camera';
import { Friends } from './components/Friends';
import { Dashboard } from './components/Dashboard';
import { KnowledgeGuardians } from './components/KnowledgeGuardians';

function AppContent() {
  const user = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedFriendId, setSelectedFriendId] = useState<string | undefined>();

  if (!user) return <Login />;

  return (
    <div className="pb-20 md:pb-0 md:pl-20">
      {activeTab === 'dashboard' && <Dashboard />}
      {activeTab === 'chat' && <ChatRoom friendId={selectedFriendId} />}
      {activeTab === 'ai' && <AIChat />}
      {activeTab === 'profile' && <Profile />}
      {activeTab === 'camera' && <Camera />}
      {activeTab === 'friends' && <Friends onChat={(id) => { setSelectedFriendId(id); setActiveTab('chat'); }} />}
      {activeTab === 'guardians' && <KnowledgeGuardians />}
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default function App() {
  return (
    <FirebaseProvider>
      <AppContent />
    </FirebaseProvider>
  );
}
