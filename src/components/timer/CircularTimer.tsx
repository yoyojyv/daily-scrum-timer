'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Plus, RotateCcw, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useScrumStore } from '@/stores/useScrumStore';

export function CircularTimer() {
  const {
    timeLeft,
    totalTime,
    isRunning,
    meetingStatus,
    extendUnit,
    defaultTime,
    startTimer,
    pauseTimer,
    extendTime,
    resetTimer,
    nextMember,
  } = useScrumStore();

  // Use defaultTime when idle to ensure correct display after hydration
  const displayTime = meetingStatus === 'idle' ? defaultTime : timeLeft;
  const displayTotal = meetingStatus === 'idle' ? defaultTime : totalTime;

  const progress = displayTotal > 0 ? displayTime / displayTotal : 1;
  const percentage = progress * 100;
  const isRed = percentage <= 20;

  // Calculate color based on remaining time percentage
  const getColor = useMemo(() => {
    if (percentage > 50) {
      return '#22c55e'; // Green
    } else if (percentage > 20) {
      return '#eab308'; // Yellow
    } else {
      return '#ef4444'; // Red
    }
  }, [percentage]);

  // SVG circle parameters
  const size = 300;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - progress * circumference;

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const canControl = meetingStatus !== 'idle' && meetingStatus !== 'completed';

  return (
    <div className="relative flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/30"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
      </svg>

      {/* Time display and controls */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-6xl font-bold tabular-nums"
          style={{ color: getColor }}
          animate={isRed && isRunning ? { opacity: [1, 0.4, 1] } : { opacity: 1 }}
          transition={isRed && isRunning ? { duration: 0.6, repeat: Infinity } : {}}
        >
          {formatTime(displayTime)}
        </motion.span>

        {/* Play/Pause and Next buttons */}
        <div className="flex items-center gap-1 mt-2">
          <Button
            variant="ghost"
            size="lg"
            onClick={isRunning ? pauseTimer : startTimer}
            disabled={!canControl}
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
          <Button
            variant="ghost"
            size="lg"
            onClick={nextMember}
            disabled={!canControl}
          >
            <SkipForward className="h-5 w-5 mr-1" />
            다음
          </Button>
        </div>

        {/* Extend and Reset buttons */}
        <div className="flex items-center gap-1 mt-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => extendTime(extendUnit)}
            disabled={!canControl}
          >
            <Plus className="h-4 w-4 mr-1" />
            {extendUnit}초
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetTimer}
            disabled={!canControl}
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            리셋
          </Button>
        </div>
      </div>
    </div>
  );
}
