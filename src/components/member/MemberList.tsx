'use client';

import { useScrumStore } from '@/stores/useScrumStore';
import { MemberInput } from './MemberInput';
import { MemberItem } from './MemberItem';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function MemberList() {
  const { members, shuffledOrder, currentMemberIndex, meetingStatus } =
    useScrumStore();

  // Get the display order based on meeting status
  const getDisplayMembers = () => {
    if (meetingStatus === 'idle' || shuffledOrder.length === 0) {
      return members;
    }

    // During meeting, show in shuffled order
    const orderedMembers = shuffledOrder
      .map((id) => members.find((m) => m.id === id))
      .filter((m): m is NonNullable<typeof m> => m !== undefined);

    // Add vacation members at the end
    const vacationMembers = members.filter((m) => m.isOnVacation);
    return [...orderedMembers, ...vacationMembers];
  };

  const displayMembers = getDisplayMembers();
  const currentMemberId =
    shuffledOrder.length > 0 ? shuffledOrder[currentMemberIndex] : null;
  const nextMemberId =
    shuffledOrder.length > currentMemberIndex + 1
      ? shuffledOrder[currentMemberIndex + 1]
      : null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">팀원 목록</CardTitle>
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
