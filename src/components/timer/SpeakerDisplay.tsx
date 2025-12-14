'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Mic } from 'lucide-react';
import { useScrumStore } from '@/stores/useScrumStore';

export function SpeakerDisplay() {
  const { members, shuffledOrder, currentMemberIndex, meetingStatus, timeLeft } =
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

  const showPrepareMessage = timeLeft === 0;

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
          <Mic className="h-5 w-5 text-primary animate-pulse" />
          <span className="text-2xl font-bold text-foreground">
            현재: {currentMember?.name || '-'}
          </span>
        </motion.div>
      </AnimatePresence>

      {nextMember && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showPrepareMessage ? 1 : 0.5 }}
          className={`text-sm ${showPrepareMessage ? 'text-primary font-semibold' : 'text-muted-foreground'}`}
        >
          {showPrepareMessage ? (
            <motion.span
              initial={{ scale: 0.9 }}
              animate={{ scale: [0.9, 1.05, 1] }}
              transition={{ duration: 0.3 }}
            >
              📢 {nextMember.name}님 준비하세요!
            </motion.span>
          ) : (
            <span>다음: {nextMember.name}</span>
          )}
        </motion.div>
      )}

      {!nextMember && (
        <p className="text-sm text-muted-foreground">
          마지막 발표자입니다
        </p>
      )}
    </div>
  );
}
