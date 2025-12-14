'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Mic } from 'lucide-react';
import { useScrumStore } from '@/stores/useScrumStore';

export function SpeakerDisplay() {
  const { members, shuffledOrder, currentMemberIndex, meetingStatus } =
    useScrumStore();

  if (meetingStatus === 'idle' || shuffledOrder.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground">
          미팅을 시작하면 발표자가 표시됩니다
        </p>
      </div>
    );
  }

  if (meetingStatus === 'completed') {
    return (
      <div className="text-center py-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-2xl font-bold text-green-500"
        >
          🎉 미팅 완료!
        </motion.div>
      </div>
    );
  }

  const currentMemberId = shuffledOrder[currentMemberIndex];
  const nextMemberId = shuffledOrder[currentMemberIndex + 1];

  const currentMember = members.find((m) => m.id === currentMemberId);
  const nextMember = members.find((m) => m.id === nextMemberId);

  return (
    <div className="text-center space-y-2">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMemberId}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          className="flex items-center justify-center gap-2"
        >
          <Mic className="h-6 w-6 text-red-500 animate-pulse" />
          <span className="text-3xl font-bold text-foreground">
            {currentMember?.name || '-'}
          </span>
        </motion.div>
      </AnimatePresence>

      {nextMember && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-base text-amber-500"
        >
          📢 {nextMember.name}님 준비하세요!
        </motion.p>
      )}

      {!nextMember && (
        <p className="text-sm text-muted-foreground">
          마지막 발표자입니다
        </p>
      )}
    </div>
  );
}
