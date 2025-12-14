'use client';

import { Shuffle, PlayCircle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useScrumStore } from '@/stores/useScrumStore';

export function TimerControls() {
  const {
    meetingStatus,
    members,
    shuffleMembers,
    startMeeting,
    resetMeeting,
  } = useScrumStore();

  const activeMembers = members.filter((m) => !m.isOnVacation);
  const canStartMeeting = activeMembers.length > 0;

  return (
    <div className="flex items-center justify-center gap-2">
      {/* Start meeting */}
      <Button
        onClick={startMeeting}
        disabled={!canStartMeeting || meetingStatus === 'running'}
      >
        <PlayCircle className="h-4 w-4 mr-1" />
        미팅 시작
      </Button>

      {/* Reset meeting */}
      <Button
        variant="outline"
        onClick={resetMeeting}
      >
        <RefreshCcw className="h-4 w-4 mr-1" />
        미팅 리셋
      </Button>

      {/* Shuffle */}
      <Button
        variant="secondary"
        onClick={shuffleMembers}
        disabled={!canStartMeeting || meetingStatus === 'running'}
      >
        <Shuffle className="h-4 w-4 mr-1" />
        셔플
      </Button>
    </div>
  );
}
