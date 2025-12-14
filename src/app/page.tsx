'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { MemberList } from '@/components/member/MemberList';

export default function Home() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header onSettingsClick={() => setIsSettingsOpen(true)} />
      <main className="container mx-auto px-4 py-8 max-w-2xl space-y-6">
        {/* Speaker display and Timer will be added here */}
        <div className="text-center text-muted-foreground py-8">
          <p className="text-sm">타이머 컴포넌트 (Sprint 4에서 추가)</p>
        </div>

        {/* Member List */}
        <MemberList />
      </main>
    </div>
  );
}
