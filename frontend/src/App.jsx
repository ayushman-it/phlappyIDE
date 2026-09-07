import React from 'react';
import { StudioHeader } from './components/studio/StudioHeader';
import { TopicBar } from './components/studio/TopicBar';
import { LeftPanel } from './components/studio/LeftPanel';
import { CenterPanel } from './components/studio/CenterPanel';
import { RightPanel } from './components/studio/RightPanel';
import { FlappyWidget } from './components/studio/FlappyWidget';
import { VirtualCursor } from './components/studio/VirtualCursor';
import { GenerateModal } from './components/studio/GenerateModal';

export default function App() {
  return (
    <div className="h-screen w-screen flex flex-col bg-slate-100 font-sans overflow-hidden antialiased text-slate-900 relative">
      {/* Studio Header Navigation */}
      <StudioHeader />

      {/* Prominent Topic Input & AI Generator Bar */}
      <TopicBar />

      {/* Main Studio Workspace Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        <LeftPanel />
        <CenterPanel />
        <RightPanel />

        {/* Flappy AI Mentor Floating Speech Widget */}
        <FlappyWidget />

        {/* Automatic Animated Virtual Mouse Pointer */}
        <VirtualCursor />
      </div>

      {/* AI Lesson Generator Modal */}
      <GenerateModal />
    </div>
  );
}
