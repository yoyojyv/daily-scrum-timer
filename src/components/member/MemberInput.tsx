'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useScrumStore } from '@/stores/useScrumStore';

export function MemberInput() {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { members, addMember } = useScrumStore();

  const isDuplicate = (inputName: string) => {
    return members.some(
      (m) => m.name.toLowerCase() === inputName.trim().toLowerCase()
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName) return;

    if (isDuplicate(trimmedName)) {
      setError('이미 존재하는 이름입니다');
      return;
    }

    addMember(trimmedName);
    setName('');
    setError('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (error) setError('');
  };

  return (
    <div className="space-y-1">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="text"
          placeholder="팀원 이름 입력..."
          value={name}
          onChange={handleChange}
          className={error ? 'border-destructive flex-1' : 'flex-1'}
        />
        <Button type="submit" size="icon" disabled={!name.trim()}>
          <Plus className="h-4 w-4" />
        </Button>
      </form>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
