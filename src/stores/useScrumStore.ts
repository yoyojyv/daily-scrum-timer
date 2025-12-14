import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Member, MeetingStatus, Theme } from '@/types';

interface ScrumTimerState {
  // Members
  members: Member[];
  shuffledOrder: string[];
  currentMemberIndex: number;
  addMember: (name: string) => void;
  removeMember: (id: string) => void;
  toggleVacation: (id: string) => void;
  shuffleMembers: () => void;
  resetMemberStatus: () => void;

  // Timer
  timeLeft: number;
  totalTime: number;
  isRunning: boolean;
  meetingStatus: MeetingStatus;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  extendTime: (seconds: number) => void;
  nextMember: () => void;
  startMeeting: () => void;
  resetMeeting: () => void;
  tick: () => void;

  // Settings
  defaultTime: number;
  extendUnit: number;
  soundEnabled: boolean;
  warningEnabled: boolean;
  setDefaultTime: (seconds: number) => void;
  setExtendUnit: (seconds: number) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setWarningEnabled: (enabled: boolean) => void;

  // Theme
  theme: Theme;
  toggleTheme: () => void;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const useScrumStore = create<ScrumTimerState>()(
  persist(
    (set, get) => ({
      // Members
      members: [],
      shuffledOrder: [],
      currentMemberIndex: 0,

      addMember: (name: string) => {
        const newMember: Member = {
          id: generateId(),
          name: name.trim(),
          isOnVacation: false,
          isCompleted: false,
          elapsedTime: 0,
        };
        set((state) => ({
          members: [...state.members, newMember],
        }));
      },

      removeMember: (id: string) => {
        set((state) => ({
          members: state.members.filter((m) => m.id !== id),
          shuffledOrder: state.shuffledOrder.filter((orderId) => orderId !== id),
        }));
      },

      toggleVacation: (id: string) => {
        set((state) => ({
          members: state.members.map((m) =>
            m.id === id ? { ...m, isOnVacation: !m.isOnVacation } : m
          ),
        }));
      },

      shuffleMembers: () => {
        const { members } = get();
        const activeMembers = members.filter((m) => !m.isOnVacation);
        const shuffled = shuffleArray(activeMembers.map((m) => m.id));
        set({ shuffledOrder: shuffled, currentMemberIndex: 0 });
      },

      resetMemberStatus: () => {
        set((state) => ({
          members: state.members.map((m) => ({ ...m, isCompleted: false })),
          currentMemberIndex: 0,
        }));
      },

      // Timer
      timeLeft: 60,
      totalTime: 60,
      isRunning: false,
      meetingStatus: 'idle',

      startTimer: () => {
        set({ isRunning: true, meetingStatus: 'running' });
      },

      pauseTimer: () => {
        set({ isRunning: false, meetingStatus: 'paused' });
      },

      resetTimer: () => {
        const { defaultTime, isRunning } = get();
        set({ timeLeft: defaultTime, totalTime: defaultTime, isRunning });
      },

      extendTime: (seconds: number) => {
        set((state) => ({
          timeLeft: state.timeLeft + seconds,
          totalTime: state.totalTime + seconds,
        }));
      },

      nextMember: () => {
        const { shuffledOrder, currentMemberIndex, members, defaultTime } = get();
        const currentMemberId = shuffledOrder[currentMemberIndex];

        // Mark current member as completed
        const updatedMembers = members.map((m) =>
          m.id === currentMemberId ? { ...m, isCompleted: true } : m
        );

        const nextIndex = currentMemberIndex + 1;
        if (nextIndex >= shuffledOrder.length) {
          // All members completed
          set({
            members: updatedMembers,
            meetingStatus: 'completed',
            isRunning: false,
          });
        } else {
          // Auto-start next person's timer
          set({
            members: updatedMembers,
            currentMemberIndex: nextIndex,
            timeLeft: defaultTime,
            totalTime: defaultTime,
            isRunning: true,
            meetingStatus: 'running',
          });
        }
      },

      startMeeting: () => {
        const { shuffledOrder, members, defaultTime } = get();

        // Use current order if already shuffled, otherwise shuffle
        let order = shuffledOrder;
        if (order.length === 0) {
          const activeMembers = members.filter((m) => !m.isOnVacation);
          order = activeMembers.map((m) => m.id);
        }

        set({
          shuffledOrder: order,
          currentMemberIndex: 0,
          meetingStatus: 'running',
          isRunning: true,
          timeLeft: defaultTime,
          totalTime: defaultTime,
          members: members.map((m) => ({ ...m, isCompleted: false, elapsedTime: 0 })),
        });
      },

      resetMeeting: () => {
        const { members, defaultTime } = get();
        set({
          shuffledOrder: [],
          currentMemberIndex: 0,
          meetingStatus: 'idle',
          isRunning: false,
          timeLeft: defaultTime,
          totalTime: defaultTime,
          members: members.map((m) => ({ ...m, isCompleted: false, elapsedTime: 0 })),
        });
      },

      tick: () => {
        set((state) => {
          if (state.timeLeft <= 0) {
            return { isRunning: false };
          }

          // Increment current member's elapsed time
          const currentMemberId = state.shuffledOrder[state.currentMemberIndex];
          const updatedMembers = state.members.map((m) =>
            m.id === currentMemberId
              ? { ...m, elapsedTime: m.elapsedTime + 1 }
              : m
          );

          return {
            timeLeft: state.timeLeft - 1,
            members: updatedMembers,
          };
        });
      },

      // Settings
      defaultTime: 60,
      extendUnit: 30,
      soundEnabled: true,
      warningEnabled: true,

      setDefaultTime: (seconds: number) => {
        set({ defaultTime: seconds, timeLeft: seconds, totalTime: seconds });
      },

      setExtendUnit: (seconds: number) => {
        set({ extendUnit: seconds });
      },

      setSoundEnabled: (enabled: boolean) => {
        set({ soundEnabled: enabled });
      },

      setWarningEnabled: (enabled: boolean) => {
        set({ warningEnabled: enabled });
      },

      // Theme
      theme: 'light',

      toggleTheme: () => {
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        }));
      },
    }),
    {
      name: 'scrum-timer-storage',
      partialize: (state) => ({
        members: state.members,
        defaultTime: state.defaultTime,
        extendUnit: state.extendUnit,
        soundEnabled: state.soundEnabled,
        warningEnabled: state.warningEnabled,
        theme: state.theme,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (!error && state) {
          // Sync timer with defaultTime after rehydration
          // Also ensure all members have elapsedTime field (for backward compatibility)
          const membersWithElapsedTime = state.members.map((m) => ({
            ...m,
            elapsedTime: m.elapsedTime ?? 0,
          }));
          useScrumStore.setState({
            timeLeft: state.defaultTime,
            totalTime: state.defaultTime,
            members: membersWithElapsedTime,
          });
        }
      },
    }
  )
);
