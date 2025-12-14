'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';

export default function Home() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header onSettingsClick={() => setIsSettingsOpen(true)} />
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center text-muted-foreground">
          <p>Sprint 1 완료 - 기본 설정 완료</p>
          <p className="mt-2 text-sm">다음: Sprint 2 (다크모드), Sprint 3 (팀원 관리)</p>
        </div>
      </main>
    </div>
  );
}
