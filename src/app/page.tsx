'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { MemberList } from '@/components/member/MemberList';
import { CircularTimer } from '@/components/timer/CircularTimer';
import { TimerControls } from '@/components/timer/TimerControls';
import { SpeakerDisplay } from '@/components/timer/SpeakerDisplay';
import { SettingsModal } from '@/components/settings/SettingsModal';
import { useTimer } from '@/hooks/useTimer';
import { useTimerAlerts } from '@/hooks/useTimerAlerts';
import { useScrumStore } from '@/stores/useScrumStore';

export default function Home() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { members, shuffledOrder, currentMemberIndex, meetingStatus } = useScrumStore();

  // Initialize hooks
  useTimer();
  useTimerAlerts();

  // Calculate meeting stats
  const totalElapsedTime = members.reduce((sum, m) => sum + m.elapsedTime, 0);
  const remainingCount = meetingStatus !== 'idle' && meetingStatus !== 'completed'
    ? shuffledOrder.length - currentMemberIndex - 1
    : 0;
  const completedCount = meetingStatus !== 'idle'
    ? currentMemberIndex + (meetingStatus === 'completed' ? 1 : 0)
    : 0;

  const formatElapsedTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}분 ${secs}초`;
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <Header onSettingsClick={() => setIsSettingsOpen(true)} />
      <main className="flex-1 container mx-auto px-4 py-4 max-w-4xl flex flex-col gap-4 overflow-hidden">
        {/* Speaker Display */}
        <SpeakerDisplay />

        {/* Timer with Scrum Guide */}
        <div className="flex justify-center items-center gap-6 shrink-0">
          {/* Scrum Guide - Left */}
          <div className="flex flex-col gap-2 text-sm text-muted-foreground w-28">
            <div>📋 어제 한 일</div>
            <div>🎯 오늘 할 일</div>
            <div>🚧 장애 요소</div>
          </div>

          <CircularTimer />

          {/* Meeting Status - Right */}
          <div className="flex flex-col gap-2 text-sm text-muted-foreground w-28">
            <div>⏱️ {formatElapsedTime(totalElapsedTime)}</div>
            <div>✅ 완료 {completedCount}명</div>
            <div>⏳ 대기 {remainingCount}명</div>
          </div>
        </div>

        {/* Controls */}
        <div className="shrink-0">
          <TimerControls />
        </div>

        {/* Member List */}
        <div className="flex-1 min-h-0">
          <MemberList />
        </div>
      </main>

      {/* Settings Modal */}
      <SettingsModal open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
    </div>
  );
}
