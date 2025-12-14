'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useScrumStore } from '@/stores/useScrumStore';

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TIME_OPTIONS = [
  { value: 30, label: '30초' },
  { value: 60, label: '1분' },
  { value: 90, label: '1분 30초' },
  { value: 120, label: '2분' },
  { value: 180, label: '3분' },
  { value: 300, label: '5분' },
];

const EXTEND_OPTIONS = [
  { value: 15, label: '15초' },
  { value: 30, label: '30초' },
  { value: 60, label: '1분' },
];

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const {
    defaultTime,
    extendUnit,
    soundEnabled,
    warningEnabled,
    setDefaultTime,
    setExtendUnit,
    setSoundEnabled,
    setWarningEnabled,
  } = useScrumStore();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>설정</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Timer Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground">
              ⏱️ 타이머 설정
            </h3>

            <div className="space-y-2">
              <Label>기본 시간</Label>
              <div className="flex flex-wrap gap-2">
                {TIME_OPTIONS.map((option) => (
                  <Button
                    key={option.value}
                    variant={defaultTime === option.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDefaultTime(option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>연장 단위</Label>
              <div className="flex flex-wrap gap-2">
                {EXTEND_OPTIONS.map((option) => (
                  <Button
                    key={option.value}
                    variant={extendUnit === option.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setExtendUnit(option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Alert Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground">
              🔔 알림 설정
            </h3>

            <div className="flex items-center justify-between">
              <Label htmlFor="sound-enabled">소리 알림</Label>
              <Switch
                id="sound-enabled"
                checked={soundEnabled}
                onCheckedChange={setSoundEnabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="warning-enabled">10초 경고음</Label>
              <Switch
                id="warning-enabled"
                checked={warningEnabled}
                onCheckedChange={setWarningEnabled}
                disabled={!soundEnabled}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
