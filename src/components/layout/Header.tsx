'use client';

import { Moon, Sun, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useScrumStore } from '@/stores/useScrumStore';

interface HeaderProps {
  onSettingsClick: () => void;
}

export function Header({ onSettingsClick }: HeaderProps) {
  const { theme, toggleTheme } = useScrumStore();

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border">
      <h1 className="text-xl font-bold text-foreground">
        Daily Scrum Timer
      </h1>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label={theme === 'light' ? '다크 모드로 전환' : '라이트 모드로 전환'}
        >
          {theme === 'light' ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onSettingsClick}
          aria-label="설정"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
