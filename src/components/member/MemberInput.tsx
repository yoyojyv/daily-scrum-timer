'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useScrumStore } from '@/stores/useScrumStore';

export function MemberInput() {
  const [name, setName] = useState('');
  const addMember = useScrumStore((state) => state.addMember);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      addMember(name.trim());
      setName('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="text"
        placeholder="팀원 이름 입력..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="flex-1"
      />
      <Button type="submit" size="icon" disabled={!name.trim()}>
        <Plus className="h-4 w-4" />
      </Button>
    </form>
  );
}
