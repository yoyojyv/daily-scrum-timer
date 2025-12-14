'use client';

import { useEffect, useRef } from 'react';
import { useScrumStore } from '@/stores/useScrumStore';

export function useTimerAlerts() {
  const { timeLeft, isRunning, soundEnabled, warningEnabled } = useScrumStore();
  const hasPlayedWarning = useRef(false);
  const hasPlayedComplete = useRef(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize AudioContext on first user interaction
  useEffect(() => {
    const initAudio = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
    };

    window.addEventListener('click', initAudio, { once: true });
    return () => window.removeEventListener('click', initAudio);
  }, []);

  // Play beep sound
  const playBeep = (frequency: number, duration: number, volume: number = 0.3) => {
    if (!audioContextRef.current || !soundEnabled) return;

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  };

  // 10 second warning
  useEffect(() => {
    if (isRunning && timeLeft === 10 && warningEnabled && !hasPlayedWarning.current) {
      playBeep(880, 0.2); // A5 note, short beep
      hasPlayedWarning.current = true;
    }

    // Reset warning flag when time resets
    if (timeLeft > 10) {
      hasPlayedWarning.current = false;
    }
  }, [timeLeft, isRunning, warningEnabled]);

  // Time complete alert
  useEffect(() => {
    if (timeLeft === 0 && !hasPlayedComplete.current) {
      // Play completion sound (two beeps)
      playBeep(660, 0.15);
      setTimeout(() => playBeep(880, 0.3), 200);
      hasPlayedComplete.current = true;
    }

    // Reset complete flag when time resets
    if (timeLeft > 0) {
      hasPlayedComplete.current = false;
    }
  }, [timeLeft]);

  return { playBeep };
}
