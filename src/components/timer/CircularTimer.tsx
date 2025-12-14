'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useScrumStore } from '@/stores/useScrumStore';

export function CircularTimer() {
  const { timeLeft, totalTime } = useScrumStore();

  const progress = totalTime > 0 ? timeLeft / totalTime : 1;
  const percentage = progress * 100;

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
  const size = 240;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - progress * circumference;

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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

      {/* Time display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          key={timeLeft}
          initial={{ scale: 1.1, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-5xl font-bold tabular-nums"
          style={{ color: getColor }}
        >
          {formatTime(timeLeft)}
        </motion.span>
        <span className="text-sm text-muted-foreground mt-1">
          / {formatTime(totalTime)}
        </span>
      </div>
    </div>
  );
}
