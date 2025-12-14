'use client';

import { Palmtree, X, Check, Mic, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useScrumStore } from '@/stores/useScrumStore';
import type { Member } from '@/types';
import { cn } from '@/lib/utils';

interface MemberItemProps {
  member: Member;
  isCurrent?: boolean;
  isNext?: boolean;
}

export function MemberItem({ member, isCurrent, isNext }: MemberItemProps) {
  const { removeMember, toggleVacation, meetingStatus } = useScrumStore();

  const getStatusIcon = () => {
    if (member.isOnVacation) {
      return <Palmtree className="h-4 w-4 text-amber-500" />;
    }
    if (member.isCompleted) {
      return <Check className="h-4 w-4 text-green-500" />;
    }
    if (isCurrent) {
      return <Mic className="h-4 w-4 text-red-500 animate-pulse" />;
    }
    return <Clock className="h-4 w-4 text-muted-foreground" />;
  };

  const getStatusText = () => {
    if (member.isOnVacation) return '휴가';
    if (member.isCompleted) return '완료';
    if (isCurrent) return '진행중';
    if (isNext) return '다음';
    return '대기';
  };

  const formatElapsedTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className={cn(
        'flex items-center justify-between p-3 rounded-lg border transition-colors',
        isCurrent && 'bg-primary/10 border-primary',
        isNext && 'bg-muted/50',
        member.isOnVacation && 'opacity-50',
        member.isCompleted && 'opacity-70'
      )}
    >
      <div className="flex items-center gap-3">
        {getStatusIcon()}
        <span
          className={cn(
            'font-medium',
            isCurrent && 'text-primary font-bold',
            member.isOnVacation && 'line-through'
          )}
        >
          {member.name}
        </span>
        <span className="text-xs text-muted-foreground">
          ({getStatusText()})
        </span>
        {member.elapsedTime > 0 && !member.isOnVacation && (
          <span className="text-xs font-mono text-muted-foreground">
            {formatElapsedTime(member.elapsedTime)}
          </span>
        )}
      </div>
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => toggleVacation(member.id)}
          disabled={meetingStatus === 'running'}
          title={member.isOnVacation ? '휴가 해제' : '휴가 설정'}
        >
          <Palmtree
            className={cn(
              'h-4 w-4',
              member.isOnVacation ? 'text-amber-500' : 'text-muted-foreground'
            )}
          />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-destructive hover:text-destructive"
          onClick={() => removeMember(member.id)}
          disabled={meetingStatus === 'running'}
          title="삭제"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
