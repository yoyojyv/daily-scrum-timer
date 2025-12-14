'use client';

import { useEffect, useRef } from 'react';
import { useScrumStore } from '@/stores/useScrumStore';

export function useTimer() {
  const { isRunning, timeLeft, tick, pauseTimer } = useScrumStore();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        tick();
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, timeLeft, tick]);

  // Auto pause when time reaches 0
  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      pauseTimer();
    }
  }, [timeLeft, isRunning, pauseTimer]);
}
