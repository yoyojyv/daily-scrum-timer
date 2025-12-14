'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { MemberList } from '@/components/member/MemberList';
import { CircularTimer } from '@/components/timer/CircularTimer';
import { TimerControls } from '@/components/timer/TimerControls';
import { SpeakerDisplay } from '@/components/timer/SpeakerDisplay';
import { useTimer } from '@/hooks/useTimer';

export default function Home() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Initialize timer hook
  useTimer();

  return (
    <div className="min-h-screen bg-background">
      <Header onSettingsClick={() => setIsSettingsOpen(true)} />
      <main className="container mx-auto px-4 py-8 max-w-2xl space-y-6">
        {/* Speaker Display */}
        <SpeakerDisplay />

        {/* Timer */}
        <div className="flex justify-center">
          <CircularTimer />
        </div>

        {/* Controls */}
        <TimerControls />

        {/* Member List */}
        <MemberList />
      </main>
    </div>
  );
}
