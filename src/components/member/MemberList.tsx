'use client';

import { useScrumStore } from '@/stores/useScrumStore';
import { MemberInput } from './MemberInput';
import { MemberItem } from './MemberItem';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function MemberList() {
  const { members, shuffledOrder, currentMemberIndex, meetingStatus } =
    useScrumStore();

  // Get the display order based on shuffled order
  const getDisplayMembers = () => {
    if (shuffledOrder.length === 0) {
      return members;
    }

    // Show in shuffled order (excluding vacation members)
    const orderedMembers = shuffledOrder
      .map((id) => members.find((m) => m.id === id))
      .filter((m): m is NonNullable<typeof m> => m !== undefined && !m.isOnVacation);

    // Add vacation members at the end
    const vacationMembers = members.filter((m) => m.isOnVacation);
    return [...orderedMembers, ...vacationMembers];
  };

  const displayMembers = getDisplayMembers();
  const isMeetingActive = meetingStatus === 'running' || meetingStatus === 'paused';
  const currentMemberId =
    isMeetingActive && shuffledOrder.length > 0 ? shuffledOrder[currentMemberIndex] : null;
  const nextMemberId =
    isMeetingActive && shuffledOrder.length > currentMemberIndex + 1
      ? shuffledOrder[currentMemberIndex + 1]
      : null;

  const activeCount = members.filter((m) => !m.isOnVacation).length;
  const totalCount = members.length;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>미팅 참여자</span>
          <span className="text-sm font-normal text-muted-foreground">
            {activeCount}명 참여 / {totalCount}명
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <MemberInput />
        <div className="space-y-2">
          {displayMembers.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              팀원을 추가해주세요
            </p>
          ) : (
            displayMembers.map((member) => (
              <MemberItem
                key={member.id}
                member={member}
                isCurrent={member.id === currentMemberId}
                isNext={member.id === nextMemberId}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
