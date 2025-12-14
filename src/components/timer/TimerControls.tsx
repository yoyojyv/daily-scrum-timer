'use client';

import { Play, Pause, SkipForward, RotateCcw, Plus, Shuffle, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useScrumStore } from '@/stores/useScrumStore';

export function TimerControls() {
  const {
    isRunning,
    meetingStatus,
    members,
    extendUnit,
    startTimer,
    pauseTimer,
    resetTimer,
    extendTime,
    nextMember,
    shuffleMembers,
    startMeeting,
  } = useScrumStore();

  const activeMembers = members.filter((m) => !m.isOnVacation);
  const canStartMeeting = activeMembers.length > 0;

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Main controls */}
      <div className="flex items-center gap-2">
        {/* Play/Pause */}
        <Button
          size="lg"
          onClick={isRunning ? pauseTimer : startTimer}
          disabled={meetingStatus === 'idle' || meetingStatus === 'completed'}
          className="w-24"
        >
          {isRunning ? (
            <>
              <Pause className="h-5 w-5 mr-1" />
              정지
            </>
          ) : (
            <>
              <Play className="h-5 w-5 mr-1" />
              시작
            </>
          )}
        </Button>

        {/* Extend time */}
        <Button
          variant="outline"
          size="lg"
          onClick={() => extendTime(extendUnit)}
          disabled={meetingStatus === 'idle' || meetingStatus === 'completed'}
        >
          <Plus className="h-4 w-4 mr-1" />
          {extendUnit}초
        </Button>

        {/* Next member */}
        <Button
          variant="outline"
          size="lg"
          onClick={nextMember}
          disabled={meetingStatus === 'idle' || meetingStatus === 'completed'}
        >
          <SkipForward className="h-4 w-4 mr-1" />
          다음
        </Button>

        {/* Reset */}
        <Button
          variant="ghost"
          size="lg"
          onClick={resetTimer}
          disabled={meetingStatus === 'idle'}
        >
          <RotateCcw className="h-4 w-4 mr-1" />
          리셋
        </Button>
      </div>

      {/* Meeting controls */}
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          onClick={shuffleMembers}
          disabled={!canStartMeeting || meetingStatus === 'running'}
        >
          <Shuffle className="h-4 w-4 mr-1" />
          순서 셔플
        </Button>

        <Button
          onClick={startMeeting}
          disabled={!canStartMeeting || meetingStatus === 'running'}
        >
          <PlayCircle className="h-4 w-4 mr-1" />
          미팅 시작
        </Button>
      </div>
    </div>
  );
}
